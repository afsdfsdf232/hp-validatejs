import {
  ruleItemOptions,
  ruleTypes
} from './ruleTypes.js'
/**
 * @description 判断数据类型
 * @enum ['null','string','undefind','function','array','number','object']
 * */
export const targetType = (target, _type) => {
  const type = Object.prototype.toString.call(target);
  if (_type) return type.slice(8, -1).toLocaleLowerCase() === _type;
  return type.slice(8, -1).toLocaleLowerCase()
}

/**
 * @description 检查规则类型
 */
export const checkRuleType = rules => {
  const types = ['array', 'object', 'function', 'regexp']
  const currentType = targetType(rules);
  return types.includes(currentType)
}

/**
 * @description 验证输入规则类型和值类型，多个key验证
 * */
export const checkRuleAllType = (rules, values) => {
  return targetType(rules, 'object') && (targetType(values, 'object') || targetType(values, 'array'))
}

/**
 * @description 验证最大值最小值
 * */
const VerificationExtremum = (value, min, max) => min <= value && value <= max;

/**
 * @description 验证规则内容
 */
export const validateTargetRules = (values, cb) => errorhandle('The rule format is incorrect', '', values, cb)


/**
 * @description 验证是否是整数
 */
export const isInteger = value => Number.isInteger(value)

/**
 * @description 验证小数位最多保留的位数
 * */
export const isDecimal = (value, dec) => {
  if (Number.isFinite(dec)) {
    const strValue = typeof value === 'string' ? value : String(value);
    const decArr = strValue.split('.');
    return decArr.length <= dec
  }
  return true;
}

/**
 * @description 验证字符串长度
 * */
export const isLength = (value, len) => {
  if (Number.isFinite(len)) {
    const str = typeof value === 'string' ? value : String(value);
    return str.length <= len
  }
  return true
}

/**
 * @description 错误处理函数
 * */
const errorhandle = (error, key, value, cb) => {
  const errorDetails = {
    validate: false,
    errors: []
  }
  if (targetType(error, 'array')) {
    errorDetails.errors = error;
  } else if (targetType(error, 'string')) {
    errorDetails.errors.push({
      message: error,
      key,
      value
    })
  }
  if (targetType(cb,'function')) return cb(errorDetails);
  
  // 处理key
  errorDetails.errors.forEach( errItem => {
    if (errItem.hasOwnProperty('key')) {
      if (errItem.key.trim() === '') {
        delete errItem.key;
      }
    }
  })
  return Promise.resolve(errorDetails)
}

/**
 * @description 成功返回
 * */
const successhandle = (cb) => {
  const successDetails = {
    validate: true,
    errors: []
  }
  if (typeof cb === 'function') return cb(successDetails);
  return Promise.resolve(successDetails)
}

/**
 * @description 数组类型规则验证 Array
 * */
export const arrayTypeVerification = async (rules, key = '', values, cb) => {
  // 存储错误信息, 存在错误就push进去
  const result = []
  if (rules.length === 0) return successhandle(cb);
  const rulesFn = []

  rules.map(async (item) => {
    if (targetType(item, 'object')) {
      rulesFn.push(objectTypeVerification(item, key, values))
    }
    if (targetType(item, 'function')) {
      rulesFn.push(funTypeVerification(item, key, values))
    }

    if (targetType(item, 'regexp')) {
      rulesFn.push(await regTypeVerification(item, key, values))
    }
  })
  if (rulesFn.length > 0) {
    const list = await Promise.all(rulesFn)
    let _index = 0;
    const len = list.length;
    while (_index < len) {
      const { validate, errors } = list[_index]
      if (!validate) result.push(...errors);
      _index++
    }
  }

  if (result.length > 0) return errorhandle(result, '', values, cb);
  return successhandle(cb)
}

/**
 * @description 单个规则验证 Object，单个规则
 * */
export const objectTypeVerification = async (rules, key, values, cb) => {
  const { type, length, min, max, integer, decimal, message, validator, regExp } = Object.assign({}, ruleItemOptions, rules);
  const pushErr = async (key = '', value, message) => {
    const { errors } = await errorhandle(message, key, value);
    errContent.errors.push(...errors)
  }
  const errContent = {
    errors: [],
    validate: true
  }
  // 验证type类型值
  if (targetType(ruleTypes['is_' + type], 'function')) {
    const validateTyps = ruleTypes['is_' + type](values);
    if (!validateTyps.validate) await pushErr(key, values, message || validateTyps.message);
  }
  // 验证 min max
  if (rules.min || rules.max) {
    // 先校验是否是数字
    if (ruleTypes.is_number(values).validate) {
      const extremum = VerificationExtremum(values, min, max);
      if (!extremum) await pushErr(key, values, message);
    }

  }
  // 验证整数
  if (integer && !isInteger(values)) await pushErr(key, values, message);
  // 验证小数最多保留的位数
  if (!integer && !isDecimal(values, decimal)) await pushErr(key, values, message);

  // 验证字符长度
  if (!isLength(values, length)) await pushErr(key, values, message);

  // 自定义函数验证
  if (targetType(validator, 'function')) {
    try {
      await validator(rules, values)
    } catch (err) {
      const errMessage = targetType(err,'string')? err : err.message;
      await pushErr(key, values, errMessage || message)
    }
  }

  // 正则验证
  if (targetType(regExp, 'regexp') && !regExp.test(regExp)) await pushErr(key, values, message);
  errContent.validate = errContent.errors.length === 0;
  if (errContent.validate) return successhandle(cb);
  return errorhandle(errContent.errors, key, values, cb)
}

/**
 * @description 规则为函数时候验证, 单个函数
 */
export const funTypeVerification = async (validator, key, values, cb) => {
  try {
    await validator(values)
    return  successhandle(cb)
  } catch (err) {
    // err 可能是 Error 对象，获取message即可
    const message = targetType(err,'string')? err : err.message;
    return  errorhandle(message, key, values, cb)
  }
}

/**
 * @description 规则为正则表达式验证
 * */
export const regTypeVerification = (reg, key = '', values, cb) => {
  const state = reg.test(values);
  if (state) return successhandle(cb);
  return errorhandle([{
    message: '',
    key: key,
    value: values
  }], '', values, cb)

}

const handleRulesAll = (rule, key, value) => {
  if (checkRuleType(rule)) {
    if (targetType(rule, 'function')) {
      return funTypeVerification(rule, key, value)
    }
    if (targetType(rule, 'object')) {
      return objectTypeVerification(rule, key, value)
    }
    if (targetType(rule, 'regexp')) {
      return regTypeVerification(rule, key, value)
    }
    if (targetType(rule, 'array')) {
      return arrayTypeVerification(rule, key, value)
    }
  }
   
}

/**
 * @description 验证多个value规则
 * */
export const validateAllRules = async (rules, values, cb) => {
  const errContent = {
    errors: [],
    validate: true
  }
  const rulesFn = []
  if (targetType(values, 'array')) {
    if (values.length > 0) {
      const len = values.length
      let _index = 0
      while (_index < len) {
        const { key, value } = values[_index]
        rulesFn.push(handleRulesAll(rules[key], key, value))
        _index++
      }
    }
  }

  if (targetType(values, 'object')) {
    for(const key in values) {
      rulesFn.push(handleRulesAll(rules[key], key, values[key]))
    } 
  }
  if (rulesFn.length>0) {
    const list = await Promise.all(rulesFn)
    if (list && list.length > 0) {
      list.map(({ validate, errors }) => {
        if (!validate) errContent.errors.push(...errors);
      })
    }
  }


  errContent.validate = errContent.errors.length === 0;
  if (errContent.validate) return successhandle(cb);
  return errorhandle(errContent.errors, '', values, cb)
}
/* eslint-disable no-prototype-builtins */
/**
 * @description 判断数据类型
 * @enum ['null','string','undefind','function','array','number','object']
 * */
export const targetType = (target, _type) => {
  const type = Object.prototype.toString.call(target)
  if (_type) return type.slice(8, -1).toLocaleLowerCase() === _type
  return type.slice(8, -1).toLocaleLowerCase()
}

/**
 * @description 检查规则类型和values(多个值验证)
 */
export const checkRuleType = (rules, type, values) => {
  if (type === 'even') {
    const types = ['array', 'object', 'function', 'regexp']
    const currentType = targetType(rules)
    console.log('currentType:', currentType)
    return types.includes(currentType)
  }
  if (type === 'odd') {
    return targetType(rules, 'object') && (targetType(values, 'object') || targetType(values, 'array'))
  }
}

/**
 * @description 验证规则内容
 */
export const validateTargetRules = (values, cb) => errorhandle('The rule format is incorrect', '', values, cb)

/**
 * @description 错误处理函数
 * */
export const errorhandle = (error, key, value, cb) => {
  const errorDetails = {
    validate: false,
    errors: []
  }
  if (targetType(error, 'array')) {
    errorDetails.errors = error
  } else if (targetType(error, 'string')) {
    errorDetails.errors.push({
      message: error,
      key,
      value
    })
  }
  if (targetType(cb, 'function')) return cb(errorDetails)
  // 处理key
  errorDetails.errors.forEach(errItem => {
    // eslint-disable-next-line no-prototype-builtins
    if (errItem.hasOwnProperty('key')) {
      if (errItem.key.trim() === '') {
        delete errItem.key
      }
    }
  })
  return Promise.resolve(errorDetails)
}

/**
 * @description 成功返回
 * */
export const successhandle = (cb) => {
  const successDetails = {
    validate: true,
    errors: []
  }
  if (typeof cb === 'function') return cb(successDetails)
  return Promise.resolve(successDetails)
}

/**
 * @description 获取对象中某些字段
 * @returns Object maps:需要修改对象key值
 * */
export const pick = (target, queryList, maps) => {
  if (targetType(target, 'object') && targetType(queryList, 'array')) {
    const result = {}
    queryList.map(query => {
      if (target.hasOwnProperty(query)) {
        result[query] = target[query]
      }
    })
    if (targetType(maps, 'object')) {
      for (const key in maps) {
        if (result.hasOwnProperty(key)) {
          result[maps[key]] = result[key]
          delete result[key]
        }
      }
    }
    return result
  }
  return target
}

/**
 * @description 解析url参数
 * @param {string} url
 * @returns {Object}
 */
export const queryParams = url => {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

/**
 * @description 防抖
 * */
export const debounce = (func, wait, immediate) => {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * @description 克隆
 * */
export const deepClone = obj => {
// 深度克隆
  // 对常见的“非”值，直接返回原来值
  if ([null, undefined, NaN, false].includes(obj)) return obj
  if (typeof obj !== 'object' && typeof obj !== 'function') {
    // 原始类型直接返回
    return obj
  }
  const o = targetType(obj, 'array') ? [] : {}
  for (const i in obj) {
    if (obj.hasOwnProperty(i)) {
      o[i] = typeof obj[i] === 'object' ? deepClone(obj[i]) : obj[i]
    }
  }
  return o
}

// JS对象深度合并
export const deepMerge = (target = {}, source = {}) => {
  target = deepClone(target)
  if (typeof target !== 'object' || typeof source !== 'object') return false
  for (var prop in source) {
    if (!source.hasOwnProperty(prop)) continue
    if (prop in target) {
      if (typeof target[prop] !== 'object') {
        target[prop] = source[prop]
      } else {
        if (typeof source[prop] !== 'object') {
          target[prop] = source[prop]
        } else {
          if (target[prop].concat && source[prop].concat) {
            target[prop] = target[prop].concat(source[prop])
          } else {
            target[prop] = deepMerge(target[prop], source[prop])
          }
        }
      }
    } else {
      target[prop] = source[prop]
    }
  }
  return target
}

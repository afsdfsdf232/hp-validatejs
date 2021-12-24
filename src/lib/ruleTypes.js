import { targetType } from './utils.js'
import { mobileReg, idReg, emailReg, carReg, passwordReg, urlReg } from './regexps.js'
const validateValue = (type, value) => {
  const validate = targetType(value, type)
  const result = {
    validate,
    message: ''
  }
  if (!validate) result.message = `${value} Not a ${type}`
  return result
}

const validateReg = (reg, value, message) => {
  const validate = reg.test(value)
  const result = {
    validate,
    message: ''
  }
  if (!validate) result.message = message
  return result
}
export const ruleTypes = {
  is_any: () => ({ validate: true }), // 默认任意类型值
  is_string: value => validateValue('string', value), // 验证为字符串类型
  is_number: value => validateValue('number', value), // 验证为数字类型
  is_object: value => validateValue('object', value), // 验证为对象类型
  is_array: value => validateValue('array', value), // 验证为数组类型值
  is_boolean: value => validateValue('boolean', value), // 验证为Boolean值类型
  is_function: value => validateValue('function', value), // 验证是否函数
  is_date: value => validateValue('date', value), // 验证是否为时间类型
  is_null: value => validateValue('null', value), // 验证是否为null
  is_undefined: value => validateValue('undefined', value), // 验证是否为undefined
  is_nan: value => validateValue('nan', value),
  is_regexp: value => validateValue('regexp', value), // 是否是正则验证
  is_email: value => validateReg(emailReg, value, '邮箱格式不正确'), // 验证是否为邮箱
  is_mobile: value => validateReg(mobileReg, value, '手机号码格式不正确'), // 电话号码验证
  is_id: value => validateReg(idReg, value, '身份证号码格式不正确'), // 身份证号码验证
  is_carCode: value => validateReg(carReg, value, '车牌号码格式不正确'), // 车牌号验证
  is_password: value => validateReg(passwordReg, value, '密码格式不正确'), // 密码验证
  is_url: value => validateReg(urlReg, value, '路径格式不正确')
}
export const ruleItemOptions = {
  min: -Infinity, // 最小值
  max: Infinity, // 最大值
  type: 'any', // 类型
  length: Infinity, // 字符串长度
  integer: false, // 是否为整数
  decimal: Infinity, // 保留小数点位数
  validator: null, // 自定义验证函数
  regExp: null // 对象中的正则验证
}

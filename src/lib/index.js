import {
  targetType,
  checkRuleType,
  checkRuleAllType,
  validateTargetRules,
  arrayTypeVerification,
  regTypeVerification,
  funTypeVerification,
  objectTypeVerification,
  validateAllRules
} from './utils.js';

/**
 * @description 单个值和规则校验
*/
export const validate = (rules, values, cb) => {
  const rulesType = targetType(rules);
  // 验证规则是否符合规范
  if (!checkRuleType(rules)) return validateTargetRules(values, cb);
  // 验证规则
  return validateRules(rulesType, rules, values, cb)
};

/**
 * @description 验证规则
 * */
const validateRules = (type, rules, values, cb) => {
    //规则为数组
    if (type === 'array') {
      return arrayTypeVerification(rules, '', values, cb)
    }
  
    // 规则为正则
    if (type === 'regexp') {
      return regTypeVerification(rules, '', values, cb )
    }
    // 规则为单个对象
    if (type === 'object') {
      return objectTypeVerification(rules, '', values, cb)
    }

    // 规则为函数
    if (type === 'function') {
      return funTypeVerification(rules, '', values, cb)
    }
}

/**
 * @description 验证多个内容
 * */
export const validateAll = (rules, values, cb) => {
  // 验证规则是否符合规范
  if (!checkRuleAllType(rules,values)) return validateTargetRules(values, cb);
  return validateAllRules(rules, values, cb)
}
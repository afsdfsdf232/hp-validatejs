import { checkRuleType, validateTargetRules } from './utils.js'
import { handleRulesAll, validateAllRules } from './verification.js'

/**
 * @description 单个值和规则校验
*/
export const validate = (rules, values, cb) => {
  // 验证规则是否符合规范
  if (!checkRuleType(rules, 'even')) return validateTargetRules(values, cb)
  // 验证规则
  return handleRulesAll(rules, '', values, cb)
}

/**
 * @description 验证多个内容
 * */
export const validateAll = (rules, values, cb) => {
  // 验证规则是否符合规范
  if (!checkRuleType(rules, 'odd', values)) return validateTargetRules(values, cb)
  return validateAllRules(rules, values, cb)
}

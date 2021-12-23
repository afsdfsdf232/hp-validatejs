/**
 * @description 验证规则集合
 * */ 

/**
 * @description 电话号码验证规则
 * */ 
export const mobileReg = new RegExp(/^(13[0-9]|14[01456879]|15[0-3,5-9]|16[2567]|17[0-8]|18[0-9]|19[0-3,5-9])d{8}$/);

/**
 * @description 邮箱验证规则
 * */ 
export const emailReg = new RegExp(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-]{2,3}){1,2}$/);

/**
 * @description 身份证验证规则 身份证号(18位数字)，最后一位是校验位，可能为数字或字符X
 * */ 
export const idReg = new RegExp(/^[1-8][1-7]\d{4}(?:19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}[\dX]$/);

/**
 * @description 汉字验证
 * */ 
export const chineseReg = new RegExp(/^[\u4e00-\u9fa5]{0,}$/);

/**
 * @description 车牌验证
 * */
export const carReg = new RegExp(/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/);

/**
 * @description 密码验证 至少数字、字母、特殊符号中的两种 大于8个字符
 * */ 
export const passwordReg = new RegExp(/^(?!\d+$)(?![a-zA-Z]+$)(?![^a-zA-Z0-9]+$)\S{8,}$/)
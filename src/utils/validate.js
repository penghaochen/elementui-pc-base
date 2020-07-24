/**
 * Created by phc
 */

// const clientNoPattern = /^[0-9]+$/ // 客户号数字正则
// const cardNoPattern = /^([1-9]{1})(\d{15}|\d{18})$/ // 银行卡号正则
// const phoneNoPattern = /^1[3-9]\d{9}$/ // 手机号码正则
// const msgNoPattern = /^[0-9]{6}$/ // 短信验证码正则

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * 判断是否为空
 */
export function validatenull(val) {
  if (typeof val === 'boolean') {
    return false
  }
  if (typeof val === 'number') {
    return false
  }
  if (val instanceof Array) {
    if (val.length === 0) return true
  } else if (val instanceof Object) {
    if (JSON.stringify(val) === '{}') return true
  } else {
    if (val === 'null' || val == null || val === 'undefined' || val === undefined || val === '') return true
    return false
  }
  return false
}

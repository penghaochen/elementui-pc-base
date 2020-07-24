
import request from '@/utils/request'

/**
 * 新增验证
 * @param data 新增上传表单
 */
export const saveDictionary = (data) => {
  const url = 'trans/dictionary/saveDictionary'
  return request({
    url: url,
    method: 'post',
    data
  })
}
/**
 * 修改验证
 * @param data 修改上传表单
 */
export const editDictionary = (data) => {
  const url = 'trans/dictionary/editDictionary'
  return request({
    url: url,
    method: 'post',
    data
  })
}
/**
 * 删除验证
 * @param id 删除上ID
 */
export const deleteDictionaryById = ({ id }) => {
  const params = { id: id }
  return request({
    url: 'trans/dictionary/deleteDictionaryById',
    params,
    method: 'get'
  })
}

/**
 * 分页查询
 * @param params 上传参数
 */
export const getDictionaryPage = ({ limit, page, description }) => {
  const params = { size: limit, current: page, description: description }
  return request({
    url: 'trans/dictionary/getDictionaryPage',
    params,
    method: 'get'
  })
}

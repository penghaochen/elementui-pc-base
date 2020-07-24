
import request from '@/utils/request'

/**
 * 新增验证
 * @param data 新增上传表单
 */
export const saveRspMsg = (data) => {
  const url = 'trans/rspMsg/saveRspMsg'
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
export const editRspMsg = (data) => {
  const url = 'trans/rspMsg/editRspMsg'
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
export const deleteRspMsgById = ({ id }) => {
  const params = { id: id }
  return request({
    url: 'trans/rspMsg/deleteRspMsgById',
    params,
    method: 'get'
  })
}

/**
 * 分页查询
 * @param params 上传参数
 */
export const getRspMsgPage = ({ limit, page, rspCode }) => {
  const params = { size: limit, current: page, rspCode: rspCode }
  return request({
    url: 'trans/rspMsg/getRspMsgPage',
    params,
    method: 'get'
  })
}

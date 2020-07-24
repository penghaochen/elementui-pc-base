import request from '@/utils/request'

/**
 * 获取应用列表
 * @param page
 * @param limit
 */
export const getNotifyHttpLogs = ({ page, limit, url, type, result }) => {
  const params = { page: page, limit: limit, url: url, type: type, result: result }
  return request({
    url: 'msg/webhook/logs',
    params,
    method: 'get'
  })
}

/**
 * 获取批量列表
 * @param page
 * @param limit
 */
export const getBatchLogs = ({ pageNo, pageSize, status, openId }) => {
  const params = { pageNo: pageNo, pageSize: pageSize, status: status, openId: openId }
  return request({
    url: 'wcb/msg/log/all',
    params,
    method: 'get'
  })
}

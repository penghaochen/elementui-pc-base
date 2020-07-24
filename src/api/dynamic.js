
import request from '@/utils/request'

/**
 * 新增
 * @param data 新增上传表单
 */
export const save = (data) => {
  const url = 'trans/dynamicconfiguration/publishConfig'
  return request({
    url: url,
    method: 'post',
    data
  })
}
/**
 * 修改
 * @param data 修改上传表单
 */
export const edit = (data) => {
  const url = 'trans/dynamicconfiguration/updateConfig'
  return request({
    url: url,
    method: 'post',
    data
  })
}
/**
 * 分页查询
 * @param params 上传参数
 */
export const getDynamicPage = ({ limit, page }) => {
    const params = { size: limit, current: page }
    return request({
      url: 'trans/dynamicconfiguration/page',
      params,
      method: 'get'
    })
  }
  /**
 * 查询数据库表
 * @param params 上传参数
 */
export const getTables = ({}) => {
  const params = {}
  return request({
    url: 'trans/dynamicconfiguration/queryTableList',
    params,
    method: 'get'
  })
}
  /**
 * 查询数据库表中字段
 * @param params 上传参数
 */
export const getColumnNames = ({tableName}) => {
  const params = {tableName:tableName}
  return request({
    url: 'trans/dynamicconfiguration/queryTableColumns',
    params,
    method: 'get'
  })
}

  /**
 * 刷新动态配置
 * @param params 上传参数
 */
export const refresh = ({id}) => {
  const params = { id: id }
  // const params = {id:id,namespace:namespace,nacosGroup:nacosGroup,databaseTable:databaseTable,nacosKey:nacosKey,fields:fields}
  return request({
    url: 'trans/dynamicconfiguration/renewConfig',
    params,
    method: 'get'
  })
}
/**
 * 删除
 * @param id 删除上ID
 */
export const deleteById = ({ id }) => {
  const params = { id: id }
  return request({
    url: 'trans/dynamicconfiguration/deleteConfig',
    params,
    method: 'get'
  })
}
import axios from 'axios'
import qs from 'qs'
import $config from '@/settings/defaultSetting'
import { getToken } from '@/utils//util'
import { Message } from 'element-ui'
import { sign } from '@/utils/sign'
import { encrypt, decrypt } from '@/utils/encryption/aes' // aes加解密方法
import { decBase64, guid } from '@/utils/common' // base64和生成uuid方法
import { RSAencrypt } from '@/utils/encryption/rsa' // rsa加解密方法
let baseUrl = ''
switch (process.env.NODE_ENV) {
  case 'development':
    // 这里是本地的请求url
    baseUrl = $config.apiUrl.dev
    break
  case 'production':
    // 生产环境url
    baseUrl = $config.apiUrl.pro
    break
}

/**
 * 创建axios实例
 * @type {AxiosInstance}
 */
const service = axios.create({
  // api的base_url
  baseURL: baseUrl,
  // 设置请求超时时间30s
  headers: $config.apiUrl.headers,
  timeout: $config.apiUrl.timeout
})

service.apiUrl = baseUrl
let aesKey = ''
/**
 * 请求参数处理
 */
service.interceptors.request.use((config) => {
  // 参数签名处理

  config = sign(config, $config.appId, $config.appSecret, 'SHA256')
  config.method === 'get'
    ? config.params = qs.stringify({ ...config.params }) : config.data = JSON.stringify(config.data)

  const token = getToken()
  // config.headers['Bl'] = '1'
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token
  }
  config.headers['Accept'] = '*/* '

  // base64的rsa公钥
  const key = 'TUlHZk1BMEdDU3FHU0liM0RRRUJBUVVBQTRHTkFEQ0JpUUtCZ1FDbHFGcU5BakVNT1lROER1NjF4RDdOaEJJcHIxVmkrUlNqYlV4bHdJendhRzNoZjRzdTZ1QkM4djlUTU5NLzBhQm0rZ2dVbmNFTmU1NTQ4L0lTM0RJaTNoWkY1clRzUlVXTDhuZDlVUHl1VjhoYWFKVFhscldKSmZuTUszTUVGaEJ1RlVpNmQ2OHF0WGNRMGhHbU9ITXA0L29JNnlqLzBQRW4xaXhXRjhENXp3SURBUUFC'
  // 对rsa公钥进行base64
  // const rsaKey = encBase64(key)
  // 用uuid生成aes的公钥
  aesKey = guid()
  // rsa对aes公钥进行加密
  const rev = RSAencrypt(aesKey, decBase64(key))
  // 请求头放经过rsa加密的aes的公钥
  config.headers.rev = rev
  if (config.url.slice(0, 1) !== '/') {
    config.url = '/' + config.url
  }
  if (config.url === '/initial/api/list') {
    config.params = { request: config.params }
  } else {
    const allApiList = window.sessionStorage.getItem('apiList')
    const allApiList1 = JSON.parse(allApiList)
    if (config.url.indexOf('?') !== -1) {
      config.url = config.url.split('?')[0]
    }
    try {
      allApiList1.forEach(v => {
        if (config.url === v.path) {
          if (config.method === 'post') {
            // 接口加密
            const data = encrypt(config.data, aesKey)
            // const data = config.data
            config.data = qs.stringify({ request: data })
          } else {
            // 接口加密
            const params = encrypt(config.params, aesKey)
            // const params = config.params
            config.params = { request: params }
          }
          throw new Error('ending')
        }
      })
      if (config.method === 'post') {
        // 接口加密
        // const data = encrypt(config.data, aesKey)
        const data = config.data
        config.data = qs.stringify({ request: data })
      } else {
        // 接口加密
        // const params = encrypt(config.params, aesKey)
        const params = config.params
        config.params = { request: params }
      }
    } catch (e) {
      console.log(e)
    }
  }

  return config
}
)
/**
 * 响应结果处理
 */
service.interceptors.response.use(
  (response) => {
    if (response.config.url !== '/pmobile/initial/api/list') {
      if (response.data.isEncrypt === '1') {
        response.data = JSON.parse(decrypt(response.data.response, aesKey))
      } else {
        response.data = JSON.parse(response.data.response)
      }
    }

    // 批量查询专用
    if (response.config.url === '/pmobile/wcb/msg/log/all') {
      return Promise.resolve(response.data)
    }
    if (response.data.returnCode === '000000') {
      response.data.code = 0
      // 服务端定义的响应code码为0时请求成功
      // 使用Promise.resolve 正常响应
      return Promise.resolve(response.data)
    } else {
      // 使用Promise.reject 响应
      Message.error({ message: response.data.message })
      return Promise.reject(response.data)
    }
  }, error => {
    let message = ''
    if (error && error.response) {
      switch (error.response.status) {
        case 401:
          location.reload()
          return
        case 403:
          message = error.response.data.path + ',' + error.response.data.message
          break
        case 429:
          message = '访问太过频繁，请稍后再试!'
          break
        default:
          message = error.response.data.message ? error.response.data.message : '服务器错误'
          break
      }
      Message.error({ message: message })
      // 请求错误处理
      return Promise.reject(error)
    } else {
      message = '连接服务器失败'
      Message.error({ message: message })
      return Promise.reject(error)
    }
  }
)

export default service

import Mock from 'mockjs'
import { param2Obj } from '../src/utils'

// 登录
import login from './login'
// 用户
import userinfo from './user'
// 应用管理
import app from './system/app.js'
// 用户管理
import user from './system/user.js'
// 开发者管理
import developer from './system/developer.js'
// 功能菜单
import menu from './system/menu.js'
// 角色菜单
import role from './system/role.js'
// API列表
import api from './gateway/api.js'
// 访问日志
import logs from './gateway/logs.js'
// 访问控制
import iplimit from './gateway/ip-limit.js'
// 流量控制
import ratelimit from './gateway/rate-limit.js'
// 网关路由
import route from './gateway/route.js'
// 响应信息
import dictionaryConfig from './transConfig/dictionaryConfig.js'
// 动态配置
import dynamic from './transConfig/dynamic.js'
// 数据字典
import patternStandard from './transConfig/patternStandard.js'
const mocks = [
  ...login,
  ...userinfo,
  ...app,
  ...user,
  ...developer,
  ...menu,
  ...role,
  ...api,
  ...logs,
  ...iplimit,
  ...ratelimit,
  ...route,
  ...dictionaryConfig,
  ...dynamic,
  ...patternStandard
]

// for front mock
// please use it cautiously, it will redefine XMLHttpRequest,
// which will cause many of your third-party libraries to be invalidated(like progress event).
export function mockXHR() {
  // mock patch
  // https://github.com/nuysoft/Mock/issues/300
  Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
  Mock.XHR.prototype.send = function() {
    if (this.custom.xhr) {
      this.custom.xhr.withCredentials = this.withCredentials || false

      if (this.responseType) {
        this.custom.xhr.responseType = this.responseType
      }
    }
    this.proxy_send(...arguments)
  }

  function XHR2ExpressReqWrap(respond) {
    return function(options) {
      let result = null
      if (respond instanceof Function) {
        const { body, type, url } = options
        // https://expressjs.com/en/4x/api.html#req
        result = respond({
          method: type,
          // body: JSON.parse(body),
          body: body,
          query: param2Obj(url)
        })
      } else {
        result = respond
      }
      return Mock.mock(result)
    }
  }

  for (const i of mocks) {
    Mock.mock(new RegExp(i.url), i.type || 'get', XHR2ExpressReqWrap(i.response))
  }
}

// for mock server
const responseFake = (url, type, respond) => {
  return {
    url: new RegExp(`/mock${url}`),
    type: type || 'get',
    response(req, res) {
      res.json(Mock.mock(respond instanceof Function ? respond(req, res) : respond))
    }
  }
}

export default mocks.map(route => {
  return responseFake(route.url, route.type, route.response)
})

export default [
  {
    url: '/base/gateway/service/list',
    type: 'get',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":[{"serviceId":"loongeasy-cloud-base-server","serviceName":"平台基础服务器"},{"serviceId":"loongeasy-cloud-uaa-admin-server","serviceName":"平台用户认证服务器"},{"serviceId":"loongeasy-cloud-uaa-portal-server","serviceName":"门户开发者认证服务器"},{"serviceId":"loongeasy-cloud-msg-server","serviceName":"消息服务器"},{"serviceId":"loongeasy-cloud-task-server","serviceName":"工作流服务器"},{"serviceId":"loongeasy-cloud-bpm-server","serviceName":"工作流服务器"},{"serviceId":"loongeasy-cloud-generator-server","serviceName":"在线代码生成服务器"},{"serviceId":"wcb-myaccount","serviceName":"微信银行账户查询服务"},{"serviceId":"wcb-auth","serviceName":"微信OAuth2授权服务"},{"serviceId":"wcb-binding","serviceName":"微信银行绑卡服务"},{"serviceId":"wcb-ereceiptapp","serviceName":"微信银行电子回单申请服务"},{"serviceId":"wcb-reportdemo","serviceName":"微信银行报表DEMO"},{"serviceId":"wcb-msg-log","serviceName":"微信银行异步处理日志查询服务"},{"serviceId":"wcb-msg-pusher","serviceName":"微信银行消息推送服务"},{"serviceId":"loongeasy-cloud-txconfig-server","serviceName":"交易配置服务器"},{"serviceId":"beai-mobilebank","serviceName":"beai手机银行后台服务"},{"serviceId":"beai-intelliroute","serviceName":"智能路由"},{"serviceId":"beai-routemanage","serviceName":"智能路由后管"}],"extra":{},"timestamp":"1595316299118"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/base/api',
    type: 'get',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{"records":[{"createTime":"2020-06-30 15:45:01","updateTime":"2020-07-08 14:51:44","apiId":"1277870741110411266","apiCode":"api00000000000000000000000000033","apiName":"查询转账交易列表","serviceId":"beai-mobilebank","apiCategory":"default","path":"/queryTransFlow","priority":0,"apiDesc":"","status":1,"isPersist":0,"isAuth":0,"isOpen":1,"requestMethod":"","contentType":"","className":"","methodName":"","isEncrypt":0},{"createTime":"2020-06-22 08:54:14","updateTime":"2020-06-22 08:54:14","apiId":"1274868261132959745","apiCode":"api00000000000000000000000000032","apiName":"动态配置---查询表列","serviceId":"loongeasy-cloud-txconfig-server","apiCategory":"default","path":"/dynamicconfiguration/queryTableColumns","priority":0,"apiDesc":"","status":1,"isPersist":0,"isAuth":0,"isOpen":1,"requestMethod":"","contentType":"","className":"","methodName":"","isEncrypt":0},{"createTime":"2020-06-22 08:52:57","updateTime":"2020-06-22 08:52:57","apiId":"1274867937936670722","apiCode":"api00000000000000000000000000031","apiName":"动态配置---查询数据库表","serviceId":"loongeasy-cloud-txconfig-server","apiCategory":"default","path":"/dynamicconfiguration/queryTableList","priority":0,"apiDesc":"","status":1,"isPersist":0,"isAuth":0,"isOpen":1,"requestMethod":"","contentType":"","className":"","methodName":"","isEncrypt":0},{"createTime":"2020-06-22 08:38:06","updateTime":"2020-06-22 08:38:06","apiId":"1274864202380476418","apiCode":"api00000000000000000000000000030","apiName":"动态配置---修改","serviceId":"loongeasy-cloud-txconfig-server","apiCategory":"default","path":"/dynamicconfiguration/updateConfig","priority":0,"apiDesc":"","status":1,"isPersist":0,"isAuth":0,"isOpen":1,"requestMethod":"","contentType":"","className":"","methodName":"","isEncrypt":0},{"createTime":"2020-06-22 08:36:12","updateTime":"2020-06-22 08:36:12","apiId":"1274863722107502594","apiCode":"api00000000000000000000000000029","apiName":"动态配置---删除","serviceId":"loongeasy-cloud-txconfig-server","apiCategory":"default","path":"/dynamicconfiguration/deleteConfig","priority":0,"apiDesc":"","status":1,"isPersist":0,"isAuth":0,"isOpen":1,"requestMethod":"","contentType":"","className":"","methodName":"","isEncrypt":0},{"createTime":"2020-06-22 08:33:00","updateTime":"2020-06-22 08:33:00","apiId":"1274862917765824514","apiCode":"api00000000000000000000000000028","apiName":"动态配置---更新","serviceId":"loongeasy-cloud-txconfig-server","apiCategory":"default","path":"/dynamicconfiguration/renewConfig","priority":0,"apiDesc":"","status":1,"isPersist":0,"isAuth":0,"isOpen":1,"requestMethod":"","contentType":"","className":"","methodName":"","isEncrypt":0},{"createTime":"2020-06-19 08:38:31","updateTime":"2020-06-19 08:38:31","apiId":"1273777143112794114","apiCode":"api00000000000000000000000000027","apiName":"智能路由后管服务","serviceId":"beai-routemanage","apiCategory":"default","path":"/**","priority":0,"apiDesc":"","status":1,"isPersist":0,"isAuth":0,"isOpen":1,"requestMethod":"","contentType":"","className":"","methodName":"","isEncrypt":0},{"createTime":"2020-06-17 13:56:15","updateTime":"2020-06-17 13:56:15","apiId":"1273132327098122242","apiCode":"api00000000000000000000000000026","apiName":"重新加载路由模板","serviceId":"beai-intelliroute","apiCategory":"default","path":"/reload","priority":0,"apiDesc":"","status":1,"isPersist":0,"isAuth":0,"isOpen":1,"requestMethod":"","contentType":"","className":"","methodName":"","isEncrypt":0},{"createTime":"2020-06-17 13:54:39","updateTime":"2020-06-17 13:54:39","apiId":"1273131923538968577","apiCode":"api00000000000000000000000000025","apiName":"跨行转账","serviceId":"beai-mobilebank","apiCategory":"default","path":"/transfer","priority":0,"apiDesc":"","status":1,"isPersist":0,"isAuth":0,"isOpen":1,"requestMethod":"","contentType":"","className":"","methodName":"","isEncrypt":0},{"createTime":"2020-06-17 10:43:52","updateTime":"2020-06-22 08:33:34","apiId":"1273083912666480641","apiCode":"api00000000000000000000000000024","apiName":"动态配置---发布","serviceId":"loongeasy-cloud-txconfig-server","apiCategory":"default","path":"/dynamicconfiguration/publishConfig","priority":0,"apiDesc":"","status":1,"isPersist":0,"isAuth":0,"isOpen":1,"requestMethod":"","contentType":"","className":"","methodName":"","isEncrypt":0}],"total":"167","size":"10","current":"1","page":1,"limit":10,"sort":"","order":"","requestMap":{"NONCE":"qfxefqg8wcp","SIGN":"FC4736DB358F8C2C0B7AE7DCF7FB6F4D0AFFE19E3852729E91CA388704CE4778","SIGN_TYPE":"SHA256","TIMESTAMP":"20200721152350","apiCode":"","apiName":"","path":"","serviceId":""},"orderBy":"","searchCount":true,"pages":"17"},"extra":{},"timestamp":"1595316299440"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/base/api/add',
    type: 'post',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{},"extra":{},"timestamp":"1595316463335"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/base/api/update',
    type: 'post',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{},"extra":{},"timestamp":"1595316520484"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/base/api/remove',
    type: 'post',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{},"extra":{},"timestamp":"1595316567687"}', 'isEncrypt': '0' }
    }
  }

]


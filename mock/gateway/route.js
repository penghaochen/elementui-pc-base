export default [
  {
    url: '/base/gateway/route',
    type: 'get',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{"records":[{"createTime":"2019-07-30 15:33:29","updateTime":"2019-07-30 15:33:29","routeId":"556587504019439616","routeName":"loongeasy-cloud-base-server","path":"/base/**","serviceId":"loongeasy-cloud-base-server","url":"","stripPrefix":0,"retryable":0,"status":1,"isPersist":1,"routeDesc":"平台基础服务器"},{"createTime":"2019-07-30 15:33:29","updateTime":"2019-07-30 15:33:29","routeId":"556595619813130240","routeName":"loongeasy-cloud-uaa-admin-server","path":"/admin/**","serviceId":"loongeasy-cloud-uaa-admin-server","url":"","stripPrefix":0,"retryable":0,"status":1,"isPersist":1,"routeDesc":"平台用户认证服务器"},{"createTime":"2019-07-30 15:33:29","updateTime":"2019-07-30 15:33:29","routeId":"556595619813130241","routeName":"loongeasy-cloud-uaa-portal-server","path":"/portal/**","serviceId":"loongeasy-cloud-uaa-portal-server","url":"","stripPrefix":0,"retryable":0,"status":1,"isPersist":1,"routeDesc":"门户开发者认证服务器"},{"createTime":"2019-07-30 15:33:29","updateTime":"2019-07-30 15:33:29","routeId":"556595914240688128","routeName":"loongeasy-cloud-msg-server","path":"/msg/**","serviceId":"loongeasy-cloud-msg-server","url":"","stripPrefix":0,"retryable":0,"status":1,"isPersist":1,"routeDesc":"消息服务器"},{"createTime":"2019-07-30 15:33:29","updateTime":"2019-07-30 15:33:29","routeId":"556595914240688139","routeName":"loongeasy-cloud-task-server","path":"/task/**","serviceId":"loongeasy-cloud-task-server","url":"","stripPrefix":0,"retryable":0,"status":1,"isPersist":1,"routeDesc":"工作流服务器"},{"createTime":"2019-07-30 15:33:29","updateTime":"2019-07-30 15:33:29","routeId":"556595914240688145","routeName":"loongeasy-cloud-bpm-server","path":"/bpm/**","serviceId":"loongeasy-cloud-bpm-server","url":"","stripPrefix":0,"retryable":0,"status":1,"isPersist":1,"routeDesc":"工作流服务器"},{"createTime":"","updateTime":"","routeId":"1152136796736503810","routeName":"loongeasy-cloud-generator-server","path":"/code/**","serviceId":"loongeasy-cloud-generator-server","url":"","stripPrefix":0,"retryable":0,"status":1,"isPersist":0,"routeDesc":"在线代码生成服务器"},{"createTime":"2020-04-08 18:02:24","updateTime":"2020-05-29 14:54:49","routeId":"1247827122077102081","routeName":"wcb-myaccount","path":"/wcb/myaccount/**","serviceId":"wcb-myaccount","url":"","stripPrefix":0,"retryable":0,"status":1,"isPersist":0,"routeDesc":"微信银行账户查询服务"},{"createTime":"2020-04-15 14:48:42","updateTime":"2020-05-29 14:54:59","routeId":"1250315091862192130","routeName":"wcb-auth","path":"/wcb/auth/**","serviceId":"wcb-auth","url":"","stripPrefix":0,"retryable":0,"status":1,"isPersist":0,"routeDesc":"微信OAuth2授权服务"},{"createTime":"2020-04-17 13:56:48","updateTime":"2020-04-17 13:58:40","routeId":"1251026805700206594","routeName":"wcb-binding","path":"/wcb/binding/**","serviceId":"wcb-binding","url":"","stripPrefix":0,"retryable":0,"status":1,"isPersist":0,"routeDesc":"微信银行绑卡服务"}],"total":"18","size":"10","current":"1","page":1,"limit":10,"sort":"","order":"","requestMap":{"NONCE":"xumsjrtia1e","SIGN":"DCEE353C73405779091B2945C99674F3B5E1351590846DAD60D5783D6241772F","SIGN_TYPE":"SHA256","TIMESTAMP":"20200721155104"},"orderBy":"","searchCount":true,"pages":"2"},"extra":{},"timestamp":"1595317933054"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/base/gateway/route/add',
    type: 'post',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{},"extra":{},"timestamp":"1595318050102"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/base/gateway/route',
    type: 'get',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{"records":[{"createTime":"2019-07-30 15:33:29","updateTime":"2019-07-30 15:33:29","routeId":"556587504019439616","routeName":"loongeasy-cloud-base-server","path":"/base/**","serviceId":"loongeasy-cloud-base-server","url":"","stripPrefix":0,"retryable":0,"status":1,"isPersist":1,"routeDesc":"平台基础服务器"},{"createTime":"2019-07-30 15:33:29","updateTime":"2019-07-30 15:33:29","routeId":"556595619813130240","routeName":"loongeasy-cloud-uaa-admin-server","path":"/admin/**","serviceId":"loongeasy-cloud-uaa-admin-server","url":"","stripPrefix":0,"retryable":0,"status":1,"isPersist":1,"routeDesc":"平台用户认证服务器"},{"createTime":"2019-07-30 15:33:29","updateTime":"2019-07-30 15:33:29","routeId":"556595619813130241","routeName":"loongeasy-cloud-uaa-portal-server","path":"/portal/**","serviceId":"loongeasy-cloud-uaa-portal-server","url":"","stripPrefix":0,"retryable":0,"status":1,"isPersist":1,"routeDesc":"门户开发者认证服务器"},{"createTime":"2019-07-30 15:33:29","updateTime":"2019-07-30 15:33:29","routeId":"556595914240688128","routeName":"loongeasy-cloud-msg-server","path":"/msg/**","serviceId":"loongeasy-cloud-msg-server","url":"","stripPrefix":0,"retryable":0,"status":1,"isPersist":1,"routeDesc":"消息服务器"},{"createTime":"2019-07-30 15:33:29","updateTime":"2019-07-30 15:33:29","routeId":"556595914240688139","routeName":"loongeasy-cloud-task-server","path":"/task/**","serviceId":"loongeasy-cloud-task-server","url":"","stripPrefix":0,"retryable":0,"status":1,"isPersist":1,"routeDesc":"工作流服务器"},{"createTime":"2019-07-30 15:33:29","updateTime":"2019-07-30 15:33:29","routeId":"556595914240688145","routeName":"loongeasy-cloud-bpm-server","path":"/bpm/**","serviceId":"loongeasy-cloud-bpm-server","url":"","stripPrefix":0,"retryable":0,"status":1,"isPersist":1,"routeDesc":"工作流服务器"},{"createTime":"","updateTime":"","routeId":"1152136796736503810","routeName":"loongeasy-cloud-generator-server","path":"/code/**","serviceId":"loongeasy-cloud-generator-server","url":"","stripPrefix":0,"retryable":0,"status":1,"isPersist":0,"routeDesc":"在线代码生成服务器"},{"createTime":"2020-04-08 18:02:24","updateTime":"2020-05-29 14:54:49","routeId":"1247827122077102081","routeName":"wcb-myaccount","path":"/wcb/myaccount/**","serviceId":"wcb-myaccount","url":"","stripPrefix":0,"retryable":0,"status":1,"isPersist":0,"routeDesc":"微信银行账户查询服务"},{"createTime":"2020-04-15 14:48:42","updateTime":"2020-05-29 14:54:59","routeId":"1250315091862192130","routeName":"wcb-auth","path":"/wcb/auth/**","serviceId":"wcb-auth","url":"","stripPrefix":0,"retryable":0,"status":1,"isPersist":0,"routeDesc":"微信OAuth2授权服务"},{"createTime":"2020-04-17 13:56:48","updateTime":"2020-04-17 13:58:40","routeId":"1251026805700206594","routeName":"wcb-binding","path":"/wcb/binding/**","serviceId":"wcb-binding","url":"","stripPrefix":0,"retryable":0,"status":1,"isPersist":0,"routeDesc":"微信银行绑卡服务"}],"total":"19","size":"10","current":"1","page":1,"limit":10,"sort":"","order":"","requestMap":{"NONCE":"inp44e8d4g","SIGN":"EC983802C33C8CD7EB755ED905DC268CBFA093164737F1AD0C48284FD8D2DBEE","SIGN_TYPE":"SHA256","TIMESTAMP":"20200721155301"},"orderBy":"","searchCount":true,"pages":"2"},"extra":{},"timestamp":"1595318050342"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/base/gateway/route/update',
    type: 'post',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{},"extra":{},"timestamp":"1595318179494"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/base/gateway/route/remove',
    type: 'post',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{},"extra":{},"timestamp":"1595318179494"}', 'isEncrypt': '0' }
    }
  }

]

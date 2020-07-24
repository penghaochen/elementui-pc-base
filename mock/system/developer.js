export default [
  {
    url: '/base/developer',
    type: 'get',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{"records":[{"createTime":"2020-07-08 09:31:42","updateTime":"2020-07-08 09:59:19","userId":"1280675894922317826","userName":"test002","userType":"isp","companyId":0,"nickName":"test002","avatar":"","email":"test002@qq.com","mobile":"16111111112","userDesc":"","password":"","status":2},{"createTime":"2020-07-08 09:28:29","updateTime":"2020-07-08 09:28:44","userId":"1280675087107756033","userName":"test","userType":"normal","companyId":0,"nickName":"test","avatar":"","email":"test123123123@qq.com","mobile":"15111111111","userDesc":"","password":"","status":1}],"total":"2","size":"10","current":"1","page":1,"limit":10,"sort":"","order":"","requestMap":{"NONCE":"pqjc7j6yiiq","SIGN":"C8C36BD586E7624FB93178F43BEC0C8C3B6594921D857A1AC5D486A407BCE341","SIGN_TYPE":"SHA256","TIMESTAMP":"20200721134327","email":"","mobile":"","total":"0","userName":""},"orderBy":"","searchCount":true,"pages":"1"},"extra":{},"timestamp":"1595310276131"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/base/developer/add',
    type: 'post',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{},"extra":{},"timestamp":"1595310446772"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/base/developer/update',
    type: 'post',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{},"extra":{},"timestamp":"1595310502256"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/base/developer/update/password',
    type: 'post',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{},"extra":{},"timestamp":"1595310548014"}', 'isEncrypt': '0' }
    }
  }
]

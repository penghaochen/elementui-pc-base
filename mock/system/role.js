export default [
  {
    url: '/base/role',
    type: 'get',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{"records":[{"createTime":"2018-07-29 21:14:54","updateTime":"2019-05-25 03:06:57","roleId":"1","roleCode":"admin","roleName":"系统管理员","roleDesc":"系统管理员","status":1,"isPersist":1},{"createTime":"2018-07-29 21:14:54","updateTime":"2019-05-25 15:14:56","roleId":"2","roleCode":"operator","roleName":"运营人员","roleDesc":"运营人员","status":1,"isPersist":1},{"createTime":"2018-07-29 21:14:54","updateTime":"2020-07-08 11:07:37","roleId":"3","roleCode":"support","roleName":"客服","roleDesc":"客服","status":1,"isPersist":1}],"total":"3","size":"10","current":"1","page":1,"limit":10,"sort":"","order":"","requestMap":{"NONCE":"0yn9oivqes6","SIGN":"73BB435F0A4AE40CEAFE15E58DC0B9A812FB557BC955270221A1137865AC3817","SIGN_TYPE":"SHA256","TIMESTAMP":"20200721150948","roleCode":"","roleName":""},"orderBy":"","searchCount":true,"pages":"1"},"extra":{},"timestamp":"1595315456952"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/base/role/add',
    type: 'post',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":"1285472563761254401","extra":{},"timestamp":"1595315516787"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/base/role/users',
    type: 'post',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":[],"extra":{},"timestamp":"1595315576819"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/base/user/all',
    type: 'get',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":[{"createTime":"2018-12-10 13:20:45","updateTime":"2020-07-08 10:04:38","userId":"521677655146233856","userName":"admin","userType":"super","companyId":0,"nickName":"超级管理员","avatar":"","email":"515608851@qq.com","mobile":"16111111111","userDesc":"","password":"","status":2},{"createTime":"2019-03-18 04:50:25","updateTime":"2020-07-08 10:05:10","userId":"557063237640650752","userName":"test","userType":"normal","companyId":0,"nickName":"测试用户","avatar":"","email":"222@qq.com","mobile":"15111111111","userDesc":"","password":"","status":1},{"createTime":"2020-07-08 10:32:26","updateTime":"2020-07-08 10:32:26","userId":"1280691178013986818","userName":"test009","userType":"super","companyId":0,"nickName":"test009","avatar":"","email":"","mobile":"","userDesc":"","password":"","status":1},{"createTime":"2020-07-21 11:14:29","updateTime":"2020-07-21 11:15:02","userId":"1285412805964468225","userName":"123456","userType":"normal","companyId":0,"nickName":"123","avatar":"","email":"5343@qq.com","mobile":"15910433331","userDesc":"123","password":"","status":1}],"extra":{},"timestamp":"1595315576512"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/base/role/users/add',
    type: 'post',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{},"extra":{},"timestamp":"1595315760972"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/base/role/update',
    type: 'post',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{},"extra":{},"timestamp":"1595315658802"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/base/authority/role/grant',
    type: 'post',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{},"extra":{},"timestamp":"1595315712357"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/base/role/remove',
    type: 'post',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{},"extra":{},"timestamp":"1595315815699"}', 'isEncrypt': '0' }
    }
  }
]


export default [
  {
    url: '/trans/rspMsg/getRspMsgPage',
    type: 'get',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{"records":[{"createTime":"2020-06-19 09:26:40","updateTime":"2020-06-19 09:26:40","id":"40","rspCode":"100003","rspMsg":"操作失败!","remark":""},{"createTime":"2020-06-17 16:30:11","updateTime":"2020-06-17 16:30:11","id":"39","rspCode":"100002","rspMsg":"未选择到合适的支付通道","remark":""},{"createTime":"2020-04-30 14:31:25","updateTime":"2020-06-23 14:45:14","id":"37","rspCode":"100001","rspMsg":"您还未绑定华夏微银行，绑定即可体验更多服务哦","remark":""},{"createTime":"2020-04-30 14:29:33","updateTime":"2020-04-30 14:29:33","id":"36","rspCode":"000006","rspMsg":"再次获取需要间隔60秒，请稍后再试","remark":""},{"createTime":"2020-04-30 14:27:22","updateTime":"2020-04-30 14:27:22","id":"35","rspCode":"000019","rspMsg":"变更户名后需将原卡解绑或次日办理绑卡业务!","remark":""},{"createTime":"2020-04-30 14:26:50","updateTime":"2020-06-23 13:28:08","id":"34","rspCode":"000016","rspMsg":"您输入的卡号非华夏银行I类户，请重新输入!","remark":""},{"createTime":"2020-04-30 14:26:30","updateTime":"2020-04-30 14:26:30","id":"33","rspCode":"000015","rspMsg":"卡状态异常!","remark":""},{"createTime":"2020-04-30 14:25:43","updateTime":"2020-04-30 14:25:43","id":"32","rspCode":"000014","rspMsg":"预留手机号不正确!","remark":""},{"createTime":"2020-04-30 14:25:26","updateTime":"2020-04-30 14:25:26","id":"31","rspCode":"000013","rspMsg":"卡号不存在!","remark":""},{"createTime":"2020-04-30 14:23:47","updateTime":"2020-04-30 14:23:47","id":"30","rspCode":"000012","rspMsg":"此卡已被绑定!","remark":""}],"total":"21","size":"10","current":"1","searchCount":true,"pages":"3"},"extra":{},"timestamp":"1595319147089"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/trans/rspMsg/saveRspMsg',
    type: 'post',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{},"extra":{},"timestamp":"1595319234868"}', 'isEncrypt': '0' }
    }
  }

]


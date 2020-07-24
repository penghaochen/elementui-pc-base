export default [
  {
    url: '/base/gateway/limit/rate',
    type: 'get',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{"records":[{"createTime":"2019-07-11 18:12:49","updateTime":"2020-05-07 19:02:27","policyId":"1149260244919205889","policyName":"微信银行限流策略","policyType":"url","limitQuota":"10","intervalUnit":"seconds"}],"total":"1","size":"10","current":"1","page":1,"limit":10,"sort":"","order":"","requestMap":{"NONCE":"olmqhlnrir","SIGN":"14ACFFD1D0A0761B357EBCD622247BE0DAAF4DE7C41646F2C076AC2946D3541F","SIGN_TYPE":"SHA256","TIMESTAMP":"20200721153837"},"orderBy":"","searchCount":true,"pages":"1"},"extra":{},"timestamp":"1595317185677"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/base/gateway/limit/rate/add',
    type: 'post',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":"1285480179270946818","extra":{},"timestamp":"1595317332465"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/base/gateway/limit/rate/api/list',
    type: 'get',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":[],"extra":{},"timestamp":"1595317393947"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/base/gateway/limit/rate/api/add',
    type: 'post',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{},"extra":{},"timestamp":"1595317456745"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/base/gateway/limit/rate/update',
    type: 'post',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{},"extra":{},"timestamp":"1595317496187"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/base/gateway/limit/rate/remove',
    type: 'post',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{},"extra":{},"timestamp":"1595317549927"}', 'isEncrypt': '0' }
    }
  }

]

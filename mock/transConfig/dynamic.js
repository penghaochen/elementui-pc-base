export default [
  {
    url: '/trans/dynamicconfiguration/page',
    type: 'get',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{"records":[{"id":29,"namespace":"","dataId":"trans-rsp-msg.properties","nacosGroup":"DEFAULT_GROUP","databaseTable":"trans_rsp_msg","nacosKey":"rsp_code","fields":"rsp_msg","status":"0","remark":"","createTime":"2020-06-22 21:34:41","updateTime":"2020-06-22 21:49:42"},{"id":30,"namespace":"","dataId":"trans-dictionary.properties","nacosGroup":"DEFAULT_GROUP","databaseTable":"trans_dictionary","nacosKey":"name","fields":"id,description,type,validation_flag,validation_rule,validation_prompt,sensitive_flag,encryption_flag,cache_flag,app_type","status":"0","remark":"","createTime":"2020-06-22 21:37:02","updateTime":"2020-06-22 21:50:00"}],"total":"2","size":"10","current":"1","searchCount":true,"pages":"1"},"extra":{},"timestamp":"1595319303790"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/trans/dynamicconfiguration/queryTableColumns',
    type: 'get',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":[{"columnComment":"主键","columnKey":"PRI","columnName":"id","dataType":"int","extra":"auto_increment"},{"columnComment":"响应码","columnKey":"UNI","columnName":"rsp_code","dataType":"varchar","extra":""},{"columnComment":"响应信息","columnKey":"","columnName":"rsp_msg","dataType":"varchar","extra":""},{"columnComment":"规则备注","columnKey":"","columnName":"remark","dataType":"varchar","extra":""},{"columnComment":"创建时间","columnKey":"","columnName":"create_time","dataType":"datetime","extra":""},{"columnComment":"更新时间","columnKey":"","columnName":"update_time","dataType":"datetime","extra":""}],"extra":{},"timestamp":"1595319564643"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/trans/dynamicconfiguration/updateConfig',
    type: 'post',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{},"extra":{},"timestamp":"1595319644150"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/trans/dynamicconfiguration/queryTableList',
    type: 'get',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":[{"createTime":"2020-06-16 05:38:35","engine":"InnoDB","tableComment":"","tableName":"trans_dictionary"},{"createTime":"2020-06-16 05:38:35","engine":"InnoDB","tableComment":"","tableName":"trans_rsp_msg"}],"extra":{},"timestamp":"1595319695610"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/trans/dynamicconfiguration/publishConfig',
    type: 'post',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{},"extra":{},"timestamp":"1595319757878"}', 'isEncrypt': '0' }
    }
  },
  {
    url: '/trans/dynamicconfiguration/deleteConfig',
    type: 'get',
    response: config => {
      return { 'response': '{"returnCode":"000000","message":"success","path":"","data":{},"extra":{},"timestamp":"1595319806292"}', 'isEncrypt': '0' }
    }
  }

]


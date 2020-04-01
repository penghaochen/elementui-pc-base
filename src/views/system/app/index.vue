<template>
  <div class="app-container calendar-list-container">

    <!-- 搜索模块 -->
    <el-form :inline="true" :model="searchModel" size="small" class="demo-form-inline form-btn-box">
      <el-form-item label="AppId">
        <el-input v-model="searchModel.developerName" placeholder="请输入关键字"></el-input>
      </el-form-item>
      <el-form-item label="中文名称">
        <el-input v-model="searchModel.applicationName" placeholder="请输入关键字"></el-input>
      </el-form-item>
      <el-form-item label="英文名称">
        <el-input v-model="searchModel.applicationName" placeholder="请输入关键字"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="applicationQry()">查询</el-button>
        <el-button type="default">重置</el-button>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="handleShowDetail()">添加</el-button>
    <el-alert title='客户端模式,请授权相关接口资源。否则请求网关服务器将提示"权限不足,拒绝访问!"' type="info" show-icon>
    </el-alert>
    <!--应用详情-->
    <el-table :data="appresList" border :cell-style="cellstyle" :header-cell-style="rowClass" size="small">
      <el-table-column type="selection" width="60">
      </el-table-column>
      <el-table-column prop="appName" label="应用名称" width="200">
      </el-table-column>
      <el-table-column prop="appId" label="APPID" width="200">
      </el-table-column>
      <el-table-column prop="apiKey" label="ApiKey" width="250">
      </el-table-column>
      <el-table-column prop="secretKey" label="SecretKey" width="300">
      </el-table-column>
      <el-table-column prop="userName" label="开发者" width="200">
      </el-table-column>
      <el-table-column label="应用类型" width="180"
        :filters="[{ text: '服务器应用', value: 'server' }, { text: '移动端应用', value: 'app' }, { text: '电脑端应用', value: 'pc' }]"
        :filter-method="filterTag">
        <template slot-scope="scope">
          <el-tag disable-transitions>{{scope.row.appType}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          {{scope.row.status==1?'已上线':'未上线'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="140">
        <template slot-scope="scope">
          <el-button type="text" @click="handleShowDetail(scope.row)">编辑</el-button>
          <el-dropdown :hide-on-click="false">
            <span class="el-dropdown-link">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>重置秘钥</el-dropdown-item>
              <el-dropdown-item>删除应用</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-col :span="24" class="toolbar">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="listQuery.pageNum" :page-sizes="[10, 20, 50, 100]" :page-size="listQuery.pageRow"
        layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </el-col>

    <!--上线弹框-->
    <el-dialog title="提示信息" :visible.sync="isAppOnline" width="30%">
      <span>您正在上线应用，还请确认操作</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isAppOnline = false">取 消</el-button>
        <el-button type="primary" @click="isAppOnline = false">确 定</el-button>
      </span>
    </el-dialog>
    <!--下线弹框-->
    <el-dialog title="提示信息" :visible.sync="isAppOffline" width="30%">
      <span>您正在下线线应用，还请确认操作</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isAppOffline = false">取 消</el-button>
        <el-button type="primary" @click="isAppOffline = false">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑弹框-->
    <el-dialog title="编辑应用 - 平台用户认证服务器" :visible.sync="isShowDetail" width="50%">
      <el-tabs v-model="activeName" @tab-click="handleClick">
          <!--  应用信息菜单-->
        <el-tab-pane label="应用信息" name="first">
            <el-form ref="form1" :model="formItem" label-width="80px" size="mini">
                <el-form-item label="应用图标">
                    <div class="carmera-box">
                    <i class="el-icon-camera-solid"/>
                    </div>
                </el-form-item>
                <el-form-item label="AppId">
                    <el-input v-model="formItem.appId" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="开发者">
                    <el-select v-model="formItem.developerId" placeholder="请选择" style="width:100%">
                        <el-option v-for="item in selectUsers" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="应用名称">
                    <el-input v-model="formItem.appName"></el-input>
                </el-form-item>
                <el-form-item label="英文名称">
                    <el-input v-model="formItem.appNameEn"></el-input>
                </el-form-item>
                <el-form-item label="应用类型">
                    <el-select v-model="formItem.appType" placeholder="请选择" style="width:100%">
                        <el-option label="服务器应用" value="server"></el-option>
                        <el-option label="手机应用" value="app"></el-option>
                        <el-option label="PC网页应用" value="pc"></el-option>
                        <el-option label="手机网页应用" value="wap"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="应用官网">
                    <el-input v-model="formItem.website"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="formItem.status" size="small">
                        <el-radio-button label="0">下线</el-radio-button>
                        <el-radio-button label="1">上线</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" v-model="formItem.appDesc"></el-input>
                </el-form-item>
            </el-form>    
        </el-tab-pane>
        <!--  开发信息菜单-->
        <el-tab-pane label="开发信息" name="second">
            <el-form ref="form2" :model="formItem" label-width="135px" size="mini">
                <el-form-item label="ApiKey">
                    <el-input v-model="formItem.apiKey" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="SecretKey">
                    <el-input v-model="formItem.secretKey" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="授权类型">
                <el-checkbox-group v-model="formItem.grantTypes">
                    <el-checkbox :label="item.title" :value="item.label" v-for="(item,index) in selectGrantTypes" :key="index"></el-checkbox>
                </el-checkbox-group>
                </el-form-item>
                <el-form-item label="用户授权范围">
                    <span slot="label">用户授权范围
                    <el-tooltip class="item" effect="dark" content="提醒用户确认授权可访问的资源" placement="">
                    <i class="el-icon-warning"/>
                    </el-tooltip>
                    </span>
                <el-checkbox-group v-model="formItem.scopes">
                    <el-checkbox :label="item.title" :value="item.label" v-for="(item,index) in selectScopes" :key="index"></el-checkbox>
                </el-checkbox-group>
                </el-form-item>
                <el-form-item label="自动授权范围">
                    <span slot="label">自动授权范围
                    <el-tooltip class="item" effect="dark" content="不再提醒用户确认授权可访问的资源" placement="">
                    <i class="el-icon-warning"/>
                    </el-tooltip>
                    </span>
                <el-checkbox-group v-model="formItem.autoApproveScopes">
                    <el-checkbox :label="item.title" :value="item.label" v-for="(item,index) in selectScopes" :key="index"></el-checkbox>
                </el-checkbox-group>
                </el-form-item>
                <el-form-item label="令牌有效期">
                    <el-radio-group v-model="formItem.tokenValidity" size="small">
                        <el-radio-button label="0">设置有效期</el-radio-button>
                        <el-radio-button label="1">不限制</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="访问令牌有效期">
                    <el-input type="number" v-model="formItem.accessTokenValidity" style="width:100px"></el-input>
                    <span>&nbsp;&nbsp;秒</span>
                </el-form-item>
                <el-form-item label="刷新令牌有效期">
                    <el-input  type="number" v-model="formItem.refreshTokenValidity" style="width:100px"></el-input>
                    <span>&nbsp;&nbsp;秒</span>
                </el-form-item>
                <el-form-item label="第三方登陆回调地址">
                    <el-input type="textarea" v-model="formItem.redirectUrls"></el-input>
                    <span>多个地址使用,逗号隔开</span>
                </el-form-item>
            </el-form> 
        </el-tab-pane>
        <!--  分配权限菜单-->
        <el-tab-pane label="分配权限" name="third">
  <el-transfer :titles="['选择接口', '已选择接口']" filterable filter-placeholder="请输入搜索内容" v-model="transferValue" :data="selectApis"></el-transfer>
        </el-tab-pane>
        
      </el-tabs>
      
      <span slot="footer" class="dialog-footer">
          <el-button type="default" @click="isShowDetail = false">取消</el-button>
        <el-button type="primary" @click="isShowDetail = false">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
 
<script>
 import {
    getAppList,
  } from '@/api/system'
  export default {
    name: "applicationSettings",
    data() {
      return {
        isAppOnline: false, //是否上线提醒
        isAppOffline: false, //是否下线提醒
        isShowDetail: false, //是否显示细节
        //分页条
        listQuery: {
          pageNum: 1, //页码
          pageRow: 10, //每页条数
        },
        //分页组件--数据总条数
        totalCount: 100,
        //搜索框字段
        searchModel: {
          developerName: '',
          applicationName: '',
          applicationStatus: ''
        },
        //模拟数据报文
        appresList: [],
        //应用详情表格数据
        applicationList: [],
        activeName: 'first',
        formItem: {
          appId: '',
          apiKey: '',
          secretKey: '',
          appName: '',
          appNameEn: '',
          appType: 'server',
          appIcon: '',
          appOs: '',
          path: '',
          website: '',
          appDesc: '',
          status: 1,
          redirectUrls: '',
          developerId: '',
          scopes: ['userProfile'],
          autoApproveScopes: [],
          authorities: [],
          grantTypes: [],
          accessTokenValidity: 43200,
          refreshTokenValidity: 2592000,
          expireTime: '',
          isExpired: false,
          tokenValidity: '1'
        },
        selectUsers: [],
        selectGrantTypes: [
          {label: 'authorization_code', title: '授权码模式', desc: 'Web服务端应用与第三方移动App应用'},
          {label: 'client_credentials', title: '客户端模式', desc: '没有用户参与的,内部服务端与第三方服务端'},
          {label: 'password', title: '密码模式', desc: '内部Web网页应用与内部移动App应用'},
          {label: 'implicit', title: '简化模式', desc: 'Web网页应用或第三方移动App应用'},
          {label: 'refresh_token', title: '刷新令牌', desc: '刷新并延迟访问令牌时长'},
        ],
        selectScopes: [
          {label: 'userProfile', title: '允许访问基本信息'},
          // 这是测试数据,自定义对应接口权限标识
          {label: 'api1', title: '允许访问....自定义信息'},
        ],
        selectApis: [],
        transferValue:[1,4]
      }
    },
    //初始化表格数据
    created() {
      this.init();
    },
    computed: {},
    filters: {},
    methods: {
      /**
       * @description 初始化表格数据
       */
      init() {
        //查询应用列表
        getAppList(this.searchModel).then(res => {
             this.appresList = res.data
        }).finally(() => {
        })
        
      },
      filterTag(value, row) {
        return row.appType === value;
      },
      handleTransferChange (newTargetKeys, direction, moveKeys) {
        if (newTargetKeys.indexOf('1') != -1) {
          this.formItem.authorities = ['1']
        } else {
          this.formItem.authorities = newTargetKeys
        }
      },
      handleClick(tab, event) {
        console.log(tab, event);
      },
      
      /**
       * @description 搜索开发者名称或应用名称
       */
      applicationQry() {
        this.init();
        alert("查询功能")
      },
      /**
       * @description 点击应用查看详情
       * * @param item 查看详情对象
       */
      handleShowDetail(item) {
        this.isShowDetail = true;
        if (item) {
          this.formItem = Object.assign({}, this.formItem, item)
          this.formItem.appId = item.appId
        }
        let values=[
            {"code":0,"message":"success","path":"","data":[{"createTime":"2019-07-30 11:07:04","updateTime":"2019-08-22 14:36:44","apiId":"1156038470987317250","apiCode":"b8c71f653aa802bbedf16c4ec9b20e3e","apiName":"获取当前登录用户信息-SSO单点登录","serviceId":"open-cloud-uaa-admin-server","apiCategory":"default","path":"/current/user/sso","priority":0,"apiDesc":"获取当前登录用户信息-SSO单点登录","status":1,"isPersist":1,"isAuth":1,"isOpen":0,"requestMethod":"GET","contentType":"","className":"com.opencloud.uaa.admin.server.controller.LoginController","methodName":"principal","authorityId":"1156038471020871682","authority":"API_b8c71f653aa802bbedf16c4ec9b20e3e","prefix":"/admin/**"},{"createTime":"2019-07-30 11:04:01","updateTime":"2019-08-19 18:59:18","apiId":"1156037705061269506","apiCode":"9275410ca1d4198af7a7e66b2661f422","apiName":"批量删除数据","serviceId":"open-cloud-base-server","apiCategory":"default","path":"/api/batch/remove","priority":0,"apiDesc":"批量删除数据","status":1,"isPersist":1,"isAuth":1,"isOpen":1,"requestMethod":"POST","contentType":"","className":"com.opencloud.base.server.controller.BaseApiController","methodName":"batchRemove","authorityId":"1156037705195487233","authority":"API_9275410ca1d4198af7a7e66b2661f422","prefix":"/base/**"},{"createTime":"2019-07-30 11:04:01","updateTime":"2019-08-21 11:44:34","apiId":"1156037705921101825","apiCode":"de9889498a75766df0dd9644b21b07bf","apiName":"批量修改公开状态","serviceId":"open-cloud-base-server","apiCategory":"default","path":"/api/batch/update/open","priority":0,"apiDesc":"批量修改公开状态","status":1,"isPersist":1,"isAuth":1,"isOpen":1,"requestMethod":"POST","contentType":"","className":"com.opencloud.base.server.controller.BaseApiController","methodName":"batchUpdateOpen","authorityId":"1156037705963044866","authority":"API_de9889498a75766df0dd9644b21b07bf","prefix":"/base/**"},{"createTime":"2019-07-30 11:04:01","updateTime":"2019-08-21 11:44:26","apiId":"1156037706126622721","apiCode":"f7244837c4701df4f47e540682405e5e","apiName":"批量修改身份认证","serviceId":"open-cloud-base-server","apiCategory":"default","path":"/api/batch/update/auth","priority":0,"apiDesc":"批量修改身份认证","status":1,"isPersist":1,"isAuth":1,"isOpen":1,"requestMethod":"POST","contentType":"","className":"com.opencloud.base.server.controller.BaseApiController","methodName":"batchUpdateAuth","authorityId":"1156037706155982850","authority":"API_f7244837c4701df4f47e540682405e5e","prefix":"/base/**"},{"createTime":"2019-07-30 11:04:01","updateTime":"2019-08-19 18:59:18","apiId":"1156037706206314497","apiCode":"1c335308b42f13c97e2f41ae42418f56","apiName":"批量修改状态","serviceId":"open-cloud-base-server","apiCategory":"default","path":"/api/batch/update/status","priority":0,"apiDesc":"批量修改状态","status":1,"isPersist":1,"isAuth":1,"isOpen":1,"requestMethod":"POST","contentType":"","className":"com.opencloud.base.server.controller.BaseApiController","methodName":"batchUpdateStatus","authorityId":"1156037706244063234","authority":"API_1c335308b42f13c97e2f41ae42418f56","prefix":"/base/**"},{"createTime":"2019-07-23 13:56:54","updateTime":"2019-08-19 18:55:50","apiId":"1153544494694670337","apiCode":"4d27a9ae885d7dbfc82e7ae2c86ec9d6","apiName":"login","serviceId":"open-cloud-uaa-admin-server","apiCategory":"default","path":"/login","priority":0,"apiDesc":"","status":1,"isPersist":1,"isAuth":0,"isOpen":0,"requestMethod":"GET","contentType":"","className":"com.opencloud.uaa.admin.server.controller.IndexController","methodName":"login","authorityId":"1153544494724030465","authority":"API_4d27a9ae885d7dbfc82e7ae2c86ec9d6","prefix":"/admin/**"}]},
            {"code":0,"message":"success","path":"","data":[],"extra":{},"timestamp":"1583919096198"}
          ]
        let res1 = values[0]
        let res2 = values[1]
          if (res1.code === 0) {
            res1.data.map(item => {
              item.key = item.authorityId
              item.label = `${item.prefix.replace('/**', '')}${item.path} - ${item.apiName}`
              item.disabled = item.path === '/**'
            })
            this.selectApis = res1.data
            console.log(this.selectApis)
          }
      },
      /**
       * @description 获取应用详情界面的其他字段 将item.applicationName 提交至后台  后台返回详情其他字段
       * * @param item 查看详情的对象
       */
      getAppDetail(item) {

      },
      /**
       * @description 分页条size设置
       */
      handleSizeChange(val) {
        this.listQuery.pageRow = val;
        this.init();
      },
      /**
       * @description 分页条num设置
       */
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.init();
      },
      /**
       * @description 设置el-table内容居中
       */
      cellstyle() {
        return "padding-left: 10px;padding-right: 10px;";
      },
      /**
       * @description 设置el-table表头居中
       */
      rowClass() {
        return "background:#f8f8f9;color:#515a6e;padding-left: 10px;padding-right: 10px;";
      },
      /**
       * @description 处理上线弹窗函数
       */
      handleAppOnline(item) {
        console.log(JSON.stringify(item))
        this.isAppOnline = true;
      },
      /**
       * @description 处理下线弹窗函数
       */
      handleAppOffline(item) {
        console.log(JSON.stringify(item))
        this.isAppOffline = true;
      }
    }
  }

</script>

<style scoped>
  .form-btn-box {
    width: 90%;
  }

  .toolbar {
    /* background: #f2f2f2; */
    height: 50px;
    padding-top: 5px;
  }
  
  .carmera-box{
      width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px #ccc dashed;
  }
</style>

<template>
  <div class="app-container calendar-list-container">

    <!-- 搜索模块 -->
    <el-form ref="searchForm" :inline="true" :model="pageInfo" label-width="80px" size="small" class="demo-form-inline form-btn-box">
      <el-form-item label="AppId" prop="appId">
        <el-input v-model="pageInfo.appId" placeholder="请输入关键字" />
      </el-form-item>
      <el-form-item label="中文名称" prop="appName">
        <el-input v-model="pageInfo.appName" placeholder="请输入关键字" />
      </el-form-item>
      <el-form-item label="英文名称" prop="appNameEn">
        <el-input v-model="pageInfo.appNameEn" placeholder="请输入关键字" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch(1)">查询</el-button>
        <el-button type="default" @click="handleResetForm('searchForm')">重置</el-button>
        <el-button
          :disabled="hasAuthority('systemAppEdit')?false:true"
          class="search-btn"
          type="primary"
          @click="handleModal()"
        >
          <span>添加</span>
        </el-button>
      </el-form-item>
    </el-form>
    <el-alert type="info" show-icon>客户端模式,请授权相关接口资源。否则请求网关服务器将提示<code>"权限不足,拒绝访问!"</code></el-alert>
    <!--应用详情-->
    <el-table :data="data" border>
      <el-table-column type="selection" width="60" />
      <el-table-column prop="appName" label="应用名称" width="200" />
      <el-table-column prop="appNameEn" label="英文名称" width="200" />
      <el-table-column prop="appId" label="AppId" width="200" />
      <el-table-column prop="apiKey" label="ApiKey" width="250" />
      <el-table-column prop="secretKey" label="SecretKey" width="300" />
      <el-table-column prop="userName" label="开发者" width="200" />
      <el-table-column prop="appType" label="应用类型" width="180">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.appType==='server'">服务器应用</el-tag>
          <el-tag v-else-if="scope.row.appType==='app'">手机应用</el-tag>
          <el-tag v-else-if="scope.row.appType==='pc'">PC网页应用</el-tag>
          <el-tag v-else="">手机网页应用</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-badge is-dot v-if="scope.row.status===1" type="success" text="上线"/>
          <el-badge is-dot v-else="" type="danger" text="下线"/>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" fixed="right" width="140">
        <template slot-scope="scope">
          <a :disabled="scope.row.appId != 'gateway' && hasAuthority('systemAppEdit') ?false:true" @click="handleModal(scope.row)">
            编辑</a>&nbsp;
          <el-dropdown v-show="hasAuthority('systemAppEdit')" ref="dropdown" @command="handleClick">
            <a href="javascript:void(0)" :disabled="scope.row.appId === 'gateway' ?true:false">
              <span>更多</span>
              <i class="el-icon-arrow-down el-icon--right" />
            </a>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="composeValue('resetSecret',scope.row)">重置秘钥</el-dropdown-item>
              <el-dropdown-item :command="composeValue('remove',scope.row)">删除应用</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-col :span="24" class="toolbar">
      <el-pagination
        background
        :current-page="pageInfo.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageInfo.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageInfo.total"
        @size-change="handlePageSize"
        @current-change="handlePage"
      />
    </el-col>

    <!--上线弹框-->
    <!-- <el-dialog title="提示信息" :visible.sync="modalVisible" width="30%">
      <span>您正在上线应用，还请确认操作</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modalVisible = false">取 消</el-button>
        <el-button type="primary" @click="modalVisible = false">确 定</el-button>
      </span>
    </el-dialog> -->
    <!--下线弹框-->
    <!-- <el-dialog title="提示信息" :visible.sync="isAppOffline" width="30%">
      <span>您正在下线线应用，还请确认操作</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isAppOffline = false">取 消</el-button>
        <el-button type="primary" @click="isAppOffline = false">确 定</el-button>
      </span>
    </el-dialog> -->
    <!--编辑弹框-->
    <el-dialog :title="modalTitle" :visible.sync="modalVisible" width="60%" :before-close="handleReset">
      <el-tabs v-model="current" @tab-click="handleTabClick">
        <!--  应用信息菜单-->
        <el-tab-pane label="应用信息" name="form1">
          <el-form v-show="current=='form1'" ref="form1" :model="formItem" :rules="formItemRules" label-width="135px" size="mini">
            <!-- <el-form-item label="应用图标">
                  <div class="upload-list" v-for="(item,index) in uploadList" :key="index">
                    <template v-if="item.status === 'finished'">
                      <img :src="item.url">
                      <div class="upload-list-cover">
                        <i type="el-icon-view" @click.native="handleView(item.name)"></i>
                        <i type="el-icon-delete" @click.native="handleRemoveImg(item)"></i>
                      </div>
                    </template>
                    <template v-else>
                      <el-progress v-if="item.showProgress" :percentage="item.percentage" hide-info></el-progress>
                    </template>
                  </div>
                  <el-upload
                  ref="upload"
                  :show-file-list="false"
                  :file-list="defaultList"
                  list-type="picture"
                  :on-success="handleSuccess"
                  :before-upload="handleBeforeUpload"
                  :drag="true"
                  action="//jsonplaceholder.typicode.com/posts/"
                  style="display: inline-block;width:58px;">
                  <div style="width: 58px;height:58px;line-height: 58px;">
                    <i type="el-icon-camera" style="font-size:20px"></i>
                  </div>
                </el-upload>
                </el-form-item> -->
            <el-form-item label="AppId" prop="appId">
              <el-input v-model="formItem.appId" :disabled="true" placeholder="请输入内容" />
            </el-form-item>
            <el-form-item label="开发者" prop="developerId">
              <el-select v-model="formItem.developerId" placeholder="请选择" style="width:100%" clearable filterable>
                <el-option v-for="(item,index) in selectUsers" :key="index" :value="item.userId" :label="item.userName" :title="item.userName" @click.native="handleOnSelectUser(item)" />
              </el-select>
            </el-form-item>
            <el-form-item label="应用名称" prop="appName">
              <el-input v-model="formItem.appName" placeholder="请输入内容" />
            </el-form-item>
            <el-form-item label="英文名称" prop="appNameEn">
              <el-input v-model="formItem.appNameEn" placeholder="请输入内容" />
            </el-form-item>
            <el-form-item label="应用类型" prop="appType">
              <el-select v-model="formItem.appType" placeholder="请选择" style="width:100%" @change="handleOnAppTypeChange">
                <el-option label="服务器应用" value="server" />
                <el-option label="手机应用" value="app" />
                <el-option label="PC网页应用" value="pc" />
                <el-option label="手机网页应用" value="wap" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="formItem.appType === 'app'" prop="appOs" label="操作系统">
              <el-radio-group v-model="formItem.appOs">
                <el-radio label="ios">
                  <i type="el-icon-apple" />
                  <span>苹果IOS</span>
                </el-radio>
                <el-radio label="android">
                  <i type="el-icon-user" />
                  <span>安卓Android</span>
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="应用官网" prop="website">
              <el-input v-model="formItem.website" placeholder="请输入内容" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="formItem.status" size="small">
                <el-radio label="0">下线</el-radio>
                <el-radio label="1">上线</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="描述" prop="appDesc">
              <el-input v-model="formItem.appDesc" type="textarea" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!--  开发信息菜单-->
        <el-tab-pane :disabled="!formItem.appId" label="开发信息" name="form2">
          <el-form v-show="current=='form2'" ref="form2" :model="formItem" :rules="formItemRules" label-width="135px" size="mini">
            <el-form-item label="ApiKey" prop="apiKey">
              <el-input v-model="formItem.apiKey" :disabled="true" />
            </el-form-item>
            <el-form-item label="SecretKey" prop="secretKey">
              <el-input v-model="formItem.secretKey" :disabled="true" />
            </el-form-item>
            <el-form-item label="授权类型" prop="grantTypes">
              <el-checkbox-group v-model="formItem.grantTypes">
                <el-tooltip v-for="(item,index) in selectGrantTypes" :key="index" :content="item.desc">
                  <el-checkbox :label="item.label"><span>{{ item.title }}</span></el-checkbox>
                </el-tooltip>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="用户授权范围" prop="scopes">
              <span slot="label">用户授权范围
                <el-tooltip class="item" effect="dark" content="提醒用户确认授权可访问的资源" placement="">
                  <i class="el-icon-warning" />
                </el-tooltip>
              </span>
              <el-checkbox-group v-model="formItem.scopes">
                <el-checkbox v-for="(item,index) in selectScopes" :key="index" :label="item.label"><span>{{ item.title }}</span></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="自动授权范围" prop="autoApproveScopes">
              <span slot="label">自动授权范围
                <el-tooltip class="item" effect="dark" content="不再提醒用户确认授权可访问的资源" placement="">
                  <i class="el-icon-warning" />
                </el-tooltip>
              </span>
              <el-checkbox-group v-model="formItem.autoApproveScopes">
                <el-checkbox v-for="(item,index) in selectScopes" :key="index" :label="item.label"><span>{{ item.title }}</span></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="令牌有效期" prop="accessTokenValidity">
              <el-radio-group v-model="formItem.tokenValidity" size="small">
                <el-radio-button label="1">设置有效期</el-radio-button>
                <el-radio-button label="0">不限制</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-show="formItem.tokenValidity === '1'" label="访问令牌有效期" prop="accessTokenValidity">
              <el-input-number v-model="formItem.accessTokenValidity" :min="900" style="width:100px" />
              <span>&nbsp;&nbsp;秒</span>
            </el-form-item>
            <el-form-item v-show="formItem.tokenValidity === '1'" label="刷新令牌有效期" prop="refreshTokenValidity">
              <el-input-number v-model="formItem.refreshTokenValidity" :min="900" style="width:100px" />
              <span>&nbsp;&nbsp;秒</span>
            </el-form-item>
            <el-form-item label="第三方登陆回调地址" prop="redirectUrls">
              <el-input v-model="formItem.redirectUrls" type="textarea" />
              <span>多个地址使用,逗号隔开</span>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!--  分配权限菜单-->
        <el-tab-pane :disabled="!formItem.appId" label="分配权限" name="form3">
          <el-form v-show="current=='form3'" ref="form3" :model="formItem" label-width="100px" :rules="formItemRules">
            <el-form-item prop="expireTime" label="过期时间">
              <el-badge v-if="formItem.isExpired" text="授权已过期">
                <el-date-picker
                  v-model="formItem.expireTime"
                  class="ivu-form-item-error"
                  type="datetime"
                  placeholder="授权有效期"
                />
              </el-badge>
              <el-date-picker v-else="" v-model="formItem.expireTime" type="datetime" placeholder="设置有效期" />
            </el-form-item>
            <el-form-item prop="authorities" label="功能接口">
              <el-transfer
                v-model="formItem.authorities"
                :data="selectApis"
                :titles="['选择接口', '已选择接口']"
                :render-content="transferRender"
                filterable
                @change="handleTransferChange"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="handleReset">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSubmit">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getApps, updateApp, addApp, removeApp, getAppClientInfo, updateAppClientInfo, restApp } from '@/api/app'
import { getAllDevelopers } from '@/api/developer'
// import { startWith, listConvertGroup } from '@/utils/util'
import {
  getAuthorityApi,
  getAuthorityApp,
  grantAuthorityApp
} from '@/api/authority'

export default {
  name: 'SystemApp',
  data() {
    const validateEn = (rule, value, callback) => {
      const reg = /^[-_a-zA-Z0-9]+$/
      if (value === '') {
        callback(new Error('英文不能为空'))
      } else if (value !== '' && !reg.test(value)) {
        callback(new Error('只允许字母、数字、下划线、横线'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      saving: false,
      current: 'form1',
      forms: [
        'form1',
        'form2',
        'form3'
      ],
      selectApis: [],
      selectUsers: [],
      selectGrantTypes: [
        { label: 'authorization_code', title: '授权码模式', desc: 'Web服务端应用与第三方移动App应用' },
        { label: 'client_credentials', title: '客户端模式', desc: '没有用户参与的,内部服务端与第三方服务端' },
        { label: 'password', title: '密码模式', desc: '内部Web网页应用与内部移动App应用' },
        { label: 'implicit', title: '简化模式', desc: 'Web网页应用或第三方移动App应用' },
        { label: 'refresh_token', title: '刷新令牌', desc: '刷新并延迟访问令牌时长' }
      ],
      selectScopes: [
        { label: 'userProfile', title: '允许访问基本信息' },
        // 这是测试数据,自定义对应接口权限标识
        { label: 'api1', title: '允许访问....自定义信息' }
      ],
      pageInfo: {
        total: 0,
        page: 1,
        limit: 10,
        appId: '',
        appName: '',
        appNameEn: ''
      },
      defaultList: [
        {
          'name': '',
          'url': ''
        }
      ],
      modalVisible: false,
      modalTitle: '',
      imgName: '',
      visible: false,
      uploadList: [],
      formItemRules: {
        website: [
          { type: 'url', message: '请输入有效网址', trigger: 'blur' }
        ],
        appType: [
          { required: true, message: '应用类型不能为空', trigger: 'blur' }
        ],
        appOs: [
          { required: true, message: '操作系统不能为空', trigger: 'blur' }
        ],
        redirectUrls: [
          { required: true, message: '授权重定向地址不能为空', trigger: 'blur' }
        ],
        appName: [
          { required: true, message: '应用名称不能为空', trigger: 'blur' }
        ],
        appNameEn: [
          { required: true, validator: validateEn, trigger: 'blur' }
        ],
        grantTypes: [
          { required: true, type: 'array', min: 1, message: '授权类型不能为空', trigger: 'blur' }
        ],
        scopes: [
          { required: true, type: 'array', min: 1, message: '用户授权范围不能为空', trigger: 'blur' }
        ],
        accessTokenValidity: [
          { required: true, type: 'integer', min: 900, message: '访问令牌有效期不能少于900', trigger: 'blur' }
        ],
        refreshTokenValidity: [
          { required: true, type: 'integer', min: 900, message: '刷新令牌有效期不能少于900', trigger: 'blur' }
        ]
      },
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
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '应用名称',
          key: 'appName',
          width: 200
        },
        {
          title: 'AppId',
          key: 'appId',
          width: 200
        },
        {
          title: 'ApiKey',
          key: 'apiKey',
          width: 250
        },
        {
          title: 'SecretKey',
          key: 'secretKey',
          width: 300
        },
        {
          title: '开发者',
          key: 'userName',
          width: 200
        },
        {
          title: '应用类型',
          slot: 'appType',
          width: 180,
          filters: [
            {
              label: '服务器应用',
              value: 0
            },
            {
              label: '手机应用',
              value: 1
            },
            {
              label: 'PC网页应用',
              value: 2
            },
            {
              label: '手机网页应用',
              value: 3
            }
          ],
          filterMultiple: false,
          filterMethod(value, row) {
            if (value === 0) {
              return row.appType === 'server'
            } else if (value === 1) {
              return row.appType === 'app'
            } else if (value === 2) {
              return row.appType === 'pc'
            } else if (value === 3) {
              return row.appType === 'wap'
            }
          }
        },
        {
          title: '状态',
          slot: 'status',
          key: 'status'
        },
        {
          title: '操作',
          slot: 'action',
          fixed: 'right',
          width: 120
        }
      ],
      data: []
    }
  },
  mounted: function() {
    this.handleSearch()
  },
  methods: {
    handleModal(data) {
      if (data) {
        this.formItem = Object.assign({}, this.formItem, data)
        this.formItem.appId = data.appId
      }
      if (this.current === this.forms[0]) {
        this.modalTitle = data ? '编辑应用 - ' + data.appName : '添加应用'
        this.handleLoadUsers()
      }
      if (this.current === this.forms[1]) {
        this.modalTitle = data ? '开发信息 - ' + data.appName : '开发信息'
        this.handleLoadAppClientInfo(this.formItem.apiKey)
      }
      if (this.current === this.forms[2]) {
        this.modalTitle = data ? '分配权限 - ' + data.appName : '分配权限'
        this.handleLoadAppGranted(this.formItem.appId)
      }
      this.formItem.status = this.formItem.status + ''
    },
    handleResetForm(form) {
      this.$refs[form].resetFields()
    },
    handleReset() {
      // 重置验证
      const newData = {
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
      }
      this.formItem = newData
      this.forms.map(form => {
        this.handleResetForm(form)
      })
      this.current = this.forms[0]
      this.saving = false
      this.modalVisible = false
    },
    handleSubmit() {
      if (this.current === this.forms[0]) {
        this.$refs[this.current].validate((valid) => {
          if (valid) {
            this.saving = true
            const data = Object.assign({}, this.formItem)
            if (data.appId) {
              updateApp(data).then(res => {
                if (res.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '保存成功'
                  })
                }
                this.handleReset()
                this.handleSearch()
              }).finally(() => {
                this.saving = false
              })
            } else {
              addApp(data).then(res => {
                if (res.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '保存成功'
                  })
                }
                this.handleReset()
                this.handleSearch()
              }).finally(() => {
                this.saving = false
              })
            }
          }
        })
      }

      if (this.current === this.forms[1]) {
        this.$refs[this.current].validate((valid) => {
          if (valid) {
            this.saving = true
            if (this.formItem.tokenValidity === '0') {
              this.formItem.accessTokenValidity = -1
              this.formItem.refreshTokenValidity = -1
            }
            updateAppClientInfo(this.formItem).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '保存成功'
                })
              }
              this.handleReset()
              this.handleSearch()
            }).finally(() => {
              this.saving = false
            })
          }
        })
      }

      if (this.current === this.forms[2]) {
        this.$refs[this.current].validate((valid) => {
          if (valid) {
            this.saving = true
            grantAuthorityApp({
              appId: this.formItem.appId,
              expireTime: this.formItem.expireTime ? this.formItem.expireTime.pattern('yyyy-MM-dd HH:mm:ss') : '',
              authorityIds: this.formItem.authorities
            }).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '授权成功'
                })
                this.handleReset()
              }
              this.handleSearch()
            }).finally(() => {
              this.saving = false
            })
          }
        })
      }
    },
    handleSearch(page) {
      if (page) {
        this.pageInfo.page = page
      }
      this.loading = true
      getApps(this.pageInfo).then(res => {
        this.data = res.data.records
        this.pageInfo.total = parseInt(res.data.total)
      }).finally(() => {
        this.loading = false
      })
    },
    handleRemove(data) {
      this.$confirm('删除后将无法恢复,确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeApp({ appId: data.appId }).then(res => {
          this.handleSearch()
          if (res.code === 0) {
            this.pageInfo.page = 1
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    handleResetSecret(data) {
      this.$confirm('重置后将影响应用正常使用,确定重置吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        restApp({ appId: data.appId }).then(res => {
          if (res.code === 0) {
            this.pageInfo.page = 1
            this.formItem.secretKey = res.data
            this.$message({
              type: 'success',
              message: '重置成功,请妥善保管.并及时更新到相关应用'
            })
          }
          this.handleSearch()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    handleTabClick(name) {
      // this.current = name
      this.handleModal()
    },
    handleClick(command) {
      switch (command.button) {
        case 'remove':

          this.handleRemove(command.row)
          break
        case 'resetSecret':
          this.handleResetSecret(command.row)
          break
      }
    },
    composeValue(item, row) {
      return {
        'button': item,
        'row': row
      }
    },
    handleOnAppTypeChange(data) {
      if (data !== 'app') {
        this.formItem.appOs = ''
      } else {
        if (!this.formItem.appOs) {
          this.formItem.appOs = 'ios'
        }
      }
    },
    handleOnSelectUser(data) {
      this.formItem.developerId = data.userId
    },
    handlePage(current) {
      this.pageInfo.page = current
      this.handleSearch()
    },
    handlePageSize(size) {
      this.pageInfo.limit = size
      this.handleSearch()
    },
    filterTag(value, row) {
      return row.appType === value
    },
    handleLoadAppGranted(appId) {
      if (!appId) {
        return
      }
      const that = this
      const p1 = getAuthorityApi('')
      const p2 = getAuthorityApp(appId)
      Promise.all([p1, p2]).then(function(values) {
        const res1 = values[0]
        const res2 = values[1]
        if (res1.code === 0) {
          res1.data.map(item => {
            item.key = item.authorityId
            item.label = `${item.prefix.replace('/**', '')}${item.path} - ${item.apiName}`
            item.disabled = item.path === '/**'
          })
          that.selectApis = res1.data
        }
        if (res2.code === 0) {
          const authorities = []
          res2.data.map(item => {
            if (item.authority.indexOf('APP_') === -1 && !authorities.includes(item.authorityId)) {
              authorities.push(item.authorityId)
            }
          })
          that.formItem.authorities = authorities
          // 时间
          if (res2.data.length > 0) {
            that.formItem.expireTime = res2.data[0].expireTime
            that.formItem.isExpired = res2.data[0].isExpired
          }
        }
        that.modalVisible = true
      })
    },
    handleLoadAppClientInfo(clientId) {
      if (!clientId) {
        return
      }
      getAppClientInfo({ clientId: clientId }).then(res => {
        if (res.code === 0) {
          this.formItem.scopes = res.data.scope ? res.data.scope : []
          this.formItem.redirectUrls = res.data.redirect_uri ? res.data.redirect_uri.join(',') : ''
          this.formItem.grantTypes = res.data.authorized_grant_types ? res.data.authorized_grant_types : []
          this.formItem.accessTokenValidity = res.data.access_token_validity
          this.formItem.refreshTokenValidity = res.data.refresh_token_validity
          this.formItem.autoApproveScopes = res.data.autoapprove ? res.data.autoapprove : []
          this.formItem.tokenValidity = this.formItem.accessTokenValidity === -1 ? '0' : '1'
        }
        this.modalVisible = true
      })
    },
    transferRender(h, option) {
      const ss = option.label
      return <span title={ss}>{ option.label }</span>
    },
    handleTransferChange(newTargetKeys, direction, moveKeys) {
      if (newTargetKeys.indexOf('1') !== -1) {
        this.formItem.authorities = ['1']
      } else {
        this.formItem.authorities = newTargetKeys
      }
    },
    handleLoadUsers() {
      getAllDevelopers().then(res => {
        if (res.code === 0) {
          this.selectUsers = res.data
        }
        this.modalVisible = true
      })
    },
    handleView(name) {
      this.imgName = name
      this.visible = true
    },
    handleRemoveImg(file) {
      const fileList = this.$refs.upload.fileList
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
    },
    handleSuccess(res, file) {
      file.url = ''
      file.name = ''
    },
    handleFormatError(file) {
      this.$message({
        message: '图片支持png、jpg、jpeg',
        type: 'warning'
      })
    },
    handleMaxSize(file) {
      this.$message({
        message: '图片大小不能超过2M.',
        type: 'warning'
      })
    },
    handleBeforeUpload() {
      const check = this.uploadList.length < 1
      if (!check) {
        this.$message({
          message: '只能上传一张.',
          type: 'warning'
        })
      }
      return check
    }
  }
}
</script>
<style scoped>
  .upload-list {
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;
  }

  .upload-list img {
    width: 100%;
    height: 100%;
  }

  .upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
  }

  .upload-list:hover .upload-list-cover {
    display: block;
  }

  .upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>

<template>
  <div class="app-container calendar-list-container">

    <!-- 搜索模块 -->
    <el-form :inline="true" :model="pageInfo" size="small" class="demo-form-inline form-btn-box" ref="searchForm"
      label-width="80px" style="margin-bottom:30px">
      <el-form-item label="登录名" prop="userName">
        <el-input v-model="pageInfo.userName" placeholder="请输入关键字" clearable></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="pageInfo.mobile" placeholder="请输入关键字" clearable></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="pageInfo.email" placeholder="请输入关键字" clearable></el-input>
      </el-form-item>
      <el-form-item style="margin-left:40px">
        <el-button type="primary" @click="handleSearch(1)">查询</el-button>
        <el-button type="default" @click="handleResetForm('searchForm')">重置</el-button>
        <el-button :disabled="hasAuthority('developerEdit')?false:true" type="primary" @click="handleModal()">添加</el-button>
      </el-form-item>
    </el-form>
    <!--应用详情-->
    <el-table :data="data" :loading="loading" border :cell-style="cellstyle" :header-cell-style="rowClass" size="small">
      <el-table-column type="selection" width="60">
      </el-table-column>
      <el-table-column prop="userName" label="登录名" width="200">
      </el-table-column>
      <el-table-column prop="nickName" label="昵称" width="150">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="200">
      </el-table-column>
      <el-table-column prop="mobile" label="手机号" width="200">
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-badge is-dot v-if="scope.row.status===1" type="success"></el-badge>
          <el-badge is-dot v-else-if="scope.row.status===2" type="warning"></el-badge>
          <el-badge is-dot v-else="" type="danger"></el-badge>
          <span v-if="scope.row.status===1">正常</span>
          <span v-else-if="scope.row.status===2">锁定</span>
          <span v-else="">禁用</span>
        </template>
      </el-table-column>
      <el-table-column prop="userType" label="开发者类型" width="150">
      </el-table-column>
      <el-table-column prop="createTime" label="注册时间" width="180">
      </el-table-column>
      <!-- <el-table-column prop="userDesc" label="描述" width="220">
      </el-table-column> -->
      <el-table-column label="操作" fixed="right" width="140">
        <template slot-scope="scope">
          <a :disabled="hasAuthority('developerEdit')?false:true" @click="handleModal(scope.row)" class="linkfont">编辑</a>&nbsp;
          <el-dropdown v-show="hasAuthority('developerEdit')" ref="dropdown" @command="handleClick">
          <!-- <el-dropdown ref="dropdown" @on-click="handleClick($event,scope.row)"> -->
            <a href="javascript:void(0)">
              <span class="linkfont">更多</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </a>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="composeValue('sendToEmail',scope.row)">发送到密保邮箱</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-col :span="24" class="toolbar">
      <el-pagination background @size-change="handlePageSize" @current-change="handlePage" :current-page="pageInfo.page"
        :page-sizes="[10, 20, 50, 100]" :page-size="pageInfo.limit" layout="total, sizes, prev, pager, next, jumper"
        :total="pageInfo.total">
      </el-pagination>
    </el-col>
    <!--编辑弹框-->
    <el-dialog :title="modalTitle" :visible.sync="modalVisible" width="50%" :before-close="handleReset">
      <el-tabs v-model="current" @tab-click="handleTabClick">
        <!--  开发者信息菜单-->
        <el-tab-pane label="开发者信息" name="form1">
          <el-form v-show="current=='form1'" ref="form1" :model="formItem" :rules="formItemRules" label-width="120px">
            <el-form-item label="开发者类型" prop="userType">
              <template>
                <el-radio-group v-model="formItem.userType">
                  <el-radio label="isp">服务提供商</el-radio>
                  <el-radio label="normal">自研开发者</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
            <el-form-item label="昵称" prop="nickName">
              <el-input v-model="formItem.nickName" placeholder="请输入内容" clearable></el-input>
            </el-form-item>
            <el-form-item label="登录名" prop="userName">
              <el-input :disabled="formItem.userId?true:false" v-model="formItem.userName" placeholder="请输入内容"
                clearable></el-input>
            </el-form-item>
            <el-form-item v-if="formItem.userId?false:true" label="登录密码" prop="password">
              <el-input type="password" v-model="formItem.password" placeholder="请输入内容" clearable></el-input>
            </el-form-item>
            <el-form-item v-if="formItem.userId?false:true" label="再次确认密码" prop="passwordConfirm">
              <el-input type="password" v-model="formItem.passwordConfirm" placeholder="请输入内容" clearable></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="formItem.email" placeholder="请输入内容" clearable></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="formItem.mobile" placeholder="请输入内容" clearable></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="formItem.status" size="small">
                <el-radio-button label="0">禁用</el-radio-button>
                <el-radio-button label="1">正常</el-radio-button>
                <el-radio-button label="2">锁定</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="描述" prop="userDesc">
              <el-input v-model="formItem.userDesc" placeholder="请输入内容" clearable type="textarea"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!--  修改密码-->
        <el-tab-pane :disabled="!formItem.userId" label="修改密码" name="form2">
        <!-- <el-tab-pane label="修改密码" name="form2"> -->
          <el-form v-show="current == 'form2'" ref="form2" :model="formItem" :rules="formItemRules" label-width="120px">
            <el-form-item label="登录名" prop="userName">
              <el-input :disabled="formItem.userId?true:false" v-model="formItem.userName" placeholder="请输入内容" clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="登录密码" prop="password">
              <el-input type="password" v-model="formItem.password" placeholder="请输入内容" clearable></el-input>
            </el-form-item>
            <el-form-item label="再次确认密码" prop="passwordConfirm">
              <el-input type="password" v-model="formItem.passwordConfirm" placeholder="请输入内容" clearable></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="handleReset">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="saving">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getDevelopers,
    updateDeveloper,
    addDeveloper,
    updatePassword
  } from '@/api/developer'

  export default {
    name: 'SystemDeveloper',
    data() {

      const validateEn = (rule, value, callback) => {
        let reg = /^[_a-zA-Z0-9]+$/
        let reg2 = /^.{4,18}$/;
        // 长度为6到18个字符
        if (value === '') {
          callback(new Error('登录名不能为空'))
        } else if (value !== '' && !reg.test(value)) {
          callback(new Error('只允许字母、数字、下划线'))
        } else if (value !== '' && !reg2.test(value)) {
          callback(new Error('长度6到18个字符'))
        } else {
          callback()
        }
      }
      const validatePass = (rule, value, callback) => {
        let reg2 = /^.{6,18}$/;
        if (value === '') {
          callback(new Error('请输入密码'))
        } else if (value !== this.formItem.password) {
          callback(new Error('两次输入密码不一致'))
        } else if (value !== '' && !reg2.test(value)) {
          callback(new Error('长度6到18个字符'))
        } else {
          callback()
        }
      }

      const validatePassConfirm = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.formItem.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }
      const validateMobile = (rule, value, callback) => {
        let reg = /^1\d{10}$/
        if (value !== '' && !reg.test(value)) {
          callback(new Error('手机号码格式不正确'))
        } else {
          callback()
        }
      }
      return {
        loading: false,
        saving: false,
        modalVisible: false,
        modalTitle: '',
        current: 'form1',
        forms: [
          'form1',
          'form2'
        ],
        selectMenus: [],
        selectRoles: [],
        pageInfo: {
          page: 1,
          limit: 10,
          total: 0,
          userName:'',
          mobile:'',
          email:'',
        },
        formItemRules: {
          userType: [{
            required: true,
            message: '开发者类型不能为空',
            trigger: 'blur'
          }],
          userName: [{
              required: true,
              message: '开发者名不能为空',
              trigger: 'blur'
            },
            {
              required: true,
              validator: validateEn,
              trigger: 'blur'
            }
          ],
          password: [{
            required: true,
            validator: validatePass,
            trigger: 'blur'
          }],
          passwordConfirm: [{
            required: true,
            validator: validatePassConfirm,
            trigger: 'blur'
          }],
          nickName: [{
            required: true,
            message: '昵称不能为空',
            trigger: 'blur'
          }],
          email: [{
            required: false,
            type: 'email',
            message: '邮箱格式不正确',
            trigger: 'blur'
          }],
          mobile: [{
            validator: validateMobile,
            trigger: 'blur'
          }]
        },
        formItem: {
          userId: '',
          userName: '',
          nickName: '',
          password: '',
          passwordConfirm: '',
          status: 1,
          companyId: '',
          email: '',
          mobile: '',
          userType: 'isp',
          userDesc: '',
          avatar: '',
          grantRoles: [],
          grantActions: [],
          grantMenus: [],
          expireTime: '',
          isExpired: false
        },
        columns: [{
            type: 'selection',
            width: 60,
          },
          {
            title: '登录名',
            key: 'userName',
            width: 200
          },
          {
            title: '昵称',
            key: 'nickName',
            width: 150
          },
          {
            title: '邮箱',
            key: 'email',
            width: 200
          },
          {
            title: '手机号',
            key: 'mobile',
            width: 200
          },
          {
            title: '状态',
            slot: 'status',
            key: 'status',
            width: 100
          },
          {
            title: '开发者类型',
            key: 'userType',
            width: 150
          },
          {
            title: '注册时间',
            key: 'createTime',
            width: 180
          },
          {
            title: '描述',
            key: 'userDesc'
          },
          {
            title: '操作',
            slot: 'action',
            fixed: 'right',
            width: 150
          }
        ],
        data: [{},{}]
      }
    },
    methods: {
      handleModal(data) {
        if (data) {
          this.formItem = Object.assign({}, this.formItem, data)
        }
        if (this.current === this.forms[0]) {
          this.modalTitle = data ? '编辑开发者 - ' + data.userName : '添加开发者'
          this.modalVisible = true
        }
        if (this.current === this.forms[1]) {
          this.modalTitle = data ? '修改密码 - ' + data.userName : '修改密码'
          this.modalVisible = true
        }
        this.formItem.status = this.formItem.status + ''
      },
      handleResetForm(form) {
        this.$refs[form].resetFields()
      },
      handleReset() {
        const newData = {
          userId: '',
          userName: '',
          nickName: '',
          password: '',
          passwordConfirm: '',
          status: 1,
          companyId: '',
          email: '',
          mobile: '',
          userType: 'isp',
          userDesc: '',
          avatar: '',
          grantRoles: [],
          grantMenus: [],
          grantActions: [],
          expireTime: '',
          isExpired: false
        }
        this.formItem = newData
        //重置验证
        this.forms.map(form => {
          this.handleResetForm(form)
        })
        this.current = this.forms[0]
        this.formItem.grantMenus = []
        this.formItem.grantActions = []
        this.modalVisible = false
        this.saving = false
      },
      handleSubmit() {
        if (this.current === this.forms[0]) {
          this.$refs[this.current].validate((valid) => {
            if (valid) {
              this.saving = true
              if (this.formItem.userId) {
                updateDeveloper(this.formItem).then(res => {
                  if (res.code === 0) {
                    this.$message({
                type: 'success',
                message: '保存成功'
              })
                    this.handleReset()
                  }
                  this.handleSearch()
                }).finally(() => {
                  this.saving = false
                })
              } else {
                addDeveloper(this.formItem).then(res => {
                  if (res.code === 0) {
                    this.$message({
                type: 'success',
                message: '保存成功'
              })
                    this.handleReset()
                  }
                  this.handleSearch()
                }).finally(() => {
                  this.saving = false
                })
              }
            }
          })
        }

        if (this.current === this.forms[1] && this.formItem.userId) {
          this.$refs[this.current].validate((valid) => {
            if (valid) {
              this.saving = true
              updatePassword({
                userId: this.formItem.userId,
                password: this.formItem.password
              }).then(res => {
                if (res.code === 0) {
                  this.$message({
                type: 'success',
                message: '修改成功'
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
        getDevelopers(this.pageInfo).then(res => {
          this.data = res.data.records
          this.pageInfo.total = parseInt(res.data.total)
        }).finally(() => {
          this.loading = false
        })
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
      handlePage(current) {
        this.pageInfo.page = current
        this.handleSearch()
      },
      handlePageSize(size) {
        this.pageInfo.limit = size
        this.handleSearch()
      },
      handleClick(command) {
        
        switch (command.button) {
          case 'sendToEmail':
            this.$message({
                type: 'warning',
                message: '发送至密保邮箱,开发中...'
              })
            break
        }
      },
      composeValue(item, row){
        return {
        'button': item,
        'row': row
        }
      },
      handleTabClick(name) {
        // this.current = name
        this.handleModal();
      }
    },
    mounted: function () {
      this.handleSearch()
    }
  }

</script>

<style scoped>
   .linkfont {
    color: #409EFF;
    font-size: 14px;
  }
  .form-btn-box {
    width: 90%;
  }

  .toolbar {
    /* background: #f2f2f2; */
    height: 50px;
    padding-top: 5px;
  }

  .carmera-box {
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px #ccc dashed;
  }

</style>

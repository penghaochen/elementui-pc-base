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
        <!-- <el-button :disabled="hasAuthority('systemUserEdit')?false:true" type="primary" @click="handleModal()">添加</el-button> -->
        <el-button type="primary" @click="handleModal()">添加</el-button>
      </el-form-item>
    </el-form>
    <!-- <div style="margin-bottom:20px">
      <el-button :disabled="hasAuthority('systemUserEdit')?false:true" type="primary" @click="handleModal()">添加
      </el-button>
    </div> -->
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
      </el-table-column>
      <el-table-column prop="userType" label="用户类型" width="150">
      </el-table-column>
      <el-table-column prop="createTime" label="注册时间" width="180">
      </el-table-column>
      <el-table-column prop="userDesc" label="描述" width="220">
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="140">
        <template slot-scope="scope">
          <a :disabled="hasAuthority('systemUserEdit')?false:true" @click="handleModal(scope.row)" class="linkfont">编辑</a>&nbsp;
          <!-- <el-dropdown v-show="hasAuthority('systemUserEdit')" ref="dropdown" @on-click="handleClick($event,scope.row)"> -->
          <el-dropdown ref="dropdown" @on-click="handleClick($event,scope.row)">
            <a href="javascript:void(0)">
              <span class="linkfont">更多</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </a>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item name="sendToEmail">发送到密保邮箱</el-dropdown-item>
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
        <!--  用户信息菜单-->
        <el-tab-pane label="用户信息" name="form1">
          <el-form v-show="current=='form1'" ref="form1" :model="formItem" :rules="formItemRules" label-width="120px">
            <el-form-item label="用户类型" prop="userType">
              <template>
                <el-radio v-model="formItem.userType" label="1">超级管理员</el-radio>
                <el-radio v-model="formItem.userType" label="2">普通管理员</el-radio>
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
                <el-radio-button label="禁用" value="0"></el-radio-button>
                <el-radio-button label="正常" value="1"></el-radio-button>
                <el-radio-button label="锁定" value="2"></el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="描述" prop="userDesc">
              <el-input v-model="formItem.userDesc" placeholder="请输入内容" clearable type="textarea"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!--  分配角色菜单-->
        <!-- <el-tab-pane :disabled="!formItem.userId" label="分配角色" name="form2"> -->
        <el-tab-pane label="分配角色" name="form2">
          <el-form v-show="current == 'form2'" ref="form2" :model="formItem" label-width="120px" :rules="formItemRules">
            <el-form-item label="分配角色" prop="grantRoles">
              <el-checkbox-group v-model="formItem.grantRoles">
                <el-checkbox v-for="item in selectRoles" :label="item.roleId"><span>{{ item.roleName }}</span>
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!--  分配权限菜单-->
        <!-- <el-tab-pane :disabled="!formItem.userId" label="分配权限" name="form3"> -->
        <el-tab-pane label="分配权限" name="form3">
          <el-alert title='支持用户单独分配功能权限(除角色已经分配菜单功能,禁止勾选!)' type="info" show-icon></el-alert>
          <el-form v-show="current == 'form3'" ref="form3" :model="formItem" :rules="formItemRules" label-width="120px">
            <el-form-item label="过期时间" prop="expireTime">
              <el-badge v-if="formItem.isExpired" text="授权已过期">
                <el-date-picker v-model="formItem.expireTime" class="ivu-form-item-error" type="datetime"
                  placeholder="设置有效期">
                </el-date-picker>
              </el-badge>
              <el-date-picker v-else="" v-model="formItem.expireTime" type="datetime" placeholder="设置有效期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="功能菜单" prop="grantMenus">
              <tree-table ref="tree" style="max-height:450px;overflow: auto" expand-key="menuName" :expand-type="false"
                :is-fold="false" :tree-type="true" :selectable="true" :columns="columns2" :data="selectMenus">
                <template slot="operation" slot-scope="scope">
                  <CheckboxGroup v-model="formItem.grantActions">
                    <Checkbox :disabled="item.disabled" v-for="item in scope.row.actionList" :label="item.authorityId">
                      <span :title="item.actionDesc">{{item.actionName}}</span>
                    </Checkbox>
                  </CheckboxGroup>
                </template>
              </tree-table>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!--  修改密码-->
        <!-- <el-tab-pane :disabled="!formItem.userId" label="修改密码" name="form4"> -->
        <el-tab-pane label="修改密码" name="form4">
          <el-form v-show="current == 'form4'" ref="form4" :model="formItem" :rules="formItemRules" label-width="120px">
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
  import {getRoles, updateRole, addRole, removeRole, getRoleUsers, addRoleUsers} from '@/api/role'
  import {getAllUsers} from '@/api/user'
  import {
    getAuthorityMenu,
    getAuthorityRole,
    grantAuthorityRole
  } from '@/api/authority'
  import {startWith, listConvertTree} from '@/utils/util'

  export default {
    name: 'SystemRole',
    data () {
      const validateEn = (rule, value, callback) => {
        let reg = /^[_a-zA-Z0-9]+$/
        if (value === '') {
          callback(new Error('角色标识不能为空'))
        } else if (value !== '' && !reg.test(value)) {
          callback(new Error('只允许字母、数字、下划线'))
        } else {
          callback()
        }
      }
      return {
        titles: ['选择接口', '已选择接口'],
        listStyle: {
          width: '240px',
          height: '500px'
        },
        loading: false,
        modalVisible: false,
        modalTitle: '',
        saving: false,
        current: 'form1',
        forms: [
          'form1',
          'form2',
          'form3'
        ],
        selectApis: [],
        selectMenus: [],
        selectUsers: [],
        pageInfo: {
          total: 0,
          page: 1,
          limit: 10,
          roleCode: '',
          roleName: ''
        },
        formItemRules: {
          roleCode: [
            {required: true, validator: validateEn, trigger: 'blur'}
          ],
          roleName: [
            {required: true, message: '角色名称不能为空', trigger: 'blur'}
          ]
        },
        formItem: {
          roleId: '',
          roleCode: '',
          roleName: '',
          path: '',
          status: 1,
          menuId: '',
          priority: 0,
          roleDesc: '',
          grantMenus: [],
          grantActions: [],
          expireTime: '',
          isExpired: false,
          userIds: []
        },
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '角色名称',
            key: 'roleName',
            width: 300,
          },
          {
            title: '角色标识',
            key: 'roleCode',
            width: 300,
          },
          {
            title: '状态',
            slot: 'status',
            key: 'status',
            width: 100,
            filters: [
              {
                label: '禁用',
                value: 0
              },
              {
                label: '启用',
                value: 1
              }
            ],
            filterMultiple: false,
            filterMethod (value, row) {
              if (value === 0) {
                return row.status === 0
              } else if (value === 1) {
                return row.status === 1
              }
            }
          },
          {
            title: '最后修改时间',
            key: 'updateTime',
            width: 200,
          },
          {
            title: '描述',
            key: 'roleDesc'
          },
          {
            title: '操作',
            slot: 'action',
            fixed: 'right',
            width: 150
          }
        ],
        columns2: [
          {
            title: '菜单',
            key: 'menuName',
            minWidth: '250px',
          },
          {
            title: '操作',
            type: 'template',
            template: 'operation',
            minWidth: '200px'
          }
        ],
        data: []
      }
    },
    methods: {
      handleModal (data) {
        if (data) {
          this.formItem = Object.assign({}, this.formItem, data)
        }
        if (this.current === this.forms[0]) {
          this.modalTitle = data ? '编辑角色 - ' + data.roleName : '添加角色'
          this.modalVisible = true
        }
        if (this.current === this.forms[1]) {
          this.modalTitle = data ? '分配权限 - ' + data.roleName : '分配权限'
          this.handleLoadRoleGranted(this.formItem.roleId)
        }
        if (this.current === this.forms[2]) {
          this.modalTitle = data ? '角色成员 - ' + data.roleName : '角色成员'
          this.handleLoadRoleUsers(this.formItem.roleId)
        }
        this.formItem.status = this.formItem.status + ''
      },
      handleResetForm (form) {
        this.$refs[form].resetFields()
      },
      handleTabClick(name){
        // this.current = name
        this.handleModal();
      },
      handleReset () {
        const newData = {
          roleId: '',
          roleCode: '',
          roleName: '',
          path: '',
          status: 1,
          menuId: '',
          priority: 0,
          roleDesc: '',
          grantMenus: [],
          grantActions: [],
          expireTime: '',
          isExpired: false,
          userIds: []
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
      handleSubmit () {
        if (this.current === this.forms[0]) {
          this.$refs[this.current].validate((valid) => {
            if (valid) {
              this.saving = true
              if (this.formItem.roleId) {
                updateRole(this.formItem).then(res => {
                  if (res.code === 0) {
                    this.$Message.success('保存成功')
                    this.handleReset()
                  }
                  this.handleSearch()
                }).finally(() => {
                  this.saving = false
                })
              } else {
                addRole(this.formItem).then(res => {
                  if (res.code === 0) {
                    this.$Message.success('保存成功')
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

        if (this.current === this.forms[1]) {
          this.$refs[this.current].validate((valid) => {
            if (valid) {
              const authorityIds = this.getCheckedAuthorities()
              this.saving = true
              grantAuthorityRole({
                roleId: this.formItem.roleId,
                expireTime: this.formItem.expireTime ? this.formItem.expireTime.pattern('yyyy-MM-dd HH:mm:ss') : '',
                authorityIds: authorityIds
              }).then(res => {
                if (res.code === 0) {
                  this.$Message.success('授权成功')
                  this.handleReset()
                }
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
              addRoleUsers({
                roleId: this.formItem.roleId,
                userIds: this.formItem.userIds
              }).then(res => {
                if (res.code === 0) {
                  this.$Message.success('保存成功')
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
      handleSearch (page) {
        if (page) {
          this.pageInfo.page = page
        }
        this.loading = true
        getRoles(this.pageInfo).then(res => {
          this.data = res.data.records
          this.pageInfo.total = parseInt(res.data.total)
        }).finally(() => {
          this.loading = false
        })
      },
      handlePage (current) {
        this.pageInfo.page = current
        this.handleSearch()
      },
      handlePageSize (size) {
        this.pageInfo.limit = size
        this.handleSearch()
      },
      handleRemove (data) {
        this.$Modal.confirm({
          title: '确定删除吗？',
          onOk: () => {
            removeRole(data.roleId).then(res => {
              if (res.code === 0) {
                this.pageInfo.page = 1
                this.$Message.success('删除成功')
              }
              this.handleSearch()
            })
          }
        })
      },
      getCheckedAuthorities () {
        const menus = this.$refs['tree'].getCheckedProp('authorityId')
        return menus.concat(this.formItem.grantActions)
      },
      handleLoadRoleGranted (roleId) {
        if (!roleId) {
          return
        }
        const that = this
        const p1 = getAuthorityMenu()
        const p2 = getAuthorityRole(roleId)
        Promise.all([p1, p2]).then(function (values) {
          let res1 = values[0]
          let res2 = values[1]
          if (res1.code === 0 && res1.data) {
            let opt = {
              primaryKey: 'menuId',
              parentKey: 'parentId',
              startPid: '0'
            }
            if (res2.code === 0 && res2.data && res2.data.length > 0) {
              let menus = []
              let actions = []
              res2.data.map(item => {
                // 菜单权限
                if (item.authority.indexOf('MENU_') != -1 && !menus.includes(item.authorityId)) {
                  menus.push(item.authorityId)
                }
                // 操作权限
                if (item.authority.indexOf('ACTION_') != -1 && !actions.includes(item.authorityId)) {
                  actions.push(item.authorityId)
                }
              })
              that.formItem.grantMenus = menus;
              that.formItem.grantActions = actions;
              // 时间
              if (res2.data.length > 0) {
                that.formItem.expireTime = res2.data[0].expireTime
                that.formItem.isExpired = res2.data[0].isExpired
              }
            }
            res1.data.map(item => {
              // 菜单选中
              if (that.formItem.grantMenus.includes(item.authorityId)) {
                item._isChecked = true
              }
            })
            that.selectMenus = listConvertTree(res1.data, opt)
          }
          that.modalVisible = true
        })
      },
      handleLoadRoleUsers (roleId) {
        if (!roleId) {
          return
        }
        const that = this
        const p1 = getAllUsers()
        const p2 = getRoleUsers(roleId)
        Promise.all([p1, p2]).then(function (values) {
          let res1 = values[0]
          let res2 = values[1]
          if (res1.code === 0) {
            res1.data.map(item => {
              item.key = item.userId
              item.label = `${item.userName}(${item.nickName})`
            })
            that.selectUsers = res1.data
          }
          if (res2.code === 0) {
            let userIds = []
            res2.data.map(item => {
              if (!userIds.includes(item.userId)) {
                userIds.push(item.userId)
              }
            })
            that.formItem.userIds = userIds;
          }
          that.modalVisible = true
        })
      },
      /**
       * @description 设置el-table内容居中
       */
      cellstyle() {
        return "text-align:center;margin:0;padding:8px 0px 0px 0px";
      },
      /**
       * @description 设置el-table表头居中
       */
      rowClass() {
        return "text-align:center";
      },
      transferRender (item) {
        return `<span  title="${item.label}">${item.label}</span>`
      },
      handleTransferChange (newTargetKeys, direction, moveKeys) {
        this.formItem.userIds = newTargetKeys
      },
      handleClick (name, row) {
        switch (name) {
          case 'remove':
            this.handleRemove(row)
            break
        }
      }
    },
    mounted: function () {
      // this.handleSearch()
    }
  }
</script>

<style scoped>
  .linkfont {
    color: #0000CC;
    font-size: 12px;
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

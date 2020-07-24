<template>
  <div class="app-container calendar-list-container">

    <!-- 搜索模块 -->
    <el-form :inline="true" :model="pageInfo" size="small" class="demo-form-inline form-btn-box" ref="searchForm"
      label-width="80px" style="margin-bottom:30px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="pageInfo.roleName" placeholder="请输入关键字" clearable></el-input>
      </el-form-item>
      <el-form-item label="角色编码" prop="roleCode">
        <el-input v-model="pageInfo.roleCode" placeholder="请输入关键字" clearable></el-input>
      </el-form-item>
      <el-form-item style="margin-left:40px">
        <el-button type="primary" @click="handleSearch(1)">查询</el-button>
        <el-button type="default" @click="handleResetForm('searchForm')">重置</el-button>
        <el-button :disabled="hasAuthority('systemRoleEdit')?false:true" type="primary" @click="handleModal()">添加</el-button>
        <!-- <el-button type="primary" @click="handleModal()">添加</el-button> -->
      </el-form-item>
    </el-form>
    <!-- <div style="margin-bottom:20px">
      <el-button :disabled="hasAuthority('systemRoleEdit')?false:true" type="primary" @click="handleModal()">添加
      </el-button>
    </div> -->
    <!--应用详情-->
    <el-table :data="data" :loading="loading" border :cell-style="cellstyle" :header-cell-style="rowClass" size="small">
      <el-table-column type="selection" width="60">
      </el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="200">
      </el-table-column>
      <el-table-column prop="roleCode" label="角色编码" width="200">
      </el-table-column>
      <!-- <el-table-column prop="status" label="状态" width="200">
        <template slot-scope="scope">
          {{ scope.row.status | statusFilter }}
        </template>
      </el-table-column> -->
      <el-table-column prop="status" label="状态" width="200">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 0 ? 'danger' : 'success'" disable-transitions>{{scope.row.status | statusFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="最后修改时间" width="200">
      </el-table-column>
      <el-table-column prop="roleDesc" label="描述" width="200">
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="140">
        <template slot-scope="scope">
          <a @click="handleModal(scope.row)"
            :disabled="scope.row.roleCode != 'all' && hasAuthority('systemRoleEdit')?false:true"
            class="linkfont">编辑</a>&nbsp;
          <el-dropdown v-show="hasAuthority('systemRoleEdit')" ref="dropdown" @command="handleClick">
          <!-- <el-dropdown ref="dropdown" @on-click="handleClick($event,scope.row)"> -->
            <a href="javascript:void(0)" :disabled="scope.row.roleCode === 'all' ?true:false">
              <span class="linkfont">更多</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </a>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="composeValue('remove',scope.row)">删除角色</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>&nbsp;
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
    <el-dialog :title="modalTitle" :visible.sync="modalVisible" width="70%" :before-close="handleReset">
      <el-tabs v-model="current" @tab-click="handleTabClick">
        <!--  角色信息菜单-->
        <el-tab-pane label="角色信息" name="form1">
          <el-form v-show="current=='form1'" ref="form1" :model="formItem" :rules="formItemRules" label-width="120px">
            <el-form-item label="角色标识" prop="roleCode">
              <el-input v-model="formItem.roleCode" placeholder="请输入内容" clearable></el-input>
            </el-form-item>
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="formItem.roleName" placeholder="请输入内容" clearable></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="formItem.status" size="small">
                <el-radio-button label="0">禁用</el-radio-button>
                <el-radio-button label="1">启用</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="描述" prop="roleDesc">
              <el-input v-model="formItem.roleDesc" placeholder="请输入内容" clearable type="textarea"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!--  分配权限菜单-->
        <el-tab-pane :disabled="!formItem.roleId" label="分配权限" name="form2">
        <!-- <el-tab-pane label="分配权限" name="form2"> -->
          <el-form v-show="current == 'form2'" ref="form2" :model="formItem" :rules="formItemRules" label-width="120px">
            <el-form-item label="过期时间" prop="expireTime">
              <el-badge is-dot v-if="formItem.isExpired" text="授权已过期">
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
                  <el-checkbox-group v-model="formItem.grantActions">
                    <el-checkbox v-for="(item,index) in scope.row.actionList" :label="item.authorityId" :key="index">
                      <span :title="item.actionDesc">{{item.actionName}}</span>
                    </el-checkbox>
                  </el-checkbox-group>
                </template>
              </tree-table>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!--  角色成员菜单-->
        <el-tab-pane :disabled="!formItem.roleId" label="角色成员" name="form3">
        <!-- <el-tab-pane label="角色成员" name="form3"> -->
          <el-form v-show="current == 'form3'" ref="form3" :model="formItem" :rules="formItemRules" label-width="120px">
            <el-form-item prop="authorities">
              <el-transfer :data="selectUsers" :titles="['选择用户', '已选择用户']" :render-content="transferRender"
                v-model="formItem.userIds" @change="handleTransferChange" filterable></el-transfer>
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
    getRoles,
    updateRole,
    addRole,
    removeRole,
    getRoleUsers,
    addRoleUsers
  } from '@/api/role'
  import {
    getAllUsers
  } from '@/api/user'
  import {
    getAuthorityMenu,
    getAuthorityRole,
    grantAuthorityRole
  } from '@/api/authority'
  import {
    startWith,
    listConvertTree
  } from '@/utils/util'

  export default {
    name: 'SystemRole',
    data() {
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
          roleCode: [{
            required: true,
            validator: validateEn,
            trigger: 'blur'
          }],
          roleName: [{
            required: true,
            message: '角色名称不能为空',
            trigger: 'blur'
          }]
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
        columns: [{
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
            filters: [{
                label: '禁用',
                value: 0
              },
              {
                label: '启用',
                value: 1
              }
            ],
            filterMultiple: false,
            filterMethod(value, row) {
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
        columns2: [{
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
        data: [{status:1}, {status:0}]
      }
    },
    filters: {
      statusFilter(val) {
        let res = ''
        switch (val) {
          case 1:
            res = "启用"
            break;
          case 0:
            res = "禁用"
            break;
          default:
            res = "——"
        }
        return res
      },
    },
    methods: {
      handleModal(data) {
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
      handleResetForm(form) {
        this.$refs[form].resetFields()
      },
      handleTabClick(name) {
        // this.current = name
        this.handleModal();
      },
      handleReset() {
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
      handleSubmit() {
        if (this.current === this.forms[0]) {
          this.$refs[this.current].validate((valid) => {
            if (valid) {
              this.saving = true
              if (this.formItem.roleId) {
                updateRole(this.formItem).then(res => {
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
                addRole(this.formItem).then(res => {
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

        if (this.current === this.forms[1]) {
          this.$refs[this.current].validate((valid) => {
            if (valid) {
              const authorityIds = this.getCheckedAuthorities()
              this.saving = true
              grantAuthorityRole({
                roleId: this.formItem.roleId,
                expireTime: this.formItem.expireTime ? this.formItem.expireTime.pattern('yyyy-MM-dd HH:mm:ss') :
                  '',
                authorityIds: authorityIds
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

        if (this.current === this.forms[2]) {
          this.$refs[this.current].validate((valid) => {
            if (valid) {
              this.saving = true
              addRoleUsers({
                roleId: this.formItem.roleId,
                userIds: this.formItem.userIds
              }).then(res => {
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
          })
        }
      },
      handleSearch(page) {
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
      handlePage(current) {
        this.pageInfo.page = current
        this.handleSearch()
      },
      handlePageSize(size) {
        this.pageInfo.limit = size
        this.handleSearch()
      },
      handleRemove(data) {
        this.$confirm('确定删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeRole(data.roleId).then(res => {
              if (res.code === 0) {
                this.pageInfo.page = 1
                this.$message({
                type: 'success',
                message: '删除成功'
              })
              }
              this.handleSearch()
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      getCheckedAuthorities() {
        const menus = this.$refs['tree'].getCheckedProp('authorityId')
        return menus.concat(this.formItem.grantActions)
      },
      handleLoadRoleGranted(roleId) {
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
      handleLoadRoleUsers(roleId) {
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
      transferRender(h, option) {
        
        let ss=option.label
        return <span title={ss}>{ option.label }</span>
      },
      handleTransferChange(newTargetKeys, direction, moveKeys) {
        this.formItem.userIds = newTargetKeys
      },
      handleClick(command) {
        
        switch (command.button) {
          case 'remove':
            this.handleRemove(command.row)
            break
        }
      },
      composeValue(item, row){
        return {
        'button': item,
        'row': row
        }
      },
      filterTag(value, row) {
        return row.status === value;
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

<template>
  <div>
    <div class="search-con search-con-top">
      <el-button-group>
        <el-button
          size="small"
          :disabled="value.menuId && value.menuId!=='0' && !value.hasChild && hasAuthority('systemMenuEdit')?false:true"
          class="search-btn"
          type="primary"
          @click="handleModal()"
        >
          <span>添加功能按钮</span>
        </el-button>
      </el-button-group>
    </div>
    <el-alert type="info" show-icon :closable="false" style="margin:10px 0px 10px 0px">请绑定相关接口资源。否则请求网关服务器将提示<span
      style="color:red"
    >"权限不足,拒绝访问!"</span></el-alert>
    <el-table :data="data" :loading="loading" border :cell-style="cellstyle" :header-cell-style="rowClass" size="small">
      <el-table-column prop="actionName" label="功能名称" width="120">
        <template slot-scope="scope">
          <el-badge v-if="scope.row.status===1" is-dot type="success" />
          <el-badge v-if="scope.row.status===0" is-dot type="danger" />
          <span>{{ scope.row.actionName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="actionCode" label="功能编码" width="130" />
      <el-table-column label="操作" fixed="right" width="130">
        <template slot-scope="scope">
          <a
            style="color:#409EFF"
            :disabled="hasAuthority('systemMenuEdit')?false:true"
            @click="handleModal(scope.row)"
          >编辑</a> &nbsp;
          <a
            style="color:#409EFF"
            :disabled="hasAuthority('systemMenuEdit')?false:true"
            @click="handleModal(scope.row,forms[1])"
          >接口权限</a>&nbsp;
          <a
            style="color:#409EFF"
            :disabled="hasAuthority('systemMenuEdit')?false:true"
            @click="handleRemove(scope.row)"
          >删除</a>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="modalTitle" :visible.sync="modalVisible" width="60%" :before-close="handleReset">
      <div>
        <el-form v-show="current=='form1'" ref="form1" :model="formItem" :rules="formItemRules" label-width="120px">
          <el-form-item label="上级菜单">
            <el-input v-model="value.menuName" disabled />
          </el-form-item>
          <el-form-item label="功能标识" prop="actionCode">
            <el-input v-model="formItem.actionCode" placeholder="请输入内容" />
            <span>菜单标识+自定义标识.默认后缀：View、Edit</span>
          </el-form-item>
          <el-form-item label="功能名称" prop="actionName">
            <el-input v-model="formItem.actionName" placeholder="请输入内容" />
          </el-form-item>
          <el-form-item label="优先级">
            <el-input-number v-model="formItem.priority" />
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="formItem.status">
              <el-radio label="0">禁用</el-radio>
              <el-radio label="1">启用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="formItem.actionDesc" type="textarea" placeholder="请输入内容" />
          </el-form-item>
        </el-form>
        <el-form v-show="current=='form2'" ref="form2" :model="formItem" :rules="formItemRules">
          <el-form-item prop="authorities">
            <el-transfer
              v-model="formItem.authorityIds"
              :data="selectApis"
              :titles="['选择接口', '已选择接口']"
              :render-content="transferRender"
              filterable
              @change="handleTransferChange"
            />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="default" @click="handleReset">取消</el-button>&nbsp;
        <el-button size="small" type="primary" :loading="saving" @click="handleSubmit">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getActionsByMenu,
  updateAction,
  addAction,
  removeAction
} from '@/api/actionApi'
import {
  getAuthorityApi,
  getAuthorityAction,
  grantAuthorityAction
} from '@/api/authorityApi'

export default {
  name: 'MenuAction',
  props: {
    value: {
      type: Object,
      default() {
        return {
        }
      }
    }
  },
  data() {
    const validateEn = (rule, value, callback) => {
      const reg = /^[_a-zA-Z0-9]+$/
      if (value === '') {
        callback(new Error('功能标识不能为空'))
      } else if (value !== '' && !reg.test(value)) {
        callback(new Error('只允许字母、数字、下划线'))
      } else {
        callback()
      }
    }
    return {
      modalVisible: false,
      saving: false,
      loading: false,
      current: 'form1',
      forms: [
        'form1',
        'form2'
      ],
      modalTitle: '',
      confirmModal: false,
      selectApis: [],
      formItemRules: {
        actionCode: [{
          required: true,
          validator: validateEn,
          message: '功能编码不能为空',
          trigger: 'blur'
        }],
        actionName: [{
          required: true,
          message: '功能名称不能为空',
          trigger: 'blur'
        }]
      },
      formItem: {
        actionId: '',
        actionCode: '',
        actionName: '',
        authorityIds: [],
        status: 1,
        menuId: '',
        priority: 0,
        actionDesc: ''
      },
      columns: [{
        title: '功能名称',
        slot: 'status',
        width: 150
      },
      {
        title: '功能编码',
        key: 'actionCode'
      },
      {
        title: '操作',
        slot: 'action',
        fixed: 'right',
        width: 160
      }
      ],
      data: [{
        status: 1,
        actionName: '123',
        actionId: '123'
      }, {
        status: 0,
        actionName: '456',
        actionId: '456'
      }]
    }
  },
  watch: {
    value(val) {
      this.handleSearch()
    }
  },
  mounted: function() {},
  methods: {
    handleModal(data, step) {
      if (data) {
        this.formItem = Object.assign({}, this.formItem, data)
      }
      if (!step) {
        step = this.forms[0]
      }
      if (step === this.forms[0]) {
        this.modalTitle = data ? '编辑功能 - ' + this.value.menuName + ' > ' + data.actionName : '添加功能 - ' + this.value
          .menuName
        this.modalVisible = true
        this.formItem.actionCode = this.formItem.actionId ? this.formItem.actionCode : this.value.menuCode
      }
      if (step === this.forms[1]) {
        this.modalTitle = data ? '接口授权 - ' + this.value.menuName + ' > ' + data.actionName : '接口授权'
        this.handleLoadActionApi(this.formItem.actionId)
      }
      this.current = step
      this.formItem.status = this.formItem.status + ''
    },
    handleReset() {
      const newData = {
        actionId: '',
        actionCode: '',
        actionName: '',
        authorityIds: [],
        status: 1,
        priority: 0,
        actionDesc: ''
      }
      this.formItem = newData
      // 重置验证
      this.forms.map(form => {
        this.$refs[form].resetFields()
      })
      this.current = this.forms[0]
      this.modalVisible = false
      this.saving = false
    },
    handleSubmit() {
      if (this.current === this.forms[0]) {
        this.$refs[this.current].validate((valid) => {
          if (valid) {
            this.saving = true
            if (this.formItem.actionId) {
              updateAction(this.formItem).then(res => {
                this.handleReset()
                this.handleSearch()
                if (res.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '保存成功'
                  })
                }
              }).finally(() => {
                this.saving = false
              })
            } else {
              addAction(this.formItem).then(res => {
                this.handleReset()
                this.handleSearch()
                if (res.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '保存成功'
                  })
                }
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
            grantAuthorityAction({
              actionId: this.formItem.actionId,
              authorityIds: this.formItem.authorityIds
            }).then(res => {
              this.handleReset()
              this.handleSearch()
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '绑定成功'
                })
              }
            }).finally(() => {
              this.saving = false
            })
          }
        })
      }
    },
    handleSearch() {
      if (!this.value || !this.value.menuId) {
        return
      }
      this.formItem.menuId = this.value.menuId
      this.loading = true
      getActionsByMenu(this.formItem.menuId).then(res => {
        this.data = res.data
      }).finally(() => {
        this.loading = false
      })
    },
    handleRemove(data) {
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeAction(data.actionId).then(res => {
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
          message: '已取消删除'
        })
      })
    },
    handleLoadActionApi(actionId) {
      if (!actionId) {
        return
      }
      const that = this
      const p1 = getAuthorityApi('')
      const p2 = getAuthorityAction(actionId)
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
          const result = []
          res2.data.map(item => {
            if (!result.includes(item.authorityId)) {
              result.push(item.authorityId)
            }
          })
          that.formItem.authorityIds = result
        }
        // that.modalVisible = true
      })
      this.modalVisible = true
    },
    transferRender(h, option) {
      const ss = option.label
      return <span title={ss}>{ option.label }</span>
    },
    handleTransferChange(newTargetKeys, direction, moveKeys) {
      if (newTargetKeys.indexOf('1') !== -1) {
        this.formItem.authorityIds = ['1']
      } else {
        this.formItem.authorityIds = newTargetKeys
      }
    },
    /**
       * @description 设置el-table内容居中
       */
    cellstyle() {
      return 'padding-left: 10px;padding-right: 10px;'
    },
    /**
       * @description 设置el-table表头居中
       */
    rowClass() {
      return 'background:#f8f8f9;color:#515a6e;padding-left: 10px;padding-right: 10px;'
    }
  }
}

</script>

<template>
  <div>
    <el-card shadow="always">
      <div class="search-con search-con-top">
        <el-button-group>
          <el-button class="search-btn" type="primary" @click="handleModal()">
            <span>添加</span>
          </el-button>
        </el-button-group>
      </div>
      <el-table border :data="data" :loading="loading">
        <el-table-column prop="policyName" label="策略名称" width="200" />
        <el-table-column prop="policyType" label="策略类型" width="200">
          <template slot="policyType" slot-scope="{ row }">
            <el-tag v-if="row.policyType===1" type="success">允许-白名单</el-tag>
            <el-tag v-else="" type="danger">拒绝-黑名单</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="intervalUnit" label="单位时间" width="200" />
        <el-table-column prop="limitQuota" label="限流数" width="200" />
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <a class="linkfont" @click="handleModal(scope.row)">
              编辑</a>&nbsp;
            <a class="linkfont" @click="handleRemove(scope.row)">
              删除
            </a>
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
    </el-card>
    <el-dialog :visible.sync="modalVisible" :title="modalTitle" width="60%" @on-cancel="handleReset">
      <div>
        <el-tabs v-model="current" @tab-click="handleTabClick">
          <el-tab-pane label="策略信息" name="form1">
            <el-form v-show="current=='form1'" ref="form1" :model="formItem" :rules="formItemRules" label-width="100px">
              <el-form-item label="策略名称" prop="policyName">
                <el-input v-model="formItem.policyName" placeholder="请输入内容" />
              </el-form-item>
              <el-form-item label="策略类型" prop="policyType">
                <el-select v-model="formItem.policyType">
                  <el-option value="url" label="接口(url)" />
                  <el-option disabled value="origin" label="来源(origin)" />
                  <el-option disabled value="user" label="用户(user)" />
                </el-select>
              </el-form-item>
              <el-form-item label="单位时间" prop="intervalUnit">
                <el-select v-model="formItem.intervalUnit">
                  <el-option value="seconds" label="秒(seconds)" />
                  <el-option value="minutes" label="分钟(minutes)" />
                  <el-option value="hours" label="小时(hours)" />
                  <el-option value="days" label="天(days)" />
                </el-select>
              </el-form-item>
              <el-form-item label="限流数" prop="limitQuota">
                <el-input-number v-model="formItem.limitQuota" :min="10" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane :disabled="!formItem.policyId" label="绑定接口" name="form2">
            <el-alert type="warning" show-icon>请注意：如果API上原来已经绑定了一个策略，则会被本策略覆盖，请慎重选择！</el-alert>
            <el-form v-show="current=='form2'" ref="form2" :model="formItem" :rules="formItemRules">
              <el-form-item prop="authorities">
                <el-transfer
                  v-model="formItem.apiIds"
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
        <div class="drawer-footer">
          <el-button type="default" @click="handleReset">取消</el-button>&nbsp;
          <el-button type="primary" :loading="saving" @click="handleSubmit">保存</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRateLimits,
  addRateLimit,
  updateRateLimit,
  removeRateLimit,
  getRateLimitApis,
  addRateLimitApis
} from '@/api/rateLimitApi'
import {
  getAuthorityApi
} from '@/api/authorityApi'
export default {
  name: 'GatewayRateLimit',
  data() {
    return {
      loading: false,
      saving: false,
      modalVisible: false,
      modalTitle: '',
      pageInfo: {
        total: 0,
        page: 1,
        limit: 10
      },
      current: 'form1',
      forms: [
        'form1',
        'form2'
      ],
      selectApis: [],
      formItemRules: {
        policyName: [{
          required: true,
          message: '策略名称不能为空',
          trigger: 'blur'
        }],
        policyType: [{
          required: true,
          message: '策略类型不能为空',
          trigger: 'blur'
        }]
      },
      formItem: {
        policyId: '',
        policyName: '',
        policyType: 'url',
        intervalUnit: 'second',
        limitQuota: 10,
        apiIds: []
      },
      columns: [{
        title: '策略名称',
        key: 'policyName',
        width: 350
      },
      {
        title: '策略类型',
        key: 'policyType',
        width: 300
      },
      {
        title: '单位时间',
        key: 'intervalUnit'
      },
      {
        title: '限流数',
        key: 'limitQuota'
      },
      {
        title: '操作',
        slot: 'action',
        fixed: 'right',
        width: 150
      }
      ],
      data: [{}, {}]
    }
  },
  mounted: function() {
    this.handleSearch()
  },
  methods: {
    handleModal(data) {
      if (data) {
        this.formItem = Object.assign({}, this.formItem, data)
      }
      if (this.current === this.forms[0]) {
        this.modalTitle = data ? '编辑限流策略 - ' + this.formItem.policyName : '添加限流策略'
        this.modalVisible = true
      }
      if (this.current === this.forms[1]) {
        this.modalTitle = data ? '绑定接口 - ' + this.formItem.policyName : '绑定接口'
        this.handleRateLimitApi(this.formItem.policyId)
      }
      this.formItem.policyType = this.formItem.policyType + ''
    },
    handleTabClick(name) {
      // this.current = name
      this.handleModal()
    },
    handleReset() {
      const newData = {
        policyId: '',
        policyName: '',
        policyType: 'url',
        intervalUnit: 'second',
        limitQuota: 10,
        apiIds: []
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
            if (this.formItem.policyId) {
              updateRateLimit(this.formItem).then(res => {
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
              addRateLimit(this.formItem).then(res => {
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
            addRateLimitApis({
              policyId: this.formItem.policyId,
              apiIds: this.formItem.apiIds
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
    handleSearch(page) {
      if (page) {
        this.pageInfo.page = page
      }
      this.loading = true
      getRateLimits({
        page: this.pageInfo.page,
        limit: this.pageInfo.limit
      }).then(res => {
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
        removeRateLimit(data.policyId).then(res => {
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
        })
      })
    },
    handleRateLimitApi(policyId) {
      if (!policyId) {
        return
      }
      const that = this
      const p1 = getAuthorityApi('')
      const p2 = getRateLimitApis(policyId)
      Promise.all([p1, p2]).then(function(values) {
        const res1 = values[0]
        const res2 = values[1]
        if (res1.code === 0) {
          res1.data.map(item => {
            item.key = item.apiId
            item.label = `${item.prefix.replace('/**', '')}${item.path} - ${item.apiName}`
          })
          that.selectApis = res1.data
        }
        if (res2.code === 0) {
          const apiIds = []
          res2.data.map(item => {
            if (!apiIds.includes(item.apiId)) {
              apiIds.push(item.apiId)
            }
          })
          that.formItem.apiIds = apiIds
        }
        that.modalVisible = true
      })
    },
    transferRender(h, option) {
      const ss = option.label
      return <span title={ss}>{ option.label }</span>
    },
    handleTransferChange(newTargetKeys, direction, moveKeys) {
      if (newTargetKeys.indexOf('1') !== -1) {
        this.formItem.apiIds = ['1']
      } else {
        this.formItem.apiIds = newTargetKeys
      }
    },
    handleClick(name, row) {
      switch (name) {
        case 'remove':
          this.handleRemove(row)
          break
      }
    }
  }
}

</script>


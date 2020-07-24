<template>
  <div>
    <el-card shadow="always">
      <div class="search-con search-con-top">
        <el-button-group>
          <el-button
            :disabled="hasAuthority('gatewayRouteEdit')?false:true"
            class="search-btn"
            type="primary"
            @click="handleModal()"
          >
            <span>添加</span>
          </el-button>
        </el-button-group>
      </div>
      <el-alert show-icon>谨慎添加或修改路由,如果修改不当,将影响正常访问！&nbsp;<a class="linkfont" @click="handleRefreshGateway">手动刷新网关</a></el-alert>
      <el-table border :data="data" :loading="loading">
        <el-table-column prop="routeDesc" label="路由名称" width="200" />
        <el-table-column prop="routeName" label="路由标识" width="200" />
        <el-table-column prop="path" label="路由前缀" width="200" />
        <el-table-column prop="routeType" label="路由方式" width="400">
          <template slot-scope="scope">
            <span v-if="scope.row.serviceId?true:false"><el-tag type="success">负载均衡</el-tag>{{ scope.row.serviceId }}</span>
            <span v-else-if="scope.row.url?true:false"><el-tag>反向代理</el-tag>{{ scope.row.url }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <template slot-scope="scope">
            <a class="linkfont" :disabled="hasAuthority('gatewayRouteEdit')?false:true" @click="handleModal(scope.row)">
              编辑</a>&nbsp;
            <el-dropdown
              v-show="hasAuthority('gatewayRouteEdit')"
              ref="dropdown"
              transfer
              @command="handleClick"
            >
              <a class="linkfont" href="javascript:void(0)">
                <span>更多</span>
                <i class="el-icon-arrow-down el-icon--right" />
              </a>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="composeValue('remove',scope.row)">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>&nbsp;
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
    <el-dialog
      :visible.sync="modalVisible"
      :title="modalTitle"
      width="50%"
      :before-close="handleReset"
    >
      <div>
        <el-form ref="routeForm" :model="formItem" :rules="formItemRules" label-width="100px">
          <el-form-item label="路由名称" prop="routeDesc">
            <el-input v-model="formItem.routeDesc" placeholder="请输入内容" />
          </el-form-item>
          <el-form-item label="路由标识" prop="routeName">
            <el-input v-model="formItem.routeName" placeholder="默认使用服务名称{application.name}" />
          </el-form-item>
          <el-form-item label="路由前缀" prop="path">
            <el-input v-model="formItem.path" placeholder="/{path}/**" />
          </el-form-item>
          <el-form-item label="路由方式">
            <el-select v-model="selectType">
              <el-option value="service" label="负载均衡(serviceId)" />
              <el-option value="url" label="反向代理(url)" />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="selectType==='service'"
            label="负载均衡"
            prop="serviceId"
            :rules="{required: true, message: '服务名称不能为空', trigger: 'blur'}"
          >
            <el-input v-model="formItem.serviceId" placeholder="服务名称application.name" />
          </el-form-item>
          <el-form-item
            v-if="selectType==='url'"
            label="反向代理"
            prop="url"
            :rules="[{required: true, message: '服务地址不能为空', trigger: 'blur'},{type: 'url', message: '请输入有效网址', trigger: 'blur'}]"
          >
            <el-input v-model="formItem.url" placeholder="http://localhost:8080" />
          </el-form-item>
          <el-form-item label="忽略前缀">
            <el-radio-group v-model="formItem.stripPrefix">
              <el-radio label="0">否</el-radio>
              <el-radio label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="失败重试">
            <el-radio-group v-model="formItem.retryable">
              <el-radio label="0">否</el-radio>
              <el-radio label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="formItem.status">
              <el-radio label="0">禁用</el-radio>
              <el-radio label="1">启用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div class="drawer-footer">
          <el-button type="default" @click="handleReset">取消</el-button>&nbsp;
          <el-button type="primary" :loading="saving" @click="handleSubmit">保存</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRoutes, updateRoute, addRoute, removeRoute } from '@/api/routeApi'
import { refreshGateway } from '@/api/gatewayApi'

export default {
  name: 'GatewayRoute',
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
      selectType: 'service',
      selectServiceList: [],
      formItemRules: {
        routeDesc: [
          { required: true, message: '路由名称不能为空', trigger: 'blur' }
        ],
        routeName: [
          { required: true, message: '路由标识不能为空', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '路由前缀不能为空', trigger: 'blur' }
        ]
      },
      formItem: {
        routeId: '',
        path: '',
        serviceId: '',
        url: '',
        stripPrefix: 0,
        retryable: 0,
        status: 1,
        routeName: '',
        routeDesc: ''
      },
      columns: [
        {
          title: '路由名称',
          key: 'routeDesc',
          width: 300
        },
        {
          title: '路由标识',
          key: 'routeName',
          width: 300

        },
        {
          title: '路由前缀',
          key: 'path',
          width: 200
        },
        {
          title: '路由方式',
          slot: 'routeType',
          width: 300
        },
        {
          title: '忽略前缀',
          key: 'stripPrefix'
        },
        {
          title: '失败重试',
          key: 'retryable'
        },
        {
          title: '状态',
          key: 'status',
          slot: 'status'
        },
        {
          title: '操作',
          slot: 'action',
          fixed: 'right',
          width: 120
        }
      ],
      data: [{}]
    }
  },
  mounted: function() {
    this.handleSearch()
  },
  methods: {
    handleModal(data) {
      if (data) {
        this.modalTitle = '编辑路由'
        this.formItem = Object.assign({}, this.formItem, data)
      } else {
        this.modalTitle = '添加路由'
      }
      this.formItem.status = this.formItem.status + ''
      this.formItem.stripPrefix = this.formItem.stripPrefix + ''
      this.formItem.retryable = this.formItem.retryable + ''
      this.formItem.url = this.formItem.service ? '' : this.formItem.url
      this.formItem.service = this.formItem.url ? '' : this.formItem.service
      this.selectType = this.formItem.url ? 'url' : 'service'
      this.modalVisible = true
    },
    handleReset() {
      const newData = {
        routeId: '',
        path: '',
        serviceId: '',
        url: '',
        stripPrefix: 0,
        retryable: 0,
        status: 1,
        routeName: '',
        routeDesc: ''
      }
      this.formItem = newData
      // 重置验证
      this.$refs['routeForm'].resetFields()
      this.modalVisible = false
      this.saving = false
    },
    handleSubmit() {
      this.$refs['routeForm'].validate((valid) => {
        if (valid) {
          this.saving = true
          if (this.formItem.routeId) {
            updateRoute(this.formItem).then(res => {
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
            addRoute(this.formItem).then(res => {
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
    },
    handleSearch(page) {
      if (page) {
        this.pageInfo.page = page
      }
      this.loading = true
      getRoutes({ page: this.pageInfo.page, limit: this.pageInfo.limit }).then(res => {
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
        removeRoute(data.routeId).then(res => {
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
    handleClick(command) {
      switch (command.button) {
        case 'remove':

          this.handleRemove(command.row)
          break
      }
    },
    composeValue(item, row) {
      return {
        'button': item,
        'row': row
      }
    },
    handleRefreshGateway() {
      this.$confirm('将重新加载所有网关实例包括（访问权限、流量限制、IP访问限制、路由缓存），是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        refreshGateway().then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '刷新成功'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  }
}
</script>

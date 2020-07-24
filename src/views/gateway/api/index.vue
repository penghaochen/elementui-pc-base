<template>
  <div>
    <el-card shadow="always">
      <el-form ref="searchForm" :model="pageInfo" :inline="true" label-width="80px">
        <el-form-item label="请求路径" prop="path">
          <el-input v-model="pageInfo.path" type="text" placeholder="请输入关键字" />
        </el-form-item>
        <el-form-item label="接口名称" prop="apiName">
          <el-input v-model="pageInfo.apiName" type="text" placeholder="请输入关键字" />
        </el-form-item>
        <el-form-item label="接口编码" prop="apiCode">
          <el-input v-model="pageInfo.apiCode" type="text" placeholder="请输入关键字" />
        </el-form-item>
        <el-form-item label="服务名" prop="serviceId">
          <el-input v-model="pageInfo.serviceId" type="text" placeholder="请输入关键字" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch(1)">查询</el-button>&nbsp;
          <el-button @click="handleResetForm('searchForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="search-con search-con-top">
        <el-button-group>
          <el-button
            :disabled="hasAuthority('systemApiEdit')?false:true"
            class="search-btn"
            type="primary"
            @click="handleModal()"
          >
            <!-- <el-button class="search-btn" type="primary" @click="handleModal()"> -->
            <span>添加</span>
          </el-button>
        </el-button-group>
        <el-dropdown
          v-if="tableSelection.length>0 && hasAuthority('systemApiEdit')"
          style="margin-left: 70px"
          @command="handleBatchClick"
        >
          <!-- <el-dropdown @on-click="handleBatchClick" style="margin-left: 70px"> -->
          <el-button>
            <span>批量操作</span>
            <i class="el-icon-arrow-down" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item name="remove" :command="composeValue('remove',1)">删除</el-dropdown-item>
            <el-dropdown-item>
              <el-dropdown placement="right-start" @command="handleBatchClick">
                <span>状态</span>
                <i class="el-icon-arrow-right" />
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item name="status1" :command="composeValue('status1',1)">启用</el-dropdown-item>
                  <el-dropdown-item name="status2" :command="composeValue('status2',1)">禁用</el-dropdown-item>
                  <el-dropdown-item name="status3" :command="composeValue('status3',1)">维护中</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-dropdown placement="right-start" @command="handleBatchClick">

                <span>是否加密</span>
                <i class="el-icon-arrow-right" />

                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item name="enc0" :command="composeValue('enc0',1)">不加密</el-dropdown-item>
                  <el-dropdown-item name="enc1" :command="composeValue('enc1',1)">加密</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-dropdown placement="right-start" @command="handleBatchClick">

                <span>公开访问</span>
                <i class="el-icon-arrow-right" />

                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item name="open1" :command="composeValue('open1',1)">允许公开访问</el-dropdown-item>
                  <el-dropdown-item name="open2" :command="composeValue('open2',1)">拒绝公开访问</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-dropdown placement="right-start" @command="handleBatchClick">

                <span>身份认证</span>
                <i class="el-icon-arrow-right" />

                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item name="auth1" :command="composeValue('auth1',1)">开启身份认证</el-dropdown-item>
                  <el-dropdown-item name="auth2" :command="composeValue('auth2',1)">关闭身份认证</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <el-alert type="info" show-icon>
        <span>自动扫描<span style="color:red">@EnableResourceServer</span>资源服务器接口信息,注:自动添加的接口,都是未公开的. <span
          style="color:red"
        >只有公开的接口,才可以通过网关访问。否则将提示:"请求地址,拒绝访问!"</span></span>
      </el-alert>
      <el-table border :data="data" :loading="loading" @selection-change="handleTableSelectChange">
        <el-table-column type="selection" width="60" />
        <el-table-column label="名称" width="200" prop="apiName">
          <template slot-scope="scope">
            {{ scope.row.apiName }}
          </template>
        </el-table-column>
        <el-table-column prop="path" label="地址" width="200" />
        <el-table-column prop="apiCategory" label="分类" width="200" />
        <el-table-column prop="isEncrypt" label="是否加密" width="200">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isEncrypt===1" type="success">加密</el-tag>
            <el-tag v-if="scope.row.isEncrypt===0" type="danger">不加密</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="serviceId" label="服务名称" width="200" />
        <el-table-column prop="isAuth" label="接口安全" width="500">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isOpen===1" type="success">允许公开访问</el-tag>
            <el-tag v-else-if="scope.row.isOpen!==1" type="danger">拒绝公开访问</el-tag>
            <el-tag v-if="scope.row.isAuth===1" type="success">开启身份认证</el-tag>
            <el-tag v-else-if="scope.row.isAuth!==1" type="danger">关闭身份认证</el-tag>
            <el-tag v-if="scope.row.status===1" type="success">启用</el-tag>
            <el-tag v-else-if="scope.row.status===2" type="warning">维护中</el-tag>
            <el-tag v-else="" type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="apiDesc" label="描述" width="200" />
        <el-table-column prop="updateTime" label="最后更新时间" width="200" />
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <div v-show="scope.row.path!='/api/all'">
              <a class="linkfont" :disabled="hasAuthority('systemApiEdit')?false:true" @click="handleModal(scope.row)">
                编辑</a>&nbsp;
              <a class="linkfont" :disabled="hasAuthority('systemApiEdit')?false:true" @click="handleRemove(scope.row)">
                删除</a>
            </div>
            <div v-show="scope.row.path==='/api/all'">
              <a disabled>编辑</a>&nbsp;
              <a disabled>删除</a>
            </div>
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
    <el-dialog :title="modalTitle" :visible.sync="modalVisible" width="60%" :before-close="handleReset">
      <div>
        <el-alert v-if="formItem.apiId?true:false" type="info" show-icon>
          <span>自动扫描接口swagger注解。</span>
          <el-popover placement="bottom" title="示例代码" trigger="click">
            <span slot="reference" style="color:blue">示例代码</span>
            <div>
              <pre>
                // 接口介绍
                @ApiOperation(value = "接口名称", notes = "接口备注")
                @PostMapping("/testApi")
                // 忽略接口,将不再添加或修改次接口
                @ApiIgnore
                public ResultBody testApi() {
                    return ResultBody.success();
                }
              </pre>
            </div>
          </el-popover>
        </el-alert>
        <el-form ref="form1" :model="formItem" :rules="formItemRules" label-width="100px">
          <el-form-item label="服务名称" prop="serviceId">
            <el-select
              v-model="formItem.serviceId"
              :disabled="formItem.apiId && formItem.isPersist === 1?true:false"
              filterable
              clearable
            >
              <el-option v-for="(item,index) in selectServiceList" :key="index" :value="item.serviceId">
                {{ item.serviceName }}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="接口分类" prop="apiCategory">
            <el-input v-model="formItem.apiCategory" placeholder="请输入内容" />
          </el-form-item>
          <el-form-item label="接口编码" prop="apiCode">
            <el-input
              v-model="formItem.apiCode"
              :disabled="formItem.apiId && formItem.isPersist === 1?true:false"
              placeholder="请输入内容"
            />
          </el-form-item>
          <el-form-item label="接口名称" prop="apiName">
            <el-input
              v-model="formItem.apiName"
              :disabled="formItem.apiId && formItem.isPersist === 1?true:false"
              placeholder="请输入内容"
            />
          </el-form-item>
          <el-form-item label="是否加密传输:" prop="isEncrypt">
            <template>
              <el-radio-group v-model="formItem.isEncrypt">
                <el-radio label="0">不加密</el-radio>
                <el-radio label="1">加密</el-radio>
              </el-radio-group>
            </template>
          </el-form-item>
          <el-form-item label="请求地址" prop="path">
            <el-input
              v-model="formItem.path"
              :disabled="formItem.apiId && formItem.isPersist === 1?true:false"
              placeholder="请输入内容"
            />
          </el-form-item>
          <el-form-item label="优先级" prop="priority">
            <el-input-number v-model="formItem.priority" />
          </el-form-item>
          <el-form-item label="身份认证" prop="isAuth">
            <el-radio-group v-model="formItem.isAuth">
              <el-radio :disabled="formItem.apiId && formItem.isPersist === 1?true:false" label="0">关闭</el-radio>
              <el-radio :disabled="formItem.apiId && formItem.isPersist === 1?true:false" label="1">开启</el-radio>
            </el-radio-group>
            <p><code style="color:red">开启：未认证登录,提示"认证失败,请重新登录!";关闭: 不需要认证登录</code></p>
          </el-form-item>
          <el-form-item label="公开访问" prop="isOpen">
            <el-radio-group v-model="formItem.isOpen">
              <el-radio label="0">拒绝</el-radio>
              <el-radio label="1">允许</el-radio>
            </el-radio-group>
            <p><code style="color:red">拒绝:提示"请求地址,拒绝访问!"</code></p>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="formItem.status">
              <el-radio label="0">禁用</el-radio>
              <el-radio label="1">启用</el-radio>
              <el-radio label="2">维护中</el-radio>
            </el-radio-group>
            <p><code style="color:red">禁用：提示"请求地址,禁止访问!";维护中：提示"正在升级维护中,请稍后再试!";</code></p>
          </el-form-item>
          <el-form-item label="描述" prop="apiDesc">
            <el-input v-model="formItem.apiDesc" type="textarea" placeholder="请输入内容" />
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
// import {
//   listConvertTree
// } from '@/utils/util'
import {
  getAllApis,
  getApis,
  updateApi,
  addApi,
  removeApi,
  batchRemoveApi,
  batchUpdateOpenApi,
  batchUpdateStatusApi,
  batchUpdateAuthApi,
  batchUpdateEncApi
} from '@/api/apiApi'

import {
  getServiceList
} from '@/api/gatewayApi'

export default {
  name: 'SystemApi',
  data() {
    const validateEn = (rule, value, callback) => {
      const reg = /^[_.a-zA-Z0-9]+$/
      if (value === '') {
        callback(new Error('接口标识不能为空'))
      } else if (value !== '' && !reg.test(value)) {
        callback(new Error('只允许字母、数字、点、下划线'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      modalVisible: false,
      modalTitle: '',
      saving: false,
      tableSelection: [],
      pageInfo: {
        total: 0,
        page: 1,
        limit: 10,
        path: '',
        apiName: '',
        apiCode: '',
        serviceId: ''
      },
      selectServiceList: [],
      formItemRules: {
        serviceId: [{
          required: true,
          message: '所属服务不能为空',
          trigger: 'blur'
        }],
        isEncrypt: [{
          required: true,
          message: '是否加密传输不能为空！',
          trigger: 'change'
        }],
        apiCategory: [{
          required: true,
          message: '接口分类不能为空',
          trigger: 'blur'
        }],
        path: [{
          required: true,
          message: '接口地址不能为空',
          trigger: 'blur'
        }],
        apiCode: [{
          required: true,
          validator: validateEn,
          trigger: 'blur'
        }],
        apiName: [{
          required: true,
          message: '接口名称不能为空',
          trigger: 'blur'
        }]
      },
      formItem: {
        apiId: '',
        apiCode: '',
        apiName: '',
        apiCategory: 'default',
        path: '',
        isEncrypt: '',
        status: '',
        isAuth: '',
        openSwatch: false,
        authSwatch: true,
        serviceId: '',
        priority: '',
        apiDesc: '',
        isOpen: ''
      },
      columns: [{
        type: 'selection',
        width: 60,
        align: 'center'
      },
      // {
      //   title: '编码',
      //   key: 'apiCode',
      //   width: 300
      // },
      {
        title: '名称',
        key: 'apiName',
        slot: 'apiName',
        width: 300,
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
        title: '地址',
        key: 'path',
        width: 200
      },
      {
        title: '分类',
        key: 'apiCategory',
        width: 100
      },
      {
        title: '是否加密',
        key: 'isEncrypt',
        slot: 'isTestEnc',
        width: 150
      },
      {
        title: '服务名称',
        key: 'serviceId',
        width: 200
      },
      {
        title: '接口安全',
        key: 'isAuth',
        slot: 'isAuth',
        width: 300
      },
      {
        title: '描述',
        key: 'apiDesc',
        width: 200
      },
      {
        title: '最后更新时间',
        key: 'updateTime',
        width: 180
      },
      {
        title: '操作',
        key: '',
        slot: 'action',
        fixed: 'right',
        width: 120
      }
      ],
      data: [{
        apiName: '1231'
      }, {
        apiName: '3435'
      }]
    }
  },
  mounted: function() {
    this.handleLoadServiceList()
    this.handleSearch()
  },
  methods: {
    handleModal(data) {
      if (data) {
        this.modalTitle = '编辑接口 - ' + data.apiName
        this.formItem = Object.assign({}, this.formItem, data)
      } else {
        this.modalTitle = '添加接口'
      }
      this.formItem.status = this.formItem.status + ''
      this.formItem.isAuth = this.formItem.isAuth + ''
      this.formItem.isEncrypt = this.formItem.isEncrypt + ''
      this.formItem.isOpen = this.formItem.isOpen + ''
      this.modalVisible = true
    },
    handleResetForm(form) {
      this.$refs[form].resetFields()
    },
    handleReset() {
      const newData = {
        apiId: '',
        apiCode: '',
        apiName: '',
        apiCategory: 'default',
        path: '',
        status: '',
        isAuth: '',
        serviceId: '',
        isEncrypt: '',
        priority: '',
        apiDesc: '',
        isOpen: ''
      }
      this.formItem = newData
      // 重置验证
      this.handleResetForm('form1')
      this.modalVisible = false
      this.saving = false
    },
    handleSubmit() {
      this.$refs['form1'].validate((valid) => {
        if (valid) {
          this.saving = true
          if (this.formItem.apiId) {
            updateApi(this.formItem).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '保存成功'
                })
                getAllApis().then(res => {
                  if (res.code === 0) {
                    sessionStorage.removeItem('apiList')
                    window.sessionStorage.setItem('apiList', JSON.stringify(res.data))
                  }
                  setTimeout(() => {
                    this.handleReset()
                    this.handleSearch()
                  }, 1000)
                })
              }
            }).finally(() => {
              this.saving = false
            })
          } else {
            addApi(this.formItem).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '保存成功'
                })
                getAllApis().then(res => {
                  if (res.code === 0) {
                    sessionStorage.removeItem('apiList')
                    window.sessionStorage.setItem('apiList', JSON.stringify(res.data))
                  }
                  setTimeout(() => {
                    this.handleReset()
                    this.handleSearch()
                  }, 1000)
                })
              }
            }).finally(() => {
              this.saving = false
            })
          }
        }
      })
    },
    handleRemove(data) {
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeApi(data.apiId).then(res => {
          this.handleSearch()
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
    handleSearch(page) {
      this.tableSelection = []
      if (page) {
        this.pageInfo.page = page
      }
      this.loading = true

      // const ss = window.sessionStorage.getItem('apiList')
      getApis(this.pageInfo).then(res => {
        this.data = res.data.records
        this.pageInfo.total = parseInt(res.data.total)
        this.data.forEach(v => {
          if (v.path === '/api/all') {
            v._disabled = true
          }
        })
      }).finally(() => {
        this.loading = false
      })
    },
    filterTag(value, row) {
      return row.status === value
    },
    handlePage(current) {
      this.pageInfo.page = current
      this.handleSearch()
    },
    handlePageSize(size) {
      this.pageInfo.limit = size
      this.handleSearch()
    },
    handleLoadServiceList() {
      getServiceList().then(res => {
        if (res.code === 0) {
          this.selectServiceList = res.data
        }
      })
    },
    handleTableSelectChange(selection) {
      this.tableSelection = selection
    },
    composeValue(item, row) {
      return {
        'button': item,
        'row': row
      }
    },
    handleBatchClick(command) {
      if (command.button) {
        this.$confirm('已勾选' + this.tableSelection.length + '项,是否继续执行操作？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const ids = []
          this.tableSelection.map(item => {
            if (!ids.includes(item.apiId)) {
              ids.push(item.apiId)
            }
          })
          switch (command.button) {
            case 'remove':
              batchRemoveApi(ids).then(res => {
                if (res.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '批量操作成功'
                  })
                }
                this.handleSearch()
              })
              break
            case 'open1':
              batchUpdateOpenApi({
                ids: ids,
                open: 1
              }).then(res => {
                if (res.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '批量操作成功'
                  })
                }
                this.handleSearch()
              })
              break
            case 'open2':
              batchUpdateOpenApi({
                ids: ids,
                open: 2
              }).then(res => {
                if (res.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '批量操作成功'
                  })
                }
                this.handleSearch()
              })
              break
            case 'status1':
              batchUpdateStatusApi({
                ids: ids,
                status: 1
              }).then(res => {
                if (res.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '批量操作成功'
                  })
                }
                this.handleSearch()
              })
              break
            case 'status2':
              batchUpdateStatusApi({
                ids: ids,
                status: 0
              }).then(res => {
                if (res.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '批量操作成功'
                  })
                }
                this.handleSearch()
              })
              break
            case 'status3':
              batchUpdateStatusApi({
                ids: ids,
                status: 2
              }).then(res => {
                if (res.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '批量操作成功'
                  })
                }
                this.handleSearch()
              })
              break
            case 'auth1':
              batchUpdateAuthApi({
                ids: ids,
                auth: 1
              }).then(res => {
                if (res.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '批量操作成功'
                  })
                }
                this.handleSearch()
              })
              break
            case 'auth2':
              batchUpdateAuthApi({
                ids: ids,
                auth: 0
              }).then(res => {
                if (res.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '批量操作成功'
                  })
                }
                this.handleSearch()
              })
              break
            case 'enc0':
              batchUpdateEncApi({
                ids: ids,
                encrypt: 0
              }).then(res => {
                if (res.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '批量操作成功'
                  })
                  getAllApis().then(res => {
                    if (res.code === 0) {
                      sessionStorage.removeItem('apiList')
                      window.sessionStorage.setItem('apiList', JSON.stringify(res.data))
                    }
                    setTimeout(() => {
                      this.handleSearch()
                    }, 1000)
                  })
                }
              })
              break
            case 'enc1':
              batchUpdateEncApi({
                ids: ids,
                encrypt: 1
              }).then(res => {
                if (res.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '批量操作成功'
                  })
                  getAllApis().then(res => {
                    if (res.code === 0) {
                      sessionStorage.removeItem('apiList')
                      window.sessionStorage.setItem('apiList', JSON.stringify(res.data))
                    }
                    setTimeout(() => {
                      this.handleSearch()
                    }, 1000)
                  })
                }
              })
              break
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      }
    }
  }
}

</script>


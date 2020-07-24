<template>
  <div>
    <el-card shadow="always">
      <el-form
        ref="searchForm"
        :model="pageInfo"
        :inline="true"
        label-width="80px"
      >
        <el-form-item label="请求路径" prop="path">
          <el-input v-model="pageInfo.path" type="text" placeholder="请输入关键字" />
        </el-form-item>
        <el-form-item label="IP" prop="ip">
          <el-input v-model="pageInfo.ip" type="text" placeholder="请输入关键字" />
        </el-form-item>
        <el-form-item label="服务名" prop="serviceId">
          <el-input v-model="pageInfo.serviceId" type="text" placeholder="请输入关键字" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch(1)">查询</el-button>&nbsp;
          <el-button @click="handleResetForm('searchForm')">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table border :data="data" :loading="loading">
        <el-table-column type="selection" width="60" />
        <el-table-column prop="path" label="请求地址" width="200" />
        <el-table-column prop="method" label="请求方式" width="200">
          <template slot-scope="scope">
            {{ scope.row.method }}
          </template>
        </el-table-column>
        <el-table-column prop="ip" label="IP" width="200" />
        <el-table-column prop="region" label="区域" width="200" />
        <el-table-column prop="terminal" label="终端" width="200">
          <template slot-scope="scope">
            {{ scope.row.userAgent | terminalFilter }}
          </template>
        </el-table-column>
        <el-table-column prop="browser" label="浏览器" width="200">
          <template slot-scope="scope">
            {{ scope.row.userAgent | browserFilter }}
          </template>
        </el-table-column>
        <el-table-column prop="serviceId" label="服务名" width="200" />
        <el-table-column prop="httpStatus" label="响应状态" width="200">
          <template slot-scope="scope">
            <el-badge v-if="scope.row.httpStatus==='200'" is-dot type="success" />
            <el-badge v-else="" is-dot type="danger" />
            <span>{{ scope.row.httpStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="useTime" label="耗时" width="200">
          <template slot-scope="scope">
            {{ (scope.row.useTime ? scope.row.useTime : 0) + ' ms' }}
          </template>
        </el-table-column>
        <el-table-column prop="requestTime" label="请求时间" width="200" />
        <el-table-column label="详情" width="200" fixed="right">
          <template slot-scope="scope">
            <a class="linkfont" @click="openDrawer(scope.row)">详情</a>
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
    <el-drawer size="30%" :visible.sync="drawer" :with-header="false">
      <div style="padding-left:16px;padding:8px;border-bottom:1px solid  #ccc">
        <el-badge v-if="currentRow.httpStatus==='200'" is-dot type="success" />
        <el-badge v-else="" is-dot type="danger" />
        <span style="margin-top:16px;display:inline-block;font-size:13px;color:#707070">
          {{ currentRow.httpStatus }}
          {{ currentRow.path }} - {{ currentRow.serviceId }}
        </span>
      </div>
      <div style="padding-left:16px;margin-bottom:40px">
        <h5 style="color:#707070">请求头</h5>
        <pre style="background-color:#f0f0f0;color:#c7254e;font-size:14px;overflow:hidden;width:380px;display:inline-block;word-break:break-all;word-wrap:break-word;white-space: pre-wrap;">
             {{ currentRow.headers ? JSON.stringify(JSON.parse(currentRow.headers), null, 4) : '' }}
        </pre>
        <h5 style="color:#707070">请求参数</h5>
        <pre style="background-color:#f0f0f0;color:#c7254e;font-size:14px;overflow:hidden;width:380px;display:inline-block;word-break:break-all;word-wrap:break-word;white-space: pre-wrap;">
              {{ currentRow.params ? JSON.stringify(JSON.parse(currentRow.params), null, 4) : '' }}
        </pre>
        <h5 style="color:#707070">错误信息</h5>
        <pre style="background-color:#f0f0f0;color:#c7254e;font-size:14px;overflow:hidden;width:380px;display:inline-block;word-break:break-all;word-wrap:break-word;white-space: pre-wrap;">
          {{ currentRow.error }}
        </pre>
        <h5 style="color:#707070">认证信息</h5>
        <pre style="background-color:#f0f0f0;color:#c7254e;font-size:14px;overflow:hidden;width:380px;display:inline-block;word-break:break-all;word-wrap:break-word;white-space: pre-wrap;">
              {{ currentRow.authentication ? JSON.stringify(JSON.parse(currentRow.authentication), null, 4) : '' }}
        </pre>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getAccessLogs } from '@/api/gateway'
import { readUserAgent } from '@/utils/util'

export default {
  name: 'GatewayAccessLog',
  filters: {
    terminalFilter(val) {
      if (val) {
        return readUserAgent(val).terminal
      } else {
        return '未知'
      }
    },
    browserFilter(val) {
      if (val) {
        return readUserAgent(val).browser
      } else {
        return '未知'
      }
    }
  },
  data() {
    return {
      drawer: false,
      currentRow: {},
      loading: false,
      pageInfo: {
        total: 0,
        page: 1,
        limit: 10,
        path: '',
        ip: '',
        serviceId: ''
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '请求地址',
          key: 'path',
          width: 220
        },
        {
          title: '请求方式',
          key: 'method',
          width: 100,
          filters: [
            {
              label: 'POST',
              value: 0
            },
            {
              label: 'GET',
              value: 1
            },
            {
              label: 'DELETE',
              value: 2
            },
            {
              label: 'OPTIONS',
              value: 3
            },
            {
              label: 'PATCH',
              value: 4
            }
          ],
          filterMultiple: false,
          filterMethod(value, row) {
            if (value === 0) {
              return row.method === 'POST'
            } else if (value === 1) {
              return row.method === 'GET'
            } else if (value === 2) {
              return row.method === 'DELETE'
            } else if (value === 3) {
              return row.method === 'OPTIONS'
            } else if (value === 4) {
              return row.method === 'PATCH'
            }
          }
        },
        {
          title: 'IP',
          key: 'ip',
          width: 150
        },
        {
          title: '区域',
          key: 'region',
          width: 200
        },
        {
          title: '终端',
          width: 100,
          render: (h, params) => {
            return h('div', readUserAgent(params.row.userAgent).terminal)
          }
        },
        {
          title: '浏览器',
          width: 100,
          render: (h, params) => {
            return h('div', readUserAgent(params.row.userAgent).browser)
          }
        },
        {
          title: '服务名',
          key: 'serviceId',
          width: 200
        },
        {
          title: '响应状态',
          key: 'httpStatus',
          slot: 'httpStatus',
          width: 100
        },
        {
          title: '耗时',
          key: 'useTime',
          render: (h, params) => {
            return h('div', (params.row.useTime ? params.row.useTime : 0) + ' ms')
          },
          width: 100
        },
        {
          title: '请求时间',
          key: 'requestTime',
          width: 200
        },
        {
          title: '详情',
          slot: 'detail',
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
    openDrawer(data) {
      this.currentRow = data
      this.drawer = true
    },
    handleSearch(page) {
      if (page) {
        this.pageInfo.page = page
      }
      this.loading = true
      getAccessLogs(this.pageInfo).then(res => {
        this.data = res.data.records
        this.pageInfo.total = parseInt(res.data.total)
      }).finally(() => {
        this.loading = false
      })
    },
    handleResetForm(form) {
      this.$refs[form].resetFields()
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
      return row.status === value
    }
  }
}
</script>


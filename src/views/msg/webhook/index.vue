<template>
  <div>
    <el-card shadow="always">
      <el-form
        ref="searchForm"
        :model="pageInfo"
        :inline="true"
        label-width="80px"
      >
        <el-form-item label="通知地址" prop="url">
          <el-input v-model="pageInfo.url" type="text" placeholder="请输入关键字" />
        </el-form-item>
        <el-form-item label="业务类型" prop="type">
          <el-input v-model="pageInfo.type" type="text" placeholder="请输入关键字" />
        </el-form-item>
        <el-form-item label="通知结果" prop="result">
          <el-select v-model="pageInfo.result">
            <el-option value="" label="全部" />
            <el-option value="1" label="成功" />
            <el-option value="0" label="失败" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch(1)">查询</el-button>&nbsp;
          <el-button @click="handleResetForm('searchForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table border :data="data" :loading="loading">
        <el-table-column type="selection" width="60" />
        <el-table-column prop="msgId" label="通知标识" width="200" />
        <el-table-column prop="url" label="通知地址" width="200" />
        <el-table-column prop="type" label="业务类型" width="200" />
        <el-table-column prop="result" label="通知结果" width="200">
          <template slot-scope="scope">
            <el-badge v-if="scope.row.result===1" is-dot type="success" text="成功" />
            <el-badge v-else="" is-dot type="danger" text="失败" />
            <span v-if="scope.row.result===1">成功</span>
            <span v-else="">失败</span>
          </template>
        </el-table-column>
        <el-table-column prop="retryNums" label="重试次数" width="200" />
        <el-table-column prop="totalNums" label="通知次数" width="200" />
        <el-table-column prop="delay" label="当前重试时间" width="200">
          <template slot-scope="scope">
            {{ (scope.row.delay ? scope.row.delay / 1000 : 0) + ' s' }}
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="最后修改时间" width="200" />
        <el-table-column fixed="right" label="详情" width="200">
          <template slot-scope="scope">
            <a @click="openDrawer(scope.row)">详情</a>
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
    <el-drawer size="40%" :with-header="false" :visible.sync="drawer">
      <div style="padding-left:16px;padding:8px;border-bottom:1px solid  #ccc">
        <el-badge v-if="currentRow.result===1" is-dot type="success" />
        <el-badge v-else="" is-dot type="danger" />
        <span style="margin-top:16px;display:inline-block;font-size:13px;color:#707070">
          {{ currentRow.url }}
        </span>
      </div>
      <div style="padding-left:16px;margin-bottom:40px">
        <h5 style="color:#707070">执行参数</h5>
        <pre style="background-color:#f0f0f0;color:#c7254e;font-size:14px;overflow:hidden;width:420px;display:inline-block;word-break:break-all;word-wrap:break-word;white-space: pre-wrap;">
              {{ currentRow.data ? JSON.stringify(JSON.parse(currentRow.data), null, 2) : '' }}
        </pre>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getNotifyHttpLogs } from '@/api/msgApi'

export default {
  name: 'MsgHttpLogs',
  data() {
    return {
      drawer: false,
      currentRow: {},
      loading: false,
      pageInfo: {
        total: 0,
        page: 1,
        limit: 10,
        url: '',
        type: '',
        result: ''
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '通知标识',
          key: 'msgId',
          width: 200
        },
        {
          title: '通知地址',
          key: 'url',
          width: 350
        },
        {
          title: '业务类型',
          key: 'type',
          width: 150
        },
        {
          title: '通知结果',
          key: 'result',
          slot: 'status',
          width: 100
        },
        {
          title: '重试次数',
          key: 'retryNums',
          width: 100
        },
        {
          title: '通知次数',
          key: 'totalNums',
          width: 100
        },
        {
          title: '当前重试时间',
          key: 'delay',
          render: (h, params) => {
            return h('div', (params.row.delay ? params.row.delay / 1000 : 0) + ' s')
          },
          width: 200
        },
        {
          title: '最后修改时间',
          key: 'updateTime'
        },
        {
          title: '详情',
          slot: 'detail',
          fixed: 'right',
          width: 150
        }
      ],
      data: []
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
      getNotifyHttpLogs(this.pageInfo).then(res => {
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
    }
  }
}
</script>

<template>
  <div>
    <el-card shadow="always">
      <el-form
        ref="searchForm"
        :model="pageInfo"
        :inline="true"
        label-width="80px"
      >
        <el-form-item label="任务名称" prop="jobName">
          <el-input v-model="pageInfo.jobName" type="text" placeholder="请输入关键字" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch(1)">查询</el-button>&nbsp;
          <el-button @click="handleResetForm('searchForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table border :data="data" :loading="loading">
        <el-table-column prop="jobName" label="任务名称" width="200" />
        <el-table-column prop="jobName" label="调度信息" width="600">
          <template slot-scope="scope">
            <p v-if="scope.row.cronExpression">cron表达式:{{ scope.row.cronExpression }}</p>
            <p v-else="">调度时间:{{ scope.row.startDate }} ~ {{ scope.row.endDate }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="执行结果" width="200">
          <template slot-scope="scope">
            <el-badge v-if="scope.row.status===1" is-dot type="success" text="成功" />
            <el-badge v-else="" is-dot type="danger" text="失败" />
            <span v-if="scope.row.status===1">成功</span>
            <span v-else="">失败</span>
          </template>
        </el-table-column>
        <el-table-column prop="runTime" label="耗时" width="200">
          <template slot-scope="scope">
            {{ (scope.row.runTime ? scope.row.runTime : 0) + ' ms' }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="200" />
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
        <el-badge v-if="currentRow.status===1" is-dot type="success" />
        <el-badge v-else="" is-dot type="danger" />
        <span style="margin-top:16px;display:inline-block;font-size:13px;color:#707070">
          {{ currentRow.jobName }}
        </span>
      </div>
      <div style="padding-left:16px;margin-bottom:40px">
        <h5 style="color:#707070">执行类：{{ currentRow.jobClass }}</h5>
        <h5 style="color:#707070">触发器：{{ currentRow.triggerClass }}</h5>
        <h5 style="color:#707070">运行时长：{{ currentRow.runTime }} ms</h5>
        <h5 v-if="currentRow.cronExpression" style="color:#707070">cron表达式：{{ currentRow.cronExpression }}</h5>
        <h5 v-else="" style="color:#707070">调度时间：: {{ currentRow.startDate }} ~ {{ currentRow.endDate }}</h5>
        <h5 style="color:#707070">执行参数</h5>
        <pre style="background-color:#f0f0f0;color:#c7254e;font-size:14px;overflow:hidden;width:420px;display:inline-block;word-break:break-all;word-wrap:break-word;white-space: pre-wrap;">
              {{ currentRow.jobData ? JSON.stringify(JSON.parse(currentRow.jobData), null, 4) : '' }}
        </pre>
        <h5 style="color:#707070">错误信息</h5>
        <pre style="background-color:#f0f0f0;color:#c7254e;font-size:14px;overflow:hidden;width:420px;display:inline-block;word-break:break-all;word-wrap:break-word;white-space: pre-wrap;">
          {{ currentRow.exception }}
        </pre>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getJobLogs } from '@/api/jobApi'

export default {
  name: 'TaskJobLogs',
  data() {
    return {
      drawer: false,
      currentRow: {},
      loading: false,
      pageInfo: {
        total: 0,
        page: 1,
        limit: 10,
        jobName: ''
      },
      columns: [
        {
          title: '任务名称',
          key: 'jobName',
          width: 150
        },
        {
          title: '调度信息',
          width: 350,
          slot: 'type'
        },
        {
          title: '执行结果',
          key: 'status',
          slot: 'status'
        },
        {
          title: '耗时',
          key: 'runTime',
          render: (h, params) => {
            return h('div', (params.row.runTime ? params.row.runTime : 0) + ' ms')
          }
        },
        {
          title: '创建时间',
          key: 'createTime'
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
      getJobLogs(this.pageInfo).then(res => {
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

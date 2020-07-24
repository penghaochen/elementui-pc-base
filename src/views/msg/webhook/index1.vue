<template>
  <div>
    <el-card shadow="always">
      <el-form
        ref="searchForm"
        :model="pageInfo"
        :inline="true"
        label-width="80px"
      >
        <el-form-item label="微信号" prop="openId">
          <el-input v-model="pageInfo.openId" type="text" placeholder="请输入关键字" />
        </el-form-item>
        <el-form-item label="通知结果" prop="status">
          <el-select v-model="pageInfo.status">
            <el-option value="0" label="消息未发送" />
            <el-option value="1" label="消息发送成功" />
            <el-option value="2" label="消息发送失败" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch(1)">查询</el-button>&nbsp;&nbsp;&nbsp;
          <el-button @click="handleResetForm('searchForm')">重置</el-button>&nbsp;&nbsp;&nbsp;
          <el-button @click="handleDown()">报表下载</el-button>
        </el-form-item>
      </el-form>
      <el-table border :data="data" :loading="loading">
        <el-table-column type="selection" width="60" />
        <el-table-column prop="customerNo" label="客户号" width="200" />
        <el-table-column prop="openId" label="微信号" width="200" />
        <el-table-column prop="workDate" label="客户账单时间" width="200" />
        <el-table-column prop="status" label="消息状态" width="200">
          <template slot-scope="scope">
            <el-badge v-if="scope.row.status===1" is-dot type="success" text="成功" />
            <el-badge v-else="" is-dot type="danger" text="失败" />
            <span v-if="scope.row.status===1">成功</span>
            <span v-else="">失败</span>
          </template>
        </el-table-column>
        <el-table-column prop="fileUrl" label="文件链接" width="200" />
        <el-table-column prop="tradeName" label="交易名称" width="200" />
        <el-table-column prop="voucherDate" label="凭证日期" width="200" />
        <el-table-column prop="voucherTime" label="凭证时间" width="200" />
        <el-table-column prop="retryCount" label="重试次数" width="200" />
        <el-table-column prop="errorMessage" label="失败说明" width="200" />
        <el-table-column prop="createTime" label="入库时间" width="200" />
        <el-table-column prop="updateTime" label="更新状态时间" width="200" />
        <el-table-column label="操作" width="200" fixed="right">
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
import { getBatchLogs } from '@/api/msgApi'

export default {
  name: 'MsgHttpLogs',
  data() {
    return {
      drawer: false,
      currentRow: {},
      loading: false,
      pageInfo: {
        total: 0,
        pageNo: 1,
        pageSize: 10,
        status: '1',
        openId: ''
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '客户号',
          key: 'customerNo',
          width: 150
        },
        {
          title: '微信号',
          key: 'openId',
          width: 250
        },
        {
          title: '客户账单时间',
          key: 'workDate',
          width: 150
        },
        {
          title: '消息状态',
          key: 'status',
          slot: 'status',
          width: 100
        },
        {
          title: '文件链接',
          key: 'fileUrl',
          width: 200
        },
        {
          title: '交易名称',
          key: 'tradeName',
          width: 100
        },
        {
          title: '凭证日期',
          key: 'voucherDate',
          width: 100
        },
        {
          title: '凭证时间',
          key: 'voucherTime',
          width: 100
        },
        {
          title: '重试次数',
          key: 'retryCount',
          width: 100
        },
        {
          title: '失败说明',
          key: 'errorMessage',
          width: 200
        },
        {
          title: '入库时间',
          key: 'createTime',
          width: 100
        },
        {
          title: '更新状态时间',
          key: 'updateTime',
          width: 120
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
        this.pageInfo.pageNo = page
      }
      this.loading = true
      getBatchLogs(this.pageInfo).then(res => {
        this.data = res.records
        this.pageInfo.total = parseInt(res.total)
      }).finally(() => {
        this.loading = false
      })
    },
    handleResetForm(form) {
      this.$refs[form].resetFields()
    },
    handleDown() {
      const link = document.createElement('a')
      link.href = '/pmobile/wcb/reportdemo/export'

      // eslint-disable-next-line no-irregular-whitespace
      // 打开新的窗口
      // link.target="view_window"
      // 对下载的文件命名
      // eslint-disable-next-line no-irregular-whitespace
      // link.download =  "导入模板.xls";
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    handlePage(current) {
      this.pageInfo.pageNo = current
      this.handleSearch()
    },
    handlePageSize(size) {
      this.pageInfo.pageSize = size
      this.handleSearch()
    }
  }
}
</script>

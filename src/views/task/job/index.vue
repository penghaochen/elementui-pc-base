<template>
  <div>
    <el-card shadow="always">
      <div class="search-con search-con-top">
        <el-button-group>
          <el-button
            :disabled="hasAuthority('jobEdit')?false:true"
            class="search-btn"
            type="primary"
            @click="handleModal()"
          >
            <span>添加</span>
          </el-button>
        </el-button-group>
      </div>
      <el-table border :data="data" :loading="loading">
        <el-table-column type="selection" width="60" />
        <el-table-column prop="jobName" label="任务名称" width="200" />
        <el-table-column prop="cronExpression" label="调度信息" width="600">
          <template slot-scope="scope">
            <p v-if="scope.row.cronExpression">cron表达式:{{ scope.row.cronExpression }}</p>
            <p v-else="">调度时间:{{ scope.row.startDate }} ~ {{ scope.row.endDate }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="jobStatus" label="状态" width="200">
          <template slot-scope="scope">
            <el-badge v-if="scope.row.jobStatus==='NORMAL'" is-dot type="success" text="正常" />
            <el-badge v-else="" is-dot type="danger" text="暂停" />
            <span v-if="scope.row.jobStatus==='NORMAL'">正常</span>
            <span v-else="">暂停</span>
          </template>
        </el-table-column>
        <el-table-column prop="jobDescription" label="任务描述" width="200" />
        <el-table-column label="操作" fixed="right" width="140">
          <template slot-scope="scope">
            <a :disabled="hasAuthority('jobEdit')?false:true" class="linkfont" @click="handleModal(scope.row)">编辑</a>&nbsp;
            <el-dropdown v-show="hasAuthority('jobEdit')" ref="dropdown" @command="handleClick">
              <a href="javascript:void(0)">
                <span class="linkfont">更多</span>
                <i class="el-icon-arrow-down el-icon--right" />
              </a>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="scope.row.jobStatus ==='NORMAL'?true:false" :command="composeValue('pause',scope.row)">暂停任务</el-dropdown-item>
                <el-dropdown-item v-if="scope.row.jobStatus ==='PAUSED'?true:false" :command="composeValue('resume',scope.row)">恢复任务</el-dropdown-item>
                <el-dropdown-item :command="composeValue('remove',scope.row)">删除任务</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
        <el-form ref="form1" :model="formItem" :rules="formItemRules" label-width="100px">
          <el-form-item label="任务名称" prop="jobName">
            <el-input v-model="formItem.jobName" :disabled="formItem.newData?false:true" placeholder="请输入内容" />
          </el-form-item>
          <el-form-item label="任务类型" prop="jobType">
            <el-select v-model="formItem.jobType">
              <el-option value="cron" label="cron任务(CronTrigger)" />
              <el-option value="simple" label="简单任务(SimpleTrigger)" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="formItem.jobType === 'simple'" label="开始时间" prop="startTime">
            <el-date-picker
              v-model="formItem.startTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="开始时间"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item v-if="formItem.jobType === 'simple'" label="结束时间" prop="endTime">
            <el-date-picker v-model="formItem.endTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="结束时间" style="width: 100%" />
          </el-form-item>
          <el-form-item v-if="formItem.jobType === 'simple'" label="重复执行" prop="repeatCount">
            <el-input-number v-model="formItem.repeatCount" :min="-1" /> &nbsp;&nbsp;次
            &nbsp;&nbsp;

            <el-radio-group v-model="formItem.repeatCountType" @change="repeatCountTypeChange">
              <el-radio-button label="0">不重复执行</el-radio-button>
              <el-radio-button label="-1">不限制次数,一直重复执行(直到过期)</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="formItem.jobType === 'simple'" label="重复执行间隔" prop="repeatInterval">
            <el-input-number v-model="formItem.repeatInterval" :min="1000" />
            <span>&nbsp;&nbsp;毫秒</span>
          </el-form-item>
          <el-form-item v-if="formItem.jobType === 'cron'" label="cron表达式" prop="cron">
            <el-input v-model="formItem.cron" placeholder="* * * * * ?" />
          </el-form-item>
          <el-form-item label="远程调度接口" prop="path">
            <el-select v-model="formItem.path" filterable @change="handleOnSelectChange">
              <el-option v-for="(item,index) in selectApis" :key="index" :value="item.path">{{ item.path
              }} - {{ item.apiName }} - {{ item.serviceId }}

              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务描述">
            <el-input v-model="formItem.jobDescription" type="textarea" placeholder="请输入内容" />
          </el-form-item>
          <el-form-item label="异常告警邮箱" prop="alarmMail">
            <el-input v-model="formItem.alarmMail" placeholder="请输入内容" />
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
// import { listConvertTree } from '@/utils/util'
import { getJobs, addHttpJob, updateHttpJob, removeJob, pauseJob, resumeJob } from '@/api/job'
import { getAllApi } from '@/api/api'
export default {
  name: 'TaskJob',
  data() {
    return {
      loading: false,
      modalVisible: false,
      modalTitle: '',
      saving: false,
      pageInfo: {
        total: 0,
        page: 1,
        limit: 10
      },
      selectApis: [],
      formItemRules: {
        jobName: [
          { required: true, message: '任务名称不能为空', trigger: 'blur' }
        ],
        jobType: [
          { required: true, message: '任务类型不能为空', trigger: 'blur' }
        ],
        cron: [
          { required: true, message: 'cron表达式不能为空', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '调度接口不能为空', trigger: 'blur' }
        ],
        alarmMail: [
          { required: false, type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '开始时间不能为空' }
        ],
        repeatInterval: [
          { required: true, message: '间隔时间不能为空' }
        ],
        repeatCount: [
          { required: true, message: '重试次数不能为空' }
        ]
      },
      formItem: {
        newData: true,
        jobName: '',
        jobDescription: '',
        jobType: 'cron',
        cron: '',
        startTime: '',
        endTime: '',
        repeatInterval: 10000,
        repeatCountType: '0',
        repeatCount: 0,
        serviceId: '',
        path: '',
        method: '',
        contentType: '',
        alarmMail: ''
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '任务名称',
          key: 'jobName',
          width: 200
        },
        {
          title: '调度信息',
          width: 350,
          slot: 'type'
        },
        {
          title: '状态',
          key: 'jobStatus',
          slot: 'status'
        },
        {
          title: '任务描述',
          key: 'jobDescription'
        },
        {
          title: '操作',
          key: '',
          slot: 'action',
          fixed: 'right',
          width: 150
        }
      ],
      data: []
    }
  },
  mounted: function() {
    this.handleSearch()
    this.handleLoadApiList()
  },
  methods: {
    handleModal(data) {
      if (data) {
        this.modalTitle = '编辑任务 - ' + data.jobName
        this.formItem = Object.assign({}, this.formItem, data)
        this.formItem.jobType = this.formItem.jobTrigger === 'org.quartz.impl.triggers.SimpleTriggerImpl' ? 'simple' : 'cron'
        this.formItem.cron = data.cronExpression
        this.formItem.startTime = data.startDate
        this.formItem.endTime = data.endDate
        this.formItem.repeatInterval = data.repeatInterval ? parseInt(data.repeatInterval) : 0
        this.formItem.repeatCountType = data.repeatCount + ''
        this.formItem.path = data.data.path
        this.formItem.serviceId = data.data.serviceId
        this.formItem.method = data.data.method
        this.formItem.contentType = data.data.contentType
        this.formItem.alarmMail = data.data.alarmMail
        this.formItem.newData = false
      } else {
        this.modalTitle = '添加任务'
      }
      this.modalVisible = true
    },
    handleTabClick(name) {
      // this.current = name
      this.handleModal()
    },
    handleReset() {
      const newData = {
        newData: true,
        jobName: '',
        jobDescription: '',
        jobType: 'cron',
        cron: '',
        startTime: '',
        endTime: '',
        repeatInterval: 10000,
        repeatCountType: '0',
        repeatCount: 0,
        serviceId: '',
        path: '',
        method: '',
        contentType: '',
        alarmMail: ''
      }
      this.formItem = newData
      // 重置验证
      this.$refs['form1'].resetFields()
      this.modalVisible = false
      this.saving = false
    },
    handleSubmit() {
      this.$refs['form1'].validate((valid) => {
        if (valid) {
          if (this.formItem.jobType === 'simple') {
            console.log(this.formItem.startTime)
            debugger
            // this.formItem.startTime = this.formItem.startTime ? this.formItem.startTime.pattern('yyyy-MM-dd HH:mm:ss') : ''
            // this.formItem.endTime = this.formItem.endTime ? this.formItem.endTime.pattern('yyyy-MM-dd HH:mm:ss') : ''
          }
          this.saving = true
          if (!this.formItem.newData) {
            updateHttpJob(this.formItem).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '保存成功'
                })
              }
              this.handleReset()
              this.handleSearch()
            }).finally(() => {
              this.saving = false
            })
          } else {
            addHttpJob(this.formItem).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '保存成功'
                })
              }
              this.handleReset()
              this.handleSearch()
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
        removeJob(data.jobName).then(res => {
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
          message: '已取消'
        })
      })
    },
    handlePause(data) {
      this.$confirm('确定暂停任务吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        pauseJob(data.jobName).then(res => {
          this.handleSearch()
          if (res.code === 0) {
            this.pageInfo.page = 1
            this.$message({
              type: 'success',
              message: '暂停成功'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    handleResume(data) {
      this.$confirm('确定恢复任务吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resumeJob(data.jobName).then(res => {
          this.handleSearch()
          if (res.code === 0) {
            this.pageInfo.page = 1
            this.$message({
              type: 'success',
              message: '恢复成功'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    handleSearch(page) {
      if (page) {
        this.pageInfo.page = page
      }
      this.loading = true
      getJobs(this.pageInfo).then(res => {
        this.data = res.data.records
        this.pageInfo.total = parseInt(res.data.total)
      }).finally(() => {
        this.loading = false
      })
    },
    handleLoadApiList() {
      this.loading = true
      getAllApi().then(res => {
        this.selectApis = res.data
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
    handleOnSelectChange(value) {
      let api = {}
      this.selectApis.some(item => {
        if (item.path === value) {
          api = item
          return true
        }
      })
      this.formItem.serviceId = api.serviceId
      this.formItem.path = api.path
      this.formItem.contentType = api.contentType
      this.formItem.method = api.requestMethod
    },
    handleClick(command) {
      switch (command.button) {
        case 'pause':
          this.handlePause(command.row)
          break
        case 'resume':
          this.handleResume(command.rowow)
          break
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
    repeatCountTypeChange(value) {
      this.formItem.repeatCount = parseInt(value)
    }
  }
}
</script>

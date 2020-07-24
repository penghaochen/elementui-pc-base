<template>
  <div>
    <el-card shadow="always">
      <el-form ref="searchForm" :model="pageInfo" :inline="true" label-width="100px">
        <el-form-item label="响应码:" prop="rspCode">
          <el-input v-model="pageInfo.rspCode" clearable type="text" placeholder="请输入响应码！" style="width:300px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd()">新增</el-button>
        </el-form-item>
      </el-form>

      <el-table border :data="data" :loading="loading">
        <el-table-column prop="rspCode" label="响应码" width="300" />
        <el-table-column prop="rspMsg" label="响应信息" width="500" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <a class="linkfont" style="margin-right:30px" @click="openDrawer(scope.row)">修改</a>
            <a class="linkfont" @click="handleRemove(scope.row)">删除</a>
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
    <el-drawer size="30%" :visible.sync="drawerEdit" title="修改响应码配置" :show-close="false">
      <div style="margin-left:20px">
        <template>
          <el-form ref="editForm" :model="currentEdit" label-width="120px" label-position="left" :rules="ruleValidate">
            <el-form-item label="响应码:" prop="rspCode">
              <el-input v-model="currentEdit.rspCode" placeholder="请输入响应码" style="width:220px" />
            </el-form-item>
            <el-form-item label="响应信息:" prop="rspMsg">
              <el-input v-model="currentEdit.rspMsg" placeholder="请输入响应信息" style="width:220px" />
            </el-form-item>
            <el-button type="primary" long style="width:300px;margin-top:30px" @click="editSubmit">提交</el-button>
          </el-form>
        </template>
      </div>
    </el-drawer>
    <el-drawer size="30%" :visible.sync="drawerAdd" title="添加响应码配置" :show-close="false">
      <div style="margin-left:20px">
        <template>
          <el-form ref="addForm" :model="currentAdd" label-width="120px" label-position="left" :rules="ruleValidate">
            <el-form-item label="响应码:" prop="rspCode">
              <el-input v-model="currentAdd.rspCode" placeholder="请输入响应码" style="width:220px" />
            </el-form-item>
            <el-form-item label="响应信息:" prop="rspMsg">
              <el-input v-model="currentAdd.rspMsg" placeholder="请输入响应信息" style="width:220px" />
            </el-form-item>
            <el-button type="primary" long style="width:300px;margin-top:30px" @click="addSubmit">提交</el-button>
          </el-form>
        </template>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  saveRspMsg,
  editRspMsg,
  getRspMsgPage,
  deleteRspMsgById
} from '@/api/dictionaryConfig'
export default {
  name: 'DictionaryConfig',
  data() {
    return {
      drawerEdit: false,
      drawerAdd: false,
      currentEdit: {
        rspCode: '',
        rspMsg: ''
      },
      currentAdd: {
        rspCode: '',
        rspMsg: ''
      },
      loading: false,
      pageInfo: {
        total: 0,
        page: 1,
        limit: 10,
        rspCode: ''
      },
      columns: [{
        title: '响应码',
        key: 'rspCode',
        width: 400
      },
      {
        title: '响应信息',
        key: 'rspMsg',
        width: 400
      },
      {
        title: '操作',
        slot: 'handle',
        fixed: 'right'
      }
      ],
      ruleValidate: {
        rspCode: [{
          required: true,
          message: '响应码不能为空！',
          trigger: 'blur'
        }],
        rspMsg: [{
          required: true,
          message: '响应信息不能为空！',
          trigger: 'blur'
        }]
      },
      data: [{}]
    }
  },
  mounted: function() {
    this.handleSearch()
  },
  methods: {
    handleSearch() {
      this.loading = true

      getRspMsgPage(this.pageInfo).then(res => {
        this.data = res.data.records
        this.pageInfo.total = parseInt(res.data.total)
      }).finally(() => {
        this.loading = false
      })
    },
    handleAdd() {
      this.drawerAdd = true
      setTimeout(() => {
        this.$refs.addForm.resetFields()
      }, 0)
      this.currentAdd = {
        rspCode: '',
        rspMsg: ''
      }
    },
    editSubmit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.currentEdit))

          editRspMsg(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '修改成功！'
              })
            }
            this.drawerEdit = false
            this.handleSearch()
          }).catch(() => {
            this.drawerEdit = false
          })
        } else {
          this.$message({
            type: 'error',
            message: '验证不通过'
          })
        }
      })
    },
    addSubmit() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          const params = this.currentAdd

          saveRspMsg(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '新增成功！'
              })
            }
            this.drawerAdd = false
            this.handleSearch()
          }).catch(() => {
            this.drawerAdd = false
          })
        } else {
          this.$message({
            type: 'error',
            message: '验证不通过'
          })
        }
      })
    },
    handleRemove(data) {
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRspMsgById(data).then(res => {
          if (res.code === 0) {
            this.pageInfo.page = 1
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          }
          this.handleSearch()
        }).catch(() => {
          this.handleSearch()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    openDrawer(data) {
      this.currentEdit = JSON.parse(JSON.stringify(data))
      this.drawerEdit = true
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

<style lang="less">
  .account-setting {
    &-con {
      height: ~"calc(100vh - 176px)";
      display: inline-block;
      vertical-align: top;
      position: relative;

      &.left-con {
        border-right: 1px solid #e6e6e6;
      }

      &.view-con {
        position: absolute;
        left: 264px;
        top: 16px;
        right: 16px;
        bottom: 16px;
        overflow: auto;
        padding: 12px 20px 0;
      }
    }
  }

  .linkfont {
    color: #409EFF;
    font-size: 14px;
  }
  .el-drawer{

    overflow: auto
    }

</style>

<template>
  <div>
    <el-card shadow="always">
      <el-form ref="searchForm" :model="pageInfo" inline label-width="120px">
        <el-form-item>
          <el-button type="primary" @click="handleSearch()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd()">新增</el-button>
        </el-form-item>
      </el-form>

      <el-table border :data="data" :loading="loading">
        <el-table-column prop="namespace" label="命名空间" width="150" />
        <el-table-column prop="dataId" label="dataId" width="200" />
        <el-table-column prop="nacosGroup" label="Group" width="200" />
        <el-table-column prop="databaseTable" label="数据库表" width="200" />
        <el-table-column prop="nacosKey" label="配置项key" width="150" />
        <el-table-column prop="fields" label="配置字段集合" width="300" />
        <el-table-column prop="status" label="状态" width="150">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status==='1'" type="success">已与数据库同步</el-tag>
            <el-tag v-if="scope.row.status==='0'" type="danger">未与数据库同步</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <a class="linkfont" style="margin-right:15px" @click="openDrawer(scope.row)">修改</a>
            <a class="linkfont" style="margin-right:15px" @click="handleRemove(scope.row)">删除</a>
            <a class="linkfont" @click="handleRefresh(scope.row)">刷新</a>
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
    <el-drawer size="30%" :visible.sync="drawerAdd" title="添加验证标准" :show-close="false">
      <div style="margin-left:20px">
        <template>
          <el-form ref="addForm" :model="currentAdd" label-width="120px" label-position="left" :rules="ruleValidate">
            <el-form-item label="命名空间:" prop="namespace">
              <el-input v-model="currentAdd.namespace" placeholder="请输入命名空间" style="width:220px" />
            </el-form-item>
            <el-form-item label="dataId:" prop="dataId">
              <el-input v-model="currentAdd.dataId" placeholder="请输入dataId" style="width:220px" />
            </el-form-item>
            <el-form-item label="Group:" prop="nacosGroup">
              <el-input v-model="currentAdd.nacosGroup" placeholder="请输入group" style="width:220px" />
            </el-form-item>
            <el-form-item label="数据库表:" prop="databaseTable">
              <el-select
                v-model="currentAdd.databaseTable"
                style="width:220px"
                placeholder="请选择"
                @change="dataTableChange()"
              >
                <el-option
                  v-for="item in databaseTableOptions"
                  :key="item.tableName"
                  :label="item.tableName"
                  :value="item.tableName"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="配置项key:" prop="nacosKey">
              <el-select v-model="currentAdd.nacosKey" style="width:220px" placeholder="请选择" @change="nacosKeyChange()">
                <el-option
                  v-for="item in nacosKeyOptions"
                  :key="item.columnName"
                  :label="item.columnName"
                  :value="item.columnName"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="配置字段集合:" prop="fields">
              <el-select v-model="currentAdd.fields" multiple style="width:220px" placeholder="请选择">
                <el-option
                  v-for="item in nacosKeyOptions1"
                  :key="item.columnName"
                  :label="item.columnName"
                  :value="item.columnName"
                />
              </el-select>
            </el-form-item>
            <el-button type="primary" long style="width:300px;margin-top:30px" @click="addSubmit">提交</el-button>
          </el-form>
        </template>
      </div>
    </el-drawer>
    <el-drawer size="30%" :visible.sync="drawerEdit" title="修改验证标准" :show-close="false">
      <div style="margin-left:20px">
        <template>
          <el-form ref="editForm" :model="currentEdit" label-width="120px" label-position="left" :rules="ruleValidate">
            <el-form-item label="命名空间:" prop="namespace">
              <el-input v-model="currentEdit.namespace" placeholder="请输入命名空间" style="width:220px" />
            </el-form-item>
            <el-form-item label="dataId:" prop="dataId">
              <el-input v-model="currentEdit.dataId" placeholder="请输入dataId" style="width:220px" />
            </el-form-item>
            <el-form-item label="Group:" prop="nacosGroup">
              <el-input v-model="currentEdit.nacosGroup" placeholder="请输入group" style="width:220px" />
            </el-form-item>
            <el-form-item label="数据库表:" prop="databaseTable">
              <el-select
                v-model="currentEdit.databaseTable"
                style="width:220px"
                placeholder="请选择"
                @change="dataTableChange()"
              >
                <el-option
                  v-for="item in databaseTableOptions"
                  :key="item.tableName"
                  :label="item.tableName"
                  :value="item.tableName"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="配置项key:" prop="nacosKey">
              <el-select v-model="currentEdit.nacosKey" style="width:220px" placeholder="请选择" @change="nacosKeyChange()">
                <el-option
                  v-for="item in nacosKeyOptions"
                  :key="item.columnName"
                  :label="item.columnName"
                  :value="item.columnName"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="配置字段集合:" prop="fields">
              <el-select v-model="currentEdit.fields" multiple style="width:220px" placeholder="请选择">
                <el-option
                  v-for="item in nacosKeyOptions1"
                  :key="item.columnName"
                  :label="item.columnName"
                  :value="item.columnName"
                />
              </el-select>
            </el-form-item>
            <el-button type="primary" long style="width:300px;margin-top:30px" @click="editSubmit">提交</el-button>
          </el-form>
        </template>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  getDynamicPage,
  getTables,
  getColumnNames,
  refresh,
  deleteById,
  save,
  edit
} from '@/api/dynamicApi'
export default {
  name: 'Dynamic',
  data() {
    return {
      databaseTableOptions: [],
      nacosKeyOptions: [],
      nacosKeyOptions1: [],
      drawerEdit: false,
      drawerAdd: false,
      currentEdit: {},
      currentAdd: {},
      loading: false,
      pageInfo: {
        total: 0,
        page: 1,
        limit: 10
      },
      ruleValidate: {
        dataId: [{
          required: true,
          message: 'dataId不能为空！',
          trigger: 'blur'
        }],
        nacosGroup: [{
          required: true,
          message: 'Group不能为空！',
          trigger: 'blur'
        }],
        databaseTable: [{
          required: true,
          message: '数据库表不能为空！',
          trigger: 'change'
        }],
        nacosKey: [{
          required: true,
          message: '配置项key不能为空！',
          trigger: 'change'
        }],
        fields: [{
          required: true,
          message: '配置字段集合不能为空！',
          trigger: 'change'
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
      getDynamicPage(this.pageInfo).then(res => {
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
        namespace: '',
        dataId: '',
        nacosGroup: '',
        databaseTable: '',
        nacosKey: '',
        fields: ''
      }
      this.databaseTableOptions = []
      this.nacosKeyOptions = []
      this.nacosKeyOptions1 = []
      getTables({}).then(res => {
        this.databaseTableOptions = JSON.parse(JSON.stringify(res.data))
      }).finally(() => {})
    },
    dataTableChange() {
      this.currentAdd.nacosKey = ''
      this.currentAdd.fields = ''
      this.nacosKeyOptions = []
      this.nacosKeyOptions1 = []
      const params = {
        tableName: this.currentAdd.databaseTable
      }
      getColumnNames(params).then(res => {
        this.nacosKeyOptions = JSON.parse(JSON.stringify(res.data))
      }).finally(() => {})
    },
    nacosKeyChange() {
      this.currentAdd.fields = ''
      this.nacosKeyOptions1 = []
      this.nacosKeyOptions.forEach(v => {
        if (v.columnName !== this.currentAdd.nacosKey) {
          this.nacosKeyOptions1.push(v)
        }
      })
    },
    editSubmit() {
      let str = ''
      this.currentEdit.fields.forEach(v => {
        str = str + v + ','
      })
      str = str.substring(0, str.length - 1)
      this.currentEdit.fields = str
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          const params = {
            id: this.currentEdit.id,
            namespace: this.currentEdit.namespace,
            dataId: this.currentEdit.dataId,
            nacosGroup: this.currentEdit.nacosGroup,
            databaseTable: this.currentEdit.databaseTable,
            nacosKey: this.currentEdit.nacosKey,
            fields: this.currentEdit.fields
          }
          edit(params).then(res => {
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
            message: '验证不通过！'
          })
        }
      })
    },
    addSubmit() {
      let str = ''
      this.currentAdd.fields.forEach(v => {
        str = str + v + ','
      })
      str = str.substring(0, str.length - 1)
      this.currentAdd.fields = str
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          const params = this.currentAdd
          save(params).then(res => {
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
            message: '验证不通过！'
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
        deleteById(data).then(res => {
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
    handleRefresh(data) {
      this.$confirm('确定刷新动态配置吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        refresh(data).then(res => {
          if (res.code === 0) {
            this.pageInfo.page = 1
            this.$message({
              type: 'success',
              message: '刷新动态配置成功'
            })
          }
          this.handleSearch()
        }).catch(() => {
          this.handleSearch()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消刷新'
        })
      })
    },
    openDrawer(data) {
      this.currentEdit = JSON.parse(JSON.stringify(data))
      this.currentEdit.fields = this.currentEdit.fields.split(',')
      this.drawerEdit = true
      const params = {
        tableName: this.currentEdit.databaseTable
      }
      getColumnNames(params).then(res => {
        this.nacosKeyOptions = JSON.parse(JSON.stringify(res.data))
      }).finally(() => {})
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

  .el-drawer {

    overflow: auto
  }

</style>

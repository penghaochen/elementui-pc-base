<template>
  <div>
    <el-card shadow="always">
      <el-form ref="searchForm" :model="pageInfo" inline label-width="120px">
        <el-form-item label="验证字段描述:" prop="description">
          <el-input v-model="pageInfo.description" clearable type="text" placeholder="请输入验证字段描述" style="width:300px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd()">新增</el-button>
        </el-form-item>
      </el-form>

      <el-table border :data="data" :loading="loading">
        <el-table-column prop="name" label="字段名" width="150" />
        <el-table-column prop="description" label="字段描述" width="150" />
        <el-table-column prop="type" label="字段类型" width="150" />
        <el-table-column prop="validationFlag" label="是否验证格式" width="150">
          <template slot-scope="scope">
            <el-badge v-if="scope.row.validationFlag==='1'" is-dot type="success" text="校验" />
            <el-badge v-else="" is-dot type="danger" text="不校验" />
            <span v-if="scope.row.validationFlag==='1'">校验</span>
            <span v-else="">不校验</span>
          </template>
        </el-table-column>
        <el-table-column prop="validationRule" label="格式验证规则" width="150" />
        <el-table-column prop="validationPrompt" label="格式验证提示语" width="150" />
        <el-table-column prop="sensitiveFlag" label="是否敏感数据" width="150">
          <template slot-scope="scope">
            <el-badge v-if="scope.row.sensitiveFlag==='1'" is-dot type="success" text="是" />
            <el-badge v-else="" is-dot type="danger" text="否" />
            <span v-if="scope.row.sensitiveFlag==='1'">是</span>
            <span v-else="">否</span>
          </template>
        </el-table-column>
        <el-table-column prop="cacheFlag" label="是否缓存" width="150">
          <template slot-scope="scope">
            <el-badge v-if="scope.row.cacheFlag==='1'" is-dot type="success" text="是" />
            <el-badge v-else="" is-dot type="danger" text="否" />
            <span v-if="scope.row.cacheFlag==='1'">是</span>
            <span v-else="">否</span>
          </template>
        </el-table-column>
        <el-table-column prop="appType" label="应用编号" width="150">
          <template slot-scope="scope">
            <el-badge v-if="scope.row.appType==='1'" is-dot type="success" text="前后端共享" />
            <el-badge v-else="" is-dot type="danger" text="后端" />
            <span v-if="scope.row.appType==='1'">前后端共享</span>
            <span v-else="">后端</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
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
    <el-drawer size="30%" :visible.sync="drawerEdit" title="修改验证标准" :show-close="false">
      <div style="margin-left:20px">
        <template>
          <el-form ref="editForm" :model="currentEdit" label-width="120px" label-position="left" :rules="ruleValidate">
            <el-form-item label="字段名:" prop="name">
              <el-input v-model="currentEdit.name" placeholder="请输入字段名" style="width:220px" />
            </el-form-item>
            <el-form-item label="字段描述:" prop="description">
              <el-input v-model="currentEdit.description" placeholder="请输入字段描述" style="width:220px" />
            </el-form-item>
            <el-form-item label="字段类型" prop="type">
              <el-select v-model="currentEdit.type" style="width:220px" placeholder="请选择">
                <el-option value="byte">byte</el-option>
                <el-option value="short">short</el-option>
                <el-option value="int">int</el-option>
                <el-option value="long">long</el-option>
                <el-option value="float">float</el-option>
                <el-option value="double">double</el-option>
                <el-option value="char">char</el-option>
                <el-option value="String">String</el-option>
                <el-option value="boolean">boolean</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否验证格式:" prop="validationFlag">
              <template>
                <el-radio-group v-model="currentEdit.validationFlag" style="width:220px">
                  <el-radio label="1">校验</el-radio>
                  <el-radio label="2">不校验</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
            <el-form-item label="格式验证规则" prop="validationRule">
              <el-input v-model="currentEdit.validationRule" placeholder="请输入字段的正则表达式" style="width:220px" />
            </el-form-item>
            <el-form-item label="验证提示语" prop="validationPrompt">
              <el-input v-model="currentEdit.validationPrompt" placeholder="请输入格式验证提示语" style="width:220px" />
            </el-form-item>
            <el-form-item label="是否敏感数据:" prop="sensitiveFlag">
              <template>
                <el-radio-group v-model="currentEdit.sensitiveFlag" style="width:220px">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="2">否</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
            <el-form-item label="是否缓存:" prop="cacheFlag">
              <template>
                <el-radio-group v-model="currentEdit.cacheFlag" style="width:220px">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="2">否</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
            <el-form-item label="应用编号:" prop="appType">
              <template>
                <el-radio-group v-model="currentEdit.appType" style="width:220px">
                  <el-radio label="1">前后端共享</el-radio>
                  <el-radio label="2">后端</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
            <el-button type="primary" long style="width:300px;margin-top:30px" @click="editSubmit">提交</el-button>
          </el-form>
        </template>
      </div>
    </el-drawer>
    <el-drawer size="30%" :visible.sync="drawerAdd" title="添加验证标准" :show-close="false">
      <div style="margin-left:20px">
        <template>
          <el-form ref="addForm" :model="currentAdd" label-width="120px" label-position="left" :rules="ruleValidate">
            <el-form-item label="字段名:" prop="name">
              <el-input v-model="currentAdd.name" placeholder="请输入字段名" style="width:220px" />
            </el-form-item>
            <el-form-item label="字段描述:" prop="description">
              <el-input v-model="currentAdd.description" placeholder="请输入字段描述" style="width:220px" />
            </el-form-item>
            <el-form-item label="字段类型" prop="type">
              <el-select v-model="currentAdd.type" style="width:220px" placeholder="请选择">
                <el-option value="byte">byte</el-option>
                <el-option value="short">short</el-option>
                <el-option value="int">int</el-option>
                <el-option value="long">long</el-option>
                <el-option value="float">float</el-option>
                <el-option value="double">double</el-option>
                <el-option value="char">char</el-option>
                <el-option value="String">String</el-option>
                <el-option value="boolean">boolean</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否验证格式:" prop="validationFlag">
              <template>
                <el-radio-group v-model="currentAdd.validationFlag" style="width:220px">
                  <el-radio label="1">校验</el-radio>
                  <el-radio label="2">不校验</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
            <el-form-item label="格式验证规则" prop="validationRule">
              <el-input v-model="currentAdd.validationRule" placeholder="请输入字段的正则表达式" style="width:220px" />
            </el-form-item>
            <el-form-item label="验证提示语" prop="validationPrompt">
              <el-input v-model="currentAdd.validationPrompt" placeholder="请输入格式验证提示语" style="width:220px" />
            </el-form-item>
            <el-form-item label="是否敏感数据:" prop="sensitiveFlag">
              <template>
                <el-radio-group v-model="currentAdd.sensitiveFlag" style="width:220px">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="2">否</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
            <el-form-item label="是否缓存:" prop="cacheFlag">
              <template>
                <el-radio-group v-model="currentAdd.cacheFlag" style="width:220px">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="2">否</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
            <el-form-item label="应用编号:" prop="appType">
              <template>
                <el-radio-group v-model="currentAdd.appType" style="width:220px">
                  <el-radio label="1">前后端共享</el-radio>
                  <el-radio label="2">后端</el-radio>
                </el-radio-group>
              </template>
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
  saveDictionary,
  editDictionary,
  deleteDictionaryById,
  getDictionaryPage
} from '@/api/patternStandard'
export default {
  name: 'PatternStandard',
  data() {
    return {
      drawerEdit: false,
      drawerAdd: false,
      currentEdit: {
        name: '',
        description: '',
        type: '',
        validationFlag: '',
        validationRule: '',
        validationPrompt: '',
        sensitiveFlag: '',
        cacheFlag: '',
        appType: ''
      },
      currentAdd: {
        name: '',
        description: '',
        type: '',
        validationFlag: '',
        validationRule: '',
        validationPrompt: '',
        sensitiveFlag: '',
        cacheFlag: '',
        appType: ''
      },
      loading: false,
      pageInfo: {
        total: 0,
        page: 1,
        limit: 10,
        description: ''
      },
      columns: [{
        title: '字段名',
        key: 'name',
        width: 150
      },
      {
        title: '字段描述',
        key: 'description',
        width: 150
      },
      {
        title: '字段类型',
        key: 'type',
        width: 150
      },
      {
        title: '是否验证格式',
        key: 'validationFlag',
        slot: 'isTestVali',
        width: 150
      },
      {
        title: '格式验证规则',
        key: 'validationRule',
        width: 220
      },
      {
        title: '格式验证提示语',
        key: 'validationPrompt',
        width: 220
      },
      {
        title: '是否敏感数据',
        key: 'sensitiveFlag',
        slot: 'isTestSen',
        width: 150
      },
      // {
      //   title: '是否加密传输',
      //   key: 'encryptionFlag',
      //   slot: 'isTestEnc',
      //   width: 150
      // },
      {
        title: '是否缓存',
        key: 'cacheFlag',
        slot: 'isTestCache',
        width: 150
      },
      {
        title: '应用编号',
        key: 'appType',
        slot: 'isTestApp',
        width: 150
      },
      // {
      //   title: '备注',
      //   key: 'remark',
      //   width: 150
      // },
      {
        title: '操作',
        slot: 'handle',
        fixed: 'right',
        width: 220
      }
      ],
      ruleValidate: {
        name: [{
          required: true,
          message: '字段名不能为空！',
          trigger: 'blur'
        }],
        description: [{
          required: true,
          message: '字段描述不能为空！',
          trigger: 'blur'
        }],
        type: [{
          required: true,
          message: '字段类型不能为空！',
          trigger: 'change'
        }],
        validationFlag: [{
          required: true,
          message: '是否验证格式不能为空！',
          trigger: 'change'
        }],
        validationRule: [{
          required: true,
          message: '格式验证规则不能为空！',
          trigger: 'blur'
        }],
        validationPrompt: [{
          required: true,
          message: '格式验证提示语不能为空！',
          trigger: 'blur'
        }],
        sensitiveFlag: [{
          required: true,
          message: '是否敏感数据不能为空！',
          trigger: 'change'
        }],
        // encryptionFlag: [{
        //   required: true,
        //   message: '是否加密传输不能为空！',
        //   trigger: 'change'
        // }],
        cacheFlag: [{
          required: true,
          message: '是否缓存不能为空！',
          trigger: 'change'
        }],
        appType: [{
          required: true,
          message: '应用编号不能为空！',
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

      getDictionaryPage(this.pageInfo).then(res => {
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
        name: '',
        description: '',
        type: '',
        validationFlag: '',
        validationRule: '',
        validationPrompt: '',
        sensitiveFlag: '',
        cacheFlag: '',
        appType: ''
      }
    },
    editSubmit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.currentEdit))

          // 加密传输暂时取消
          params.encryptionFlag = '1'
          editDictionary(params).then(res => {
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
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          const params = this.currentAdd

          // 加密传输暂时取消
          params.encryptionFlag = '1'
          saveDictionary(params).then(res => {
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
        deleteDictionaryById(data).then(res => {
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
    switchChangeAdd(status) {
      this.currentAdd.fieldOption = status
    },
    switchChangeEdit(status) {
      this.currentEdit.fieldOption = status
    },
    handleResetForm(form) {
      this.$refs[form].resetFields()
      this.handleSearch()
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

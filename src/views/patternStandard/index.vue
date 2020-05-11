<template>
  <div class="dashboard-container">
    <!-- 头部条件查询部分   -->
    <div ref="searchForm">
      <el-row>
        <el-col :span="8" :offset="3">
          <el-form :model="searchModel" label-width="120px">
            <el-form-item label="验证字段名称:">
              <el-input v-model="searchModel.fieldZhName" placeholder="请输入所需验证字段的中文名"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="2" :offset="3">
          <el-button type="primary" @click="init()">查询</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="success" @click="addPattern()">新增验证字段</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 表格数据 -->
    <div style="margin-top:10px">
      <el-row type="flex" justify="center">
        <el-col :span="20">
          <el-table :data="tableData" :header-cell-style="rowClass" :cell-style="cellStyle" border
            :height="tableHeight">
            <el-table-column prop="fieldName" label="字段名" width="120">
            </el-table-column>
            <el-table-column prop="fieldZhName" label="字段中文名" width="120">
            </el-table-column>
            <el-table-column prop="fieldRule" label="字段规则" width="220">
            </el-table-column>
            <el-table-column prop="fieldType" label="字段类型" width="120">
            </el-table-column>
            <el-table-column prop="fieldOption" label="是否校验" width="120">
            </el-table-column>
            <el-table-column prop="fieldPrompt" label="提示语" width="200">
            </el-table-column>
            <el-table-column prop="operation" label="操作">
              <template slot-scope="scope">
                <span class="operationClass" @click="operationModify(scope.row)">修改</span>
                <span class="operationClass" @click="operationDelete(scope.row)">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
    <!-- 分页条部分 -->
    <div ref="toolbar">
      <el-row type="flex" justify="center">
        <el-col :span="20" class="toolbar">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="listQuery.pageNum" :page-sizes="[10, 20, 50, 100]" :page-size="listQuery.pageRow"
            layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
    <!-- 修改弹窗 -->
    <el-dialog title="修改信息" :visible.sync="isEdit" width="40%">
      <el-form :model="editModel" label-width="190px">
        <el-row>
          <el-col :span="10">
            <el-form-item label="字段名:" required>
              <el-input v-model="editModel.fieldName" style="width:250px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="字段中文名:" required>
              <el-input v-model="editModel.fieldZhName" style="width:250px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="字段规则:" required>
              <el-input v-model="editModel.fieldRule" style="width:250px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="字段类型:" required>
              <el-input v-model="editModel.fieldType" style="width:250px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="是否校验:" required>
              <el-select v-model="editModel.fieldOption" style="width:250px">
                <el-option label="是" :value='true'></el-option>
                <el-option label="否" :value='false'></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="提示语:" required>
              <el-input v-model="editModel.fieldPrompt" style="width:250px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isEdit  = false">取 消</el-button>
        <el-button type="primary" @click="edit()">修 改</el-button>
      </span>
    </el-dialog>
    <!-- 新增弹窗 -->
    <el-dialog title="新增验证字段" :visible.sync="isAdd" width="40%">
      <el-form :model="addModel" label-width="170px">
        <el-row>
          <el-col :span="10">
            <el-form-item label="字段名:" required>
              <el-input v-model="addModel.fieldName" style="width:250px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="字段中文名:" required>
              <el-input v-model="addModel.fieldZhName" style="width:250px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="字段规则:" required>
              <el-input v-model="addModel.fieldRule" style="width:250px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="字段类型:" required>
              <el-input v-model="addModel.fieldType" style="width:250px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="是否校验:" required>
              <el-select v-model="addModel.fieldOption" style="width:250px">
                <el-option label="是" :value='true' ></el-option>
                <el-option label="否" :value='false' ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="提示语:" required>
              <el-input v-model="addModel.fieldPrompt" style="width:250px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isAdd  = false">取 消</el-button>
        <el-button type="primary" @click="add()">新 增</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'patternStandard',
    computed: {},
    mounted() {
      //设置表格动态高度
      setTimeout(() => {

        this.tableHeight = document.documentElement.clientHeight - (this.$refs.searchForm.clientHeight + this.$refs
          .toolbar.clientHeight) - 170 + "px"

      }, 0);

    },
    created() {
      // 页面初始化
      //   this.init();
    },
    filters: {

    },
    data() {
      return {
        // 表格高度
        tableHeight: "300px",
        //分页条
        listQuery: {
          pageNum: 1, //页码
          pageRow: 10, //每页条数
        },
        //分页组件--数据总条数
        totalCount: 0,
        // 表格多选项
        multipleSelection: [],
        // 表格数据
        tableData: [{

        }],
        //修改弹窗
        isEdit: false,
        editModel: {},
        //新增窗口
        isAdd: false,
        addModel: {},
        //搜索模块
        searchModel: {
          merchantName: "",
        },
        //企业名称选项
        enterpriseNameOptions: [{
          key: "1",
          name: "阿里",
        }, {
          key: "2",
          name: "腾讯",
        }, {
          key: "3",
          name: "百度",
        }],
        //项目名称选项
        projectNameOptions: [{
          key: "1",
          name: "2019-09期",
        }, {
          key: "2",
          name: "2019-10期",
        }, {
          key: "3",
          name: "2019-11期",
        }],
        //子项目名称
        sonProjectNameOptions: [{
          key: "1",
          name: "拉丁向",
        }, {
          key: "2",
          name: "委内瑞拉向",
        }, {
          key: "3",
          name: "南非向",
        }],
        //交存状态选项
        depositStatusOptions: [{
          key: "1",
          name: "已交存",
        }, {
          key: "2",
          name: "未交存",
        }],


      }

    },
    methods: {
      // 页面初始化查询
      init() {
        let params = {
          fieldZhName: this.searchModel.fieldZhName,
          size: this.listQuery.pageRow,
          current: this.listQuery.pageNum,
        }
        fetchDo('/inner/merchantinfo/queryMerchantInfo', params, 'post').then(response => {
          if (response.data.returnCode == "000000") {
            this.tableData = response.data.data.records
            this.totalCount = response.data.data.total
          } else {
            this.$message.error(response.data.message)
          }

        })

      },
      //确认修改函数
      edit() {
        if (this.editModel.fieldName == "" || this.editModel.fieldName == undefined) {
          this.$message.error("请输入字段名")
          return;
        }
        if (this.editModel.fieldZhName == "" || this.editModel.fieldZhName == undefined) {
          this.$message.error("请输入字段中文名")
          return;
        }
        if (this.editModel.fieldRule == "" || this.editModel.fieldRule == undefined) {
          this.$message.error("请输入字段规则")
          return;
        }
        if (this.editModel.fieldType == "" || this.editModel.fieldType == undefined) {
          this.$message.error("请输入字段类型")
          return;
        }
        if (this.editModel.fieldOption == "" || this.editModel.fieldOption == undefined) {
          this.$message.error("请选择是否校验？")
          return;
        }
        if (this.editModel.fieldPrompt == "" || this.editModel.fieldPrompt == undefined) {
          this.$message.error("请输入提示语")
          return;
        }
        let params = this.editModel
        debugger
        fetchDo('/inner/merchantinfo/updateById', params, 'post').then(response => {
          debugger
          if (response.data.returnCode == "000000") {
            this.$message({
              message: '修改成功',
              type: 'success'
            });
            this.isEdit = false;
            this.init();
          } else {
            this.$message.error(response.data.message)
          }
        })
      },
      //确认新增函数
      add() {
        if (this.addModel.merchantName == "" || this.addModel.merchantName == undefined) {
          debugger
          this.$message.error("请输入企业名称")
          return;
        }
        if (this.addModel.account == "" || this.addModel.account == undefined) {
          this.$message.error("请输入企业账户")
          return;
        }
        if (this.addModel.openBank == "" || this.addModel.openBank == undefined) {
          this.$message.error("请输入开户行")
          return;
        }
        let params = this.addModel
        debugger
        fetchDo('/inner/merchantinfo', params, 'post').then(response => {
          debugger
          if (response.data.returnCode == "000000") {
            this.$message({
              message: '新增成功',
              type: 'success'
            });
            this.isAdd = false;
            this.init();
          } else {
            this.$message.error(response.data.message)
          }
        })
      },
      //新增按钮
      addPattern() {
        this.addModel = {}
        this.isAdd = true;
      },
      /**
       * @description 修改操作
       */
      operationModify(val) {
        this.isEdit = true;
        this.editModel = JSON.parse(JSON.stringify(val))
      },
      /**
       * @description 删除操作
       */
      operationDelete(val) {
        this.$confirm('此操作将删除这条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          debugger
          fetchDo('/inner/merchantinfo/' + val.merchantId, "", 'delete').then(response => {
            if (response.data.returnCode == "000000") {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.init();
            } else {
              this.$message.error(response.data.message)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      /**
       * @description 设置el-table内容居中
       */
      cellStyle({
        row,
        column,
        rowIndex,
        columnIndex
      }) {
        return "text-align:center";
      },
      /**
       * @description 设置el-table表头居中
       */
      rowClass({
        row,
        column,
        rowIndex,
        columnIndex
      }) {
        return "text-align:center";
      },
      /**
       * @description 分页条size设置
       */
      handleSizeChange(val) {
        this.listQuery.pageRow = val;
        this.init();
      },
      /**
       * @description 分页条num设置
       */
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.init();
      },

    },
  }

</script>

<style lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }

    &-text {
      font-size: 30px;
      line-height: 46px;
    }


  }

  /*设置显示隐藏部分内容，按50%显示*/
  .el-tooltip__popper {
    font-size: 14px;
    max-width: 50%
  }

  .toolbar {
    background: #f2f2f2;
    padding-top: 5px;
    height: 50px;
    width: 70%;
    position: fixed;
    bottom: 0;
  }

  .operationClass {
    color: #409EFF;
    cursor: pointer;
    margin-left: 5px;
    margin-right: 5px;
  }

</style>

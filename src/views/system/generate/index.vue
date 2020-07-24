<template>
  <div>
    <el-card shadow="always">
      <el-steps :active="current">
        <el-step title="数据库连接"></el-step>
        <el-step title="生产代码"></el-step>
      </el-steps>
      <el-form style="margin-top: 20px;" ref="form" :model="formItem" :rules="formItemRules" label-width="140px">
        <el-form-item v-show="current===0" label="数据库类型" prop="type">
          <el-select v-model="formItem.type">
            <el-option value="mysql">mysql</el-option>
            <el-option disabled value="oracle">oracle</el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="current===0" label="驱动名称" prop="driverName">
          <el-input v-model="formItem.driverName" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item v-show="current===0" label="连接地址" prop="url">
          <el-input v-model="formItem.url" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item v-show="current===0" label="用户名" prop="username">
          <el-input v-model="formItem.username" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item v-show="current===0" label="密码" prop="password">
          <el-input v-model="formItem.password" type="password" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="10">
            <el-form-item v-show="current===1" label="模块名称" prop="moduleName">
              <el-input v-model="formItem.moduleName" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item v-show="current===1" label="顶级包名" prop="parentPackage">
              <el-input v-model="formItem.parentPackage" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item v-show="current===1" label="作者" prop="author">
              <el-input v-model="formItem.author" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item v-show="current===1" label="需要生成的表" prop="includeTables">
              <el-transfer :data="selectTables" :titles="['选择表', '已选择表']" v-model="formItem.includeTables"
                @change="handleTransferChange" filterable></el-transfer>
            </el-form-item>
            <el-form-item v-show="current===1" label="忽略表前缀" prop="tablePrefix">
              <el-select v-model="formItem.tablePrefix" multiple style="width:260px">
                <el-option v-for="(item,index) in formItem.tablePrefix" :value="item" :key="index">{{ item }}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-top: 20px;text-align: center">
        <el-button v-if="current > 0" @click="up">上一步</el-button>&nbsp;
        <el-button v-if="current < 1" type="primary" @click="next">下一步</el-button>&nbsp;
        <el-button v-if="current===1" type="success" @click="handleSubmit" :loading="saving">确定生成</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
  import Generate from '@/api/generate'

  export default {
    name: 'Generate',
    data() {
      return {
        saving: false,
        current: 0,
        selectTables: [],
        formItemRules: {
          type: [{
            required: true,
            message: '数据库类型不能为空',
            trigger: 'blur'
          }],
          driverName: [{
            required: true,
            message: '驱动名称不能为空',
            trigger: 'blur'
          }],
          url: [{
            required: true,
            message: '数据库连接不能为空',
            trigger: 'blur'
          }],
          username: [{
            required: true,
            message: '用户名不能为空',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          }],
          author: [{
            required: true,
            message: '作者不能为空',
            trigger: 'blur'
          }],
          parentPackage: [{
            required: true,
            message: '顶级包名不能为空',
            trigger: 'blur'
          }],
          moduleName: [{
            required: true,
            message: '模块名不能为空',
            trigger: 'blur'
          }],
          includeTables: [{
            required: true,
            message: '生成表名不能为空',
            trigger: 'blur',
            type: 'array',
            min: 1
          }],
          tablePrefix: [{
            required: true,
            message: '忽略表名前缀不能为空',
            trigger: 'blur',
            type: 'array',
            min: 1
          }]
        },
        formItem: {
          type: 'mysql',
          driverName: 'com.mysql.cj.jdbc.Driver',
          url: 'jdbc:mysql://localhost:3306/open-platform?useSSL=false&useUnicode=true&characterEncoding=utf-8&serverTimezone=UTC',
          username: 'root',
          password: 'root',
          author: 'admin',
          parentPackage: 'com.opencloud',
          moduleName: 'base',
          includeTables: [],
          tablePrefix: []
        },
      }
    },
    methods: {
      up() {
        if (this.current == 0) {
          this.current = 0;
        } else {
          this.current -= 1;
        }
      },
      next() {
        if (this.current == 1) {
          this.current = 0;
        } else {
          this.current += 1;
        }
      },
      handleSubmit() {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            this.saving = true
            const data = Object.assign({}, this.formItem)
            Generate.execute(data).then(res => {
              if (res.code === 0) {
                let result = res.data
                let href = Generate.downloadPath + '?filePath=' + result.filePath
                this.$confirm('代码生成成功! 是否下载？', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  window.open(href, '_blank');
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消'
                  });
                  
                });
              }
            }).finally(() => {
              this.saving = false
            })
          }
        })
      },
      transferRender(h, option) {
        
        let ss=option.label
        return <span title={ss}>{ option.label }</span>
      },
      handleTransferChange(newTargetKeys, direction, moveKeys) {
        let tablePrefix = []
        newTargetKeys.map(item => {
          let prefix = item.split("_")[0] + '_'
          if (!tablePrefix.includes(prefix)) {
            tablePrefix.push(prefix)
          }
        })
        this.formItem.tablePrefix = tablePrefix
        this.formItem.includeTables = newTargetKeys
      }
    },
    mounted: function () {},
    watch: {
      'current'(val) {
        let that = this
        if (val === 1) {
          Generate.tables(this.formItem).then(res => {
            if (res.code === 0) {
              let items = []
              res.data.map(item => {
                items.push({
                  key: item.name,
                  label: `${item.name} - ${item.comment}`,
                  disabled: false
                })
              })
              that.selectTables = items
            }
          })
        }
      }
    },
  }

</script>

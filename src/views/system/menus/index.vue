<template>
  <div>
    <el-row :gutter="8">
      <el-col :xs="8" :sm="8" :md="8" :lg="6">
        <el-card shadow="always">
          <tree-table
            style="max-height:700px;overflow: auto"
            expand-key="menuName"
            :expand-type="false"
            :is-fold="false"
            :tree-type="true"
            :selectable="false"
            :columns="columns"
            :data="data"
@radio-click="rowClick"
          >
            <template slot="status" slot-scope="scope">
              <el-badge v-if="scope.row.status===1" is-dot type="success" />
              <el-badge v-else="" is-dot type="danger" />
              <i :class="scope.row.icon" style="font-size:16px" />
              <!-- <i class="el-icon-menu" style="font-size:16px"></i> -->
            </template>
          </tree-table>
        </el-card>
      </el-col>
      <el-col :xs="16" :sm="16" :md="16" :lg="10">
        <el-card shadow="always">
          <div class="search-con search-con-top" style="margin-bottom:20px">
            <el-button-group>
              <el-button
                size="small"
                type="primary"
                :disabled="hasAuthority('systemMenuEdit')?false:true"
                @click="setEnabled(true)"
              >
                添加</el-button>
              <el-button
                size="small"
                type="primary"
                :disabled="formItem.menuId && hasAuthority('systemMenuEdit')?false:true"
                @click="confirmModal = true"
              >删除
              </el-button>
            </el-button-group>
            <el-dialog title="提示" :visible.sync="confirmModal" width="30%">
              <span>确定删除,菜单资源【{{ formItem.menuName }}】吗?{{ formItem.children && formItem.children.length > 0 ?
                '存在子菜单,将一起删除.是否继续?' : '' }}</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="confirmModal = false">取 消</el-button>
                <el-button type="primary" @click="confirmModal = false;handleRemove()">确 定</el-button>
              </span>
            </el-dialog>
          </div>
          <el-form ref="menuForm" :model="formItem" :rules="formItemRules" label-width="80px">
            <el-form-item label="上级菜单" prop="parentId">
              <treeselect
                v-model="formItem.parentId"
                :options="selectTreeData"
                :default-expand-level="1"
                :normalizer="treeSelectNormalizer"
              />
            </el-form-item>
            <el-form-item label="菜单标识" prop="menuCode">
              <el-input v-model="formItem.menuCode" placeholder="请输入内容" clearable />
            </el-form-item>
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="formItem.menuName" placeholder="请输入内容" clearable />
            </el-form-item>
            <el-form-item label="页面地址" prop="path">
              <el-input v-model="formItem.path" placeholder="请输入内容" clearable style="font-size:10px">
                <el-select slot="prepend" v-model="formItem.scheme" style="width: 80px">
                  <el-option label="/" value="/" />
                  <el-option label="http://" value="http://" />
                  <el-option label="https://" value="https://" />
                </el-select>
                <el-select slot="append" v-model="formItem.target" style="width: 100px">
                  <el-option label="窗口内打开" value="_self" />
                  <el-option :disabled="formItem.scheme==='/'" label="新窗口打开" value="_blank" />
                </el-select>
              </el-input>
              <span v-if="formItem.scheme === '/'">前端组件：/view/{{ formItem.path }}.vue</span>
              <span v-else="">跳转地址：{{ formItem.scheme }}{{ formItem.path }}</span>
            </el-form-item>
            <el-form-item label="图标" prop="icon">
              <el-input v-model="formItem.icon" placeholder="请输入内容" clearable>
                <i slot="prepend" :class="formItem.icon" style="font-size:16px" />
                <!-- <i class="el-icon-menu" style="font-size:16px" slot="prepend"></i> -->
                <el-popover slot="append" placement="bottom" width="500" trigger="click">
                  <el-button slot="reference" icon="el-icon-search" />
                  <div>
                    <ul class="icons">
                      <li v-for="(item,index) in selectIcons" :key="index" class="icons-item" :title="item" @click="onIconClick(item)">
                        <i :class="item" style="font-size:16px" />
                        <p>{{ item }}1111</p>
                      </li>
                    </ul>
                  </div>
                </el-popover>
              </el-input>
            </el-form-item>
            <el-form-item label="优先级" prop="priority">
              <el-input v-model="formItem.priority" clearable />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="formItem.status" size="small">
                <el-radio-button label="0">禁用</el-radio-button>
                <el-radio-button label="1">启用</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="描述" prop="menuDesc">
              <el-input v-model="formItem.menuDesc" placeholder="请输入内容" clearable type="textarea" />
            </el-form-item>
            <el-button-group>
              <el-button size="small" type="primary" :loading="saving" @click="handleSubmit">保存</el-button>
              <el-button size="small" type="default" style="margin-left: 8px" @click="setEnabled(true)">重置</el-button>
            </el-button-group>
          </el-form>
        </el-card>
      </el-col>
      <el-col :xs="16" :sm="16" :md="16" :lg="8">
        <el-card shadow="always">
          <menu-action :value="formItem" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  listConvertTree,
  updateTreeNode
} from '@/utils/util'
import {
  getMenus,
  updateMenu,
  addMenu,
  removeMenu
} from '@/api/menu'
import MenuAction from './menu-action.vue'
import icons from './icons'

export default {
  name: 'SystemMenu',
  components: {
    MenuAction
  },
  data() {
    const validateEn = (rule, value, callback) => {
      const reg = /^[_a-zA-Z0-9]+$/
      if (value === '') {
        callback(new Error('菜单标识不能为空'))
      } else if (value !== '' && !reg.test(value)) {
        callback(new Error('只允许字母、数字、下划线'))
      } else {
        callback()
      }
    }
    return {
      confirmModal: false,
      saving: false,
      visible: false,
      selectIcons: icons,
      selectTreeData: [{
        menuId: 0,
        menuName: '无'
      }],
      formItemRules: {
        parentId: [{
          required: true,
          message: '上级菜单',
          trigger: 'blur'
        }],
        menuCode: [{
          required: true,
          validator: validateEn,
          trigger: 'blur'
        }],
        menuName: [{
          required: true,
          message: '菜单名称不能为空',
          trigger: 'blur'
        }]
      },
      formItem: {
        menuId: '',
        menuCode: '',
        menuName: '',
        icon: 'md-document',
        path: '',
        scheme: '/',
        target: '_self',
        status: 1,
        parentId: '0',
        priority: 0,
        menuDesc: ''
      },
      columns: [{
        title: '菜单名称',
        key: 'menuName',
        minWidth: '200px'
      },
      {
        title: '状态',
        key: 'status',
        type: 'template',
        minWidth: '100px',
        template: 'status'
      }
      ],
      data: []
    }
  },
  mounted: function() {
    this.handleSearch()
  },
  methods: {
    treeSelectNormalizer(node) {
      return {
        id: node.menuId,
        label: node.menuName,
        children: node.children
      }
    },
    setSelectTree(data) {
      this.selectTreeData = data
    },
    setEnabled(enabled) {
      if (enabled) {
        this.handleReset()
      }
    },
    rowClick(data) {
      this.handleReset()
      if (data) {
        this.formItem = Object.assign({}, data.row)
      }
      this.formItem.status = this.formItem.status + ''
    },
    handleReset() {
      const newData = {
        menuId: '',
        menuCode: '',
        menuName: '',
        icon: 'md-document',
        path: '',
        scheme: '/',
        target: '_self',
        status: '1',
        parentId: '0',
        priority: 0,
        menuDesc: ''
      }
      this.formItem = newData
      this.$refs['menuForm'].resetFields()
      this.saving = false
    },
    handleSubmit() {
      this.$refs['menuForm'].validate((valid) => {
        if (valid) {
          this.saving = true
          if (this.formItem.menuId) {
            updateMenu(this.formItem).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '保存成功'
                })
              }
              this.handleSearch()
            }).finally(() => {
              this.saving = false
            })
          } else {
            addMenu(this.formItem).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '保存成功'
                })
              }
              this.handleSearch()
            }).finally(() => {
              this.saving = false
            })
          }
        }
      })
    },
    handleRemove() {
      removeMenu(this.formItem.menuId).then(res => {
        this.handleReset()
        this.handleSearch()
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        }
      })
    },
    onIconClick(item) {
      this.formItem.icon = item
    },
    handleSearch() {
      getMenus().then(res => {
        const opt = {
          primaryKey: 'menuId',
          parentKey: 'parentId',
          startPid: '0'
        }
        this.data = listConvertTree(res.data, opt)
        this.setSelectTree(this.data)
      })
    }
  }
}

</script>
<style>
  .icons {
    overflow: auto;
    zoom: 1;
    height: 300px;
  }

  .icons-item {
    float: left;
    margin: 6px;
    width: 60px;
    text-align: center;
    list-style: none;
    cursor: pointer;
    color: #5c6b77;
    transition: all .2s ease;
    position: relative;
  }

  .icons-item p {
    word-break: break-all;
    overflow: hidden;
  }

</style>

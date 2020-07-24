/**
 * @description 入口文件
 * @author digua
 * @version 0.1.0
 */
import Vue from 'vue'// vue核心包
import '@babel/polyfill'// 兼容旧浏览器

import 'normalize.css/normalize.css' // 保持浏览器的一些默认样式

import '@/styles/index.scss' // 公共样式

import App from './App' // 入口页面
import store from './store' // 缓存数据
import router from './router/router.config' // 路由配置

import config from '@/settings/defaultSetting'

import i18n from './i18n/'// 国际化文件配置
import mixin from '@/mixin/routerMixin' // 混入公共处理方法
// import config from '@/settings/defaultSetting' // 添加公共配置文件
import '@/utils/validate'// 验证规则
import '@/utils/prototype' // 原型方法

// import '@/icons' // 图标
import '@/permission' // 权限控制

import basicContainer from './components/BasicContainer/main' // 主界面容器模板

Vue.component('basicContainer', basicContainer)// 注册全局容器

import ElementUI from 'element-ui'// elementui组件库
import 'element-ui/lib/theme-chalk/index.css'

import TreeTable from 'tree-table-vue'// 树形组件
Vue.component(TreeTable.name, TreeTable)

import '@riophae/vue-treeselect/dist/vue-treeselect.css'// 树形选择框组件
import Treeselect from '@riophae/vue-treeselect'
Vue.component('treeselect', Treeselect)

Vue.use(ElementUI)
Vue.mixin(mixin)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
// 模拟交易数据
import {
  mockXHR
} from '../mock'

if (process.env.NODE_ENV === 'development') {
// 使用mock数据 放开注释
  mockXHR()
}

// 是否启动生产信息提示
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config

// vue实例化

const opt = {
  router,
  store,
  render: h => h(App)
}
if (config.useI18n) {
  opt.i18n = i18n
}
new Vue(opt).$mount('#app')

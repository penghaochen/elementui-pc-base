/**
* @fileOverview 路由配置文件
* @author digua
* @version 0.1.0
*/

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* 布局模板 */
import Layout from '@/layout'


/**
 *
 * @description 所有页面的路由表
 * @param path url拦截地址
 * @param name 路由别名
 * @param component 加载的碎片页地址 例子：import('@/views/login/index')
 * @param redirect 无该路由将重定向的地址
 * @param children 是否有子路由，子路由属性与父路由一致
 * @param meta 路由带参，通过this.$route.meta获取。title：顶部导航条上的标题 icon：导航条上标题的图片（目前无）
 *
 * @example
 * 例子如下:
 *  {
    path: '/login',
    component: () => import('@/views/login/index')
  },
 *
 */

export const constantRoutes = [
  // 登录
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  // 主页
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '后管系统首页', icon: 'dashboard' }
    }]
  },
    // 错误页面
  {
    path: '/404',
    component: () => import('@/views/404'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
    // 无路由统一跳转页面
  { path: '*', redirect: '/404', hidden: true }
]

// 路由实例化
const createRouter = () => new Router({
  // mode: 'history', // 路由模式 history or hash默认hash
  scrollBehavior: () => ({ y: 0 }),//路由跳转到指定位置
  routes: constantRoutes
})

const router = createRouter()

// 退出登录时重置路由
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

/* 布局模板 */
import Layout from '@/layout'
export default [
  // 菜单页
  {
    path: '/lobby',
    component: Layout,
    name: 'Lobby',
    redirect: '/lobby/lobby',
    children: [
      {
        path: 'lobby',
        name: 'lobby',
        component: () => import('@/views/dashboard/index'),
        meta: {
          title: '欢迎',
          icon: 'dashboard'
        },
      },
    ],
    meta: {
      title: '首页欢迎',
      icon: 'dashboard'
    },
  },
  {
    path: '/sys',
    component: Layout,
    name: 'Sys',
    redirect: '/sys/patternStandard',
    meta: {
      title: '工具组件',
      icon: 'dashboard'
    },
    children: [
    {
      path: 'patternStandard',
      name: 'PatternStandard',
      component: () => import('@/views/patternStandard/index'),
      meta: {
        title: '验证标准',
        icon: 'dashboard'
      },
    },
    {
      path: 'empty',
      name: 'Empty',
      component: () => import('@/views/empty/index'),
      meta: {
        title: '测试用具',
        icon: 'dashboard'
      },
    },
  ]
  },
  // // 菜单测试页
  // {
  //   path: '/lobby1',
  //   name: 'Lobby1',
  //   components: {
  //     default: () => import('@/views/home/lobby1')
  //   },
  //   meta: {
  //     isdisableback: 'true',
  //     keepAlive: true
  //   }
  // }
]

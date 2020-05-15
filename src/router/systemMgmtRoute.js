/* 系统管理 */
import Layout from '@/layout'
export default [
  {
    path: '/systemMgmt',
    component: Layout,
    name: 'SystemMgmt',
    redirect: '/systemMgmt/app',
    meta: {
      title: '系统管理',
      icon: 'dashboard'
    },
    children: [
    {
      path: 'app/index',
      name: 'App',
      component: () => import('@/views/system/app/index'),
      meta: {
        title: '应用管理',
        icon: 'dashboard'
      },
    },
    {
        path: 'user/index',
        name: 'User',
        component: () => import('@/views/system/user/index'),
        meta: {
          title: '用户管理',
          icon: 'dashboard'
        },
      },
      {
        path: 'developer/index',
        name: 'Developer',
        component: () => import('@/views/system/developer/index'),
        meta: {
          title: '开发者管理',
          icon: 'dashboard'
        },
      },
      {
        path: 'menus/index',
        name: 'Menus',
        component: () => import('@/views/system/menus/index'),
        meta: {
          title: '功能菜单',
          icon: 'dashboard'
        },
      },
      {
        path: 'role/index',
        name: 'Role',
        component: () => import('@/views/system/role/index'),
        meta: {
          title: '角色管理',
          icon: 'dashboard'
        },
      },
  ]
  },
]

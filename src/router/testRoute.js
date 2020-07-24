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
        }
      },
      {
        path: 'user/index',
        name: 'User',
        component: () => import('@/views/system/user/index'),
        meta: {
          title: '用户管理',
          icon: 'dashboard'
        }
      },
      {
        path: 'developer/index',
        name: 'Developer',
        component: () => import('@/views/system/developer/index'),
        meta: {
          title: '开发者管理',
          icon: 'dashboard'
        }
      },
      {
        path: 'generate/index',
        name: 'Generate',
        component: () => import('@/views/system/generate/index'),
        meta: {
          title: '在线代码生成',
          icon: 'dashboard'
        }
      },
      {
        path: 'menus/index',
        name: 'Menus',
        component: () => import('@/views/system/menus/index'),
        meta: {
          title: '功能菜单',
          icon: 'dashboard'
        }
      },
      {
        path: 'role/index',
        name: 'Role',
        component: () => import('@/views/system/role/index'),
        meta: {
          title: '角色管理',
          icon: 'dashboard'
        }
      }
    ]
  },
  {
    path: '/gatewayMgmt',
    component: Layout,
    name: 'GatewayMgmt',
    redirect: '/gatewayMgmt/api',
    meta: {
      title: 'API网关',
      icon: 'dashboard'
    },
    children: [
      {
        path: 'api/index',
        name: 'Api',
        component: () => import('@/views/gateway/api/index'),
        meta: {
          title: 'API列表',
          icon: 'dashboard'
        }
      },
      {
        path: 'logs/index',
        name: 'Logs',
        component: () => import('@/views/gateway/logs/index'),
        meta: {
          title: '访问日志',
          icon: 'dashboard'
        }
      },
      {
        path: 'ip-limit/index',
        name: 'Ip-limit',
        component: () => import('@/views/gateway/ip-limit/index'),
        meta: {
          title: '访问控制',
          icon: 'dashboard'
        }
      },
      {
        path: 'rate-limit/index',
        name: 'Rate-limit',
        component: () => import('@/views/gateway/rate-limit/index'),
        meta: {
          title: '流量控制',
          icon: 'dashboard'
        }
      },
      {
        path: 'route/index',
        name: 'Route',
        component: () => import('@/views/gateway/route/index'),
        meta: {
          title: '网关路由',
          icon: 'dashboard'
        }
      }
    ]
  },
  {
    path: '/transConfig',
    component: Layout,
    name: 'TransConfig',
    redirect: '/transConfig/dictionaryConfig',
    meta: {
      title: '交易配置',
      icon: 'dashboard'
    },
    children: [
      {
        path: 'dictionaryConfig/index',
        name: 'DictionaryConfig',
        component: () => import('@/views/transConfig/dictionaryConfig/index'),
        meta: {
          title: '响应信息',
          icon: 'dashboard'
        }
      },
      {
        path: 'patternStandard/index',
        name: 'PatternStandard',
        component: () => import('@/views/transConfig/patternStandard/index'),
        meta: {
          title: '数据字典',
          icon: 'dashboard'
        }
      }
    ]
  },
  {
    path: '/task',
    component: Layout,
    name: 'Task',
    redirect: '/task/job',
    meta: {
      title: '任务调度',
      icon: 'dashboard'
    },
    children: [
      {
        path: 'job/index',
        name: 'Job',
        component: () => import('@/views/task/job/index'),
        meta: {
          title: '定时任务',
          icon: 'dashboard'
        }
      },
      {
        path: 'logs/index',
        name: 'Logs',
        component: () => import('@/views/task/logs/index'),
        meta: {
          title: '调度日志',
          icon: 'dashboard'
        }
      }
    ]
  },
  {
    path: '/msg',
    component: Layout,
    name: 'Msg',
    redirect: '/msg/webhook',
    meta: {
      title: '消息管理',
      icon: 'dashboard'
    },
    children: [
      {
        path: 'webhook/index',
        name: 'Webhook',
        component: () => import('@/views/msg/webhook/index'),
        meta: {
          title: '异步通知日志',
          icon: 'dashboard'
        }
      },
      {
        path: 'webhook/index1',
        name: 'Webhook1',
        component: () => import('@/views/msg/webhook/index1'),
        meta: {
          title: '批量监控日志',
          icon: 'dashboard'
        }
      }
    ]
  }
]

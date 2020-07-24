const silderMenus = [
  {
    path: '/systemMgmt',
    meta: {
      title: '系统管理',
      icon: 'example'
    },
    children: [
      {
        path: 'app/index',
        meta: {
          title: '应用管理',
          icon: 'table'
        }
      }, {
        path: 'user/index',
        meta: {
          title: '用户管理',
          icon: 'table'
        }
      }, {
        path: 'developer/index',
        meta: {
          title: '开发者管理',
          icon: 'table'
        }
      }, {
        path: 'generate/index',
        meta: {
          title: '在线代码生成',
          icon: 'table'
        }
      }, {
        path: 'menus/index',
        meta: {
          title: '功能菜单',
          icon: 'table'
        }
      }, {
        path: 'role/index',
        meta: {
          title: '角色管理',
          icon: 'table'
        }
      }

    ]
  },
  {
    path: '/gatewayMgmt',
    meta: {
      title: 'API网关',
      icon: 'example'
    },
    children: [
      {
        path: 'api/index',
        meta: {
          title: 'API列表',
          icon: 'table'
        }
      }, {
        path: 'logs/index',
        meta: {
          title: '访问日志',
          icon: 'table'
        }
      }, {
        path: 'ip-limit/index',
        meta: {
          title: '访问控制',
          icon: 'table'
        }
      }, {
        path: 'rate-limit/index',
        meta: {
          title: '流量控制',
          icon: 'table'
        }
      }, {
        path: 'route/index',
        meta: {
          title: '网关路由',
          icon: 'table'
        }
      }
    ]
  },
  {
    path: '/transConfig',
    meta: {
      title: '交易配置',
      icon: 'example'
    },
    children: [
      {
        path: 'dictionaryConfig/index',
        meta: {
          title: '响应信息',
          icon: 'table'
        }
      },
      {
        path: 'patternStandard/index',
        meta: {
          title: '数据字典',
          icon: 'table'
        }
      }
    ]
  },
  {
    path: '/task',
    meta: {
      title: '任务调度',
      icon: 'example'
    },
    children: [
      {
        path: 'job/index',
        meta: {
          title: '定时任务',
          icon: 'table'
        }
      },
      {
        path: 'logs/index',
        meta: {
          title: '调度日志',
          icon: 'table'
        }
      }
    ]
  },
  {
    path: '/msg',
    meta: {
      title: '消息管理',
      icon: 'example'
    },
    children: [
      {
        path: 'webhook/index',
        meta: {
          title: '异步通知日志',
          icon: 'table'
        }
      },
      {
        path: 'webhook/index1',
        meta: {
          title: '批量监控日志',
          icon: 'table'
        }
      }
    ]
  }

]

const navbarMenus = [{
  path: '/',
  title: '回到首页'
}, {
  path: '',
  title: '相关文档'
}]
// 左侧菜单数据
export function getSilderMenus() {
  return silderMenus
}
// 顶部右侧菜单数据
export function getNavbarMenus() {
  return navbarMenus
}

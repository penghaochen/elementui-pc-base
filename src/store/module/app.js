import {
  getHomeRoute
} from '@/utils//util'

import routers from '@/router/routers'
import config from '@/settings/defaultSetting'
// import routes from '../../router/routers'

import Cookies from 'js-cookie'

const { homeName } = config

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true, // 左侧菜单栏显示状态 true:显示 false:不显示
    withoutAnimation: false // 展开收起菜单是否有动态效果 true:无，false:有
  },
  device: 'desktop', // 获取设备标识 pc：desktop 手机：mobile

  breadCrumbList: [],
  homeRoute: getHomeRoute(routers, homeName)
}
// const getters = {
//   menuList: (state, getters, rootState) => getMenuByRouter(routers, rootState.user.access)
// }
const mutations = {
  // 开启或关闭左侧菜单
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.app.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.app.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  // 关闭左侧菜单
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.app.sidebar.opened = false
    state.app.sidebar.withoutAnimation = withoutAnimation
  },
  // 获取设备标识 pc：desktop 手机：mobile
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  }
}
const actions = {
  // 开启或关闭左侧菜单
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  // 关闭左侧菜单
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  // 获取设备标识
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  }
}

export default {
  namespaced: true,
  state,
  // getters,
  mutations,
  actions
}

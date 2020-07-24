
import Vue from 'vue'
import store from '@/store' // 缓存数据
/**
 * 按钮全新控制
 *authorities 多个用,号隔开
 * v-show="hasAuthority('systemUserCreate')"
 * v-show="hasAuthority('systemUserCreate,systemUserUpdate,')"
 * @param authorities
 * @returns {boolean}
 */
Vue.prototype.hasAuthority = function(authorities) {
  if (!authorities) {
    return false
  }
  return authorities.split(',').some(item => {
    return store.state.user.access.includes('ACTION_' + item)
  })
}

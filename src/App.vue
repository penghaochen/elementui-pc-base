<template>
  <div id="app">
    <!-- 路由 -->
    <router-view />
  </div>
</template>

<script>
import { getAllApis } from '@/api/apiApi'
export default {
  name: 'App',
  data() {
    return {

    }
  },
  created() {
    // 初始化获取接口是否加密列表，存入session中，在request中统一处理是否加密
    getAllApis().then(res => {
      if (res.code === 0) {
        sessionStorage.removeItem('apiList')
        window.sessionStorage.setItem('apiList', JSON.stringify(res.data))
      }
    })
  }
}
</script>

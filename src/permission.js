/**
 * @description 权限控制配置
 * @author digua
 * @version 0.1.0
 */
import router from './router/router.config'
import NProgress from 'nprogress' // 顶部进度条
import 'nprogress/nprogress.css' // 顶部进度条样式
import settings from '@/settings/defaultSetting' // 获取公共参数
NProgress.configure({ showSpinner: false }) // 进度条配置

// 路由拦截器
router.beforeEach(async(to, from, next) => {
  // 进度条开启
  NProgress.start()
  // 设置标题
  document.title = to.meta.title || settings.title
  // do something。。。
  next()
})

router.afterEach(() => {
  // 进度条结束
  NProgress.done()
})

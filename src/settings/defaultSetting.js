module.exports = {
  /**
   * token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,
  /**
   *  是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  useI18n: false, // 是否使用国际化配置 true：使用，false:不使用
  locale: 'zh', // zh:中文，en:英文
  /**
   * 项目部署基础
   * 默认情况下，我们假设你的应用将被部署在域的根目录下,
   * 例如：https://www.my-app.com/
   * 默认：'/'
   * 如果您的应用程序部署在子路径中，则需要在这指定子路径
   * 例如：https://www.foobar.com/my-app/
   * 需要将它改为'/my-app/'
   */
  publicPath: {
    //  本地环境发布目录
    dev: '/',
    //  生产环境发布目录
    pro: '/'
  },
  /**
   *  api请求基础配置
   */
  apiUrl: {
    //  本地环境接口请求地址
    dev: '/pmobile',
    //  生产环境接口请求地址
    pro: '/pmobile',
    headers: {
      'BL': '1'
    }, // 请求头信息
    timeout: 20000// 请求超时时间
  },
  /**
   * 默认打开的首页的路由name值，默认为home
   */
  homeName: 'home',

  title: '后台管理系统',
  /**
   * @type {boolean} true | false
   * @description 是否需要标签导航
   */
  tagsView: true,
  /**
   * @type {boolean} true | false
   * @description 是否需要固定顶部标题
   */
  fixedHeader: false,

  /**
   * @type {boolean} true | false
   * @description 是否显示左侧菜单logo标题
   */
  sidebarLogo: true
}

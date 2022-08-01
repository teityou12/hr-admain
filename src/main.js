import Vue from 'vue'
// 第三方 css库  让不同的标签在不同的浏览器中样式统一
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import Print from 'vue-print-nb'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 国际化 语言包
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
// 全局公共样式
import '@/styles/index.scss' // global css
import i18n from '@/lang'

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control  权限控制
import mixins from './mixin'
Vue.mixin(mixins)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// // set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(Print)
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})
// use 会自动执行install里面的代码
import components from '@/components'
Vue.use(components)

Vue.config.productionTip = false // 控制台有一个生产的提示
// 批量导入自定义指令 作用可以简化指令的写法
// 可以把所有的按需导出的全部导入到一个对象中 对象的名字叫direction
import * as obj from '@/directives' // 得到一个对象
// Object.keys(obj)  // ['imgerror','abc']
Object.keys(obj).forEach(item => {
  Vue.directive(item, obj[item])
})

import * as filters from '@/filters'
Object.keys(filters).forEach(item => {
  Vue.filter(item, filters[item])
})
// 初始化vue 挂载 路由 vuex
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})

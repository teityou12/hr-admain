import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'
// vip 白名单 默认所有人是坏人 这几个是好人
const whiteList = ['/login', '/404']
// to去哪里 from 来自那里 next 放行
router.beforeEach(async (to, from, next) => {
  // 开启进度条效果
  NProgress.start()
  // 控制权限
  const token = store.state.user.token
  if (token) {
    if (to.path === '/login') {
      NProgress.done()
      next('/')
    } else {
      if (!store.state.user.userInfo.id) {
        // 当用户手里面有token并且访问的不是登录页面，那就应该请求个人资料
        // 这块ajax只会发送一次优化一下
        const userInfo = await store.dispatch('user/getInfo')
        console.log(userInfo.roles.menus)
        const newRoutes = await store.dispatch('permission/filter', userInfo.roles.menus)
        router.addRoutes([...newRoutes, { path: '*', redirect: '/404', hidden: true }])
        next(to.path)
      }

      next() // 放行
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('login')
    }
  }
  next()
})
// 后置路由守卫
router.afterEach(() => {
  // 结束进度条效果
  NProgress.done()
})

// 因为只有vuex中的数据才能在组件中使用
import { asyncRoutes, constantRoutes } from '@/router'
const state = {
  routes: []
}
// 只能写同步
const mutations = {
  setRoutes (state, payload) {
    state.routes = payload
  }
}

// actions 能写同步也可以写异步
const actions = {
  filter (context, menus) {
    const newRoutes = asyncRoutes.filter(item => menus.includes(item.meta.name))
    context.commit('setRoutes', [...constantRoutes, ...newRoutes])
    return newRoutes
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions

}

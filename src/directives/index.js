
// 自定义指令 我们想封装一个dom操作的时候 共页面的一堆组件去使用
export const imgerror = {
  inserted (el, binding) {
    el.onerror = function () {
      this.src = 'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
    }
  }

}

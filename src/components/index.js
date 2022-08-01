import PageTool from './PageTool/'
import UploadImage from './UploadImage/'
import FullScreen from './FullScreen'
import TagsView from './TagsView'
export default {
  // install安装
  install (Vue) {
    Vue.component('PageTool', PageTool)
    Vue.component('UploadImage', UploadImage)
    Vue.component('FullScreen', FullScreen)
    Vue.component('TagsView', TagsView)
  }
}


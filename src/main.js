import Vue from 'vue'
import 'normalize.css/normalize.css'// A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//日期格式化函数
import moment from 'vue-moment'
//视频播放插件
import VideoPlayer from 'vue-video-player'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')

import '@/styles/index.scss' // global css
import '@/styles/global.css' // global css
import common from '@/common/common.js' //引入公共方法
import App from './App'
import router from './router'
import store from './store'

import '@/directives'//element dialog 拖拽
import '@/icons' // icon
import '@/permission' // permission control


Vue.use(ElementUI)
Vue.use(moment)
Vue.use(VideoPlayer)
Vue.config.productionTip = false
Vue.use(common)
// Vue.prototype.BASE_IMG_URL = process.env.BASE_IMG_URL
Vue.prototype.APPKEY = '26102723';

// 请求文件内容及创建实例
async function main() {
  await Vue.prototype.getServerConfig();
  new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
  });
}
// 方法初始执行
main();
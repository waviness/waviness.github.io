import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { cancelAxios } from '@/utils/requset'
import ElementUI from 'element-ui'
// import GoEasy from 'goeasy'
// import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/element-variables.scss'
import * as directives from './directives'
import Antd from './plugins/Ant'
import '@/assets/css/theme.less'

Vue.component('loadmore', directives)
declare module 'vue/types/vue' {
  interface Vue {
    $cancelAxios: any; // 挂载的 vue 全局变量
  }
}
Vue.prototype.$cancelAxios = cancelAxios
Vue.config.productionTip = false
Vue.use(ElementUI)

Vue.use(Antd)
// Vue.prototype.goeasy = GoEasy.getInstance({
//   host: 'hangzhou.goeasy.io',
//   appkey: 'BC-d02d9a6e03fa44708edaa9cbd8cb0dac'
// })
new Vue({
  router,
  store,
  data() {
    return {
      domainUrl: 'https://intmedic-wx.oss-cn-hangzhou.aliyuncs.com/'
    }
  },
  render: h => h(App)
}).$mount('#app')

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// import vuex from 'vuex'
import Axios from 'axios'
import ElementUI from 'element-ui'
// import VueResource from 'vue-resource'
import global_ from '@/components/global'
import 'element-ui/lib/theme-chalk/index.css'
// import 'element-ui/lib/theme-chalk/base.css'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
import '@/assets/css/base.css'
Vue.config.productionTip = false
Vue.use(ElementUI, CollapseTransition.name, CollapseTransition)
Vue.prototype.axios = Axios
Vue.prototype.GLOBAL = global_
if (process.env.NODE_ENV === 'production') {
//Vue.prototype.GLOBAL.BASE_URL = 'http://192.168.111.103:52019' // 测试接口
     Vue.prototype.GLOBAL.BASE_URL = 'http://192.168.111.103:52019' // 正式接口
} else {
  // Vue.prototype.GLOBAL.BASE_URL = '开发测试地址'
  Vue.prototype.GLOBAL.BASE_URL = '/api'
}
/* eslint-disable no-new */
router.beforeEach((to, from, next) => {
  const role = sessionStorage.getItem('token')
  if (!role && to.path !== '/login') {
    next('/login')
  } else {
    // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
    if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
      Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
        confirmButtonText: '确定'
      })
    } else {
      next()
    }
  }
})
new Vue({
  el: '#app',
  router,
  render: h => h(App)
}).$mount('#app')

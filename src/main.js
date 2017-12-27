// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
import VueTouch from 'vue-touch'
// import {test} from './service/getData'

Vue.use(VueTouch, {name: 'v-touch'})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

// test().then(res => {
//   console.log(res)
// })

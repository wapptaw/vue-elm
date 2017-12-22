import Vue from 'vue'
import Router from 'vue-router'
import takeOut from '../page/take-out'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'take-out',
      component: takeOut
    }
  ]
})

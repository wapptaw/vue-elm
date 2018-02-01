import Vue from 'vue'
import Router from 'vue-router'
import TakeOut from '../page/TakeOut'
import AddressSearch from '../page/AddressSearch'
import CitySelect from '../page/CitySelect'
import ShopSearch from '../page/ShopSearch'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'TakeOut',
      component: TakeOut
    },
    {
      path: '/AddressSearch',
      name: 'addressSearch',
      component: AddressSearch
    },
    {
      path: '/CitySelect',
      name: 'citySelect',
      component: CitySelect
    },
    {
      path: '/ShopSearch',
      name: 'shopSearch',
      component: ShopSearch
    }
  ]
})

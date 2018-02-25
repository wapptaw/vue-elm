import Vue from 'vue'
import Router from 'vue-router'
import TakeOut from '../page/TakeOut'
import AddressSearch from '../page/AddressSearch'
import CitySelect from '../page/CitySelect'
import ShopSearch from '../page/ShopSearch'
import FoodCategory from '../page/FoodCategory'
import FoodPage from '../page/FoodPage/FoodPage'
import order from '../page/FoodPage/children/order'
import evaluate from '../page/FoodPage/children/evaluate'
import merchant from '../page/FoodPage/children/merchant'
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
    },
    {
      path: '/FoodCategory/:category',
      name: 'foodCategory',
      component: FoodCategory
    },
    {
      path: '/FoodPage/:id',
      name: 'foodPage',
      component: FoodPage,
      props: true, // 这个设置为true使得route.params.id可在组件props获取
      children: [
        {
          path: 'order',
          name: 'order',
          component: order,
          props: true
        },
        {
          path: 'evaluate',
          name: 'evaluate',
          component: evaluate
        },
        {
          path: 'merchant',
          name: 'merchant',
          component: merchant
        }
      ]
    }
  ]
})

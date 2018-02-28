import Vue from 'vue'
import Router from 'vue-router'
import home from '../page/Home/home'
import TakeOut from '../page/Home/children/TakeOut'
import ShopSearch from '../page/Home/children/ShopSearch'
import OrderForm from '../page/Home/children/OrderForm'
import user from '../page/Home/children/user'
import AddressSearch from '../page/AddressSearch'
import CitySelect from '../page/CitySelect'
import FoodCategory from '../page/FoodCategory'
import FoodPage from '../page/FoodPage/FoodPage'
import order from '../page/FoodPage/children/order'
import evaluate from '../page/FoodPage/children/evaluate'
import merchant from '../page/FoodPage/children/merchant'
import shopSafe from '../page/FoodPage/children/children/shopSafe'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: home,
      children: [
        {
          path: '',
          component: TakeOut
        },
        {
          path: 'TakeOut',
          name: 'takeOut',
          component: TakeOut
        },
        {
          path: 'ShopSearch',
          name: 'shopSearch',
          component: ShopSearch
        },
        {
          path: 'OrderForm',
          name: 'orderForm',
          component: OrderForm
        },
        {
          path: 'user',
          name: 'user',
          component: user
        }
      ]
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
    // {
    //   path: '/ShopSearch',
    //   name: 'shopSearch',
    //   component: ShopSearch
    // },
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
          component: evaluate,
          props: true
        },
        {
          path: 'merchant',
          name: 'merchant',
          component: merchant,
          props: true,
          children: [
            {
              path: 'shopSafe',
              name: 'shopSafe',
              component: shopSafe
            }
          ]
        }
      ]
    }
  ]
})

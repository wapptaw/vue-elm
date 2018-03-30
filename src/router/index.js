import Vue from 'vue'
import Router from 'vue-router'

const home = () => import('../page/Home/home')
const TakeOut = () => import('../page/Home/children/TakeOut')
const ShopSearch = () => import('../page/Home/children/ShopSearch')
const OrderForm = () => import('../page/Home/children/OrderForm')
const user = () => import('../page/Home/children/user')
const AddressSearch = () => import('../page/city/AddressSearch')
const CitySelect = () => import('../page/city/CitySelect')
const FoodCategory = () => import('../page/FoodCategory')
const FoodPage = () => import('../page/FoodPage/FoodPage')
const order = () => import('../page/FoodPage/children/order')
const evaluate = () => import('../page/FoodPage/children/evaluate')
const merchant = () => import('../page/FoodPage/children/merchant')
const shopSafe = () => import('../page/FoodPage/children/children/shopSafe')
const OrderConfirm = () => import('../page/formPay/OrderConfirm')
const login = () => import('../page/login/login')
const userInfo = () => import('../page/Home/children/children/userInfo')
const resetPassword = () => import('../page/forget/resetPassword')
const deliveryAddress = () => import('../page/deliveryAddress/deliveryAddress')
const addressAdd = () => import('../page/deliveryAddress/chilren/addressAdd')
const addressNearby = () => import('../page/deliveryAddress/chilren/addressNearby')
const remark = () => import('../page/formPay/children/remark')
const invoice = () => import('../page/formPay/children/invoice')
const payPage = () => import('../page/formPay/children/payPage')
const orderFormDetail = () => import('../page/Home/children/children/orderFormDetail')

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
          component: OrderForm,
          children: [
            {
              path: 'orderFormDetail/:orderId',
              name: 'orderFormDetail',
              component: orderFormDetail,
              props: true
            }
          ]
        },
        {
          path: 'user',
          name: 'user',
          component: user,
          children: [
            {
              path: 'userinfo',
              name: 'userinfo',
              component: userInfo
            }
          ]
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
    {
      path: '/FoodCategory',
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
    },
    {
      path: '/orderConfirm/:shopId',
      name: 'orderConfirm',
      component: OrderConfirm,
      props: true,
      children: [
        {
          path: 'remark',
          name: 'remark',
          component: remark,
          props: true
        },
        {
          path: 'invoice',
          name: 'invoice',
          component: invoice,
          props: true
        },
        {
          path: 'payPage',
          name: 'payPage',
          component: payPage
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/resetpassword',
      name: 'resetPassword',
      component: resetPassword
    },
    {
      path: '/deliveryAddress',
      name: 'deliveryAddress',
      component: deliveryAddress,
      children: [
        {
          path: 'addressAdd',
          name: 'addressAdd',
          component: addressAdd
        },
        {
          path: 'addressNearby',
          name: 'addressNearby',
          component: addressNearby
        }
      ]
    }
  ]
})

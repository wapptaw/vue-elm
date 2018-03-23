import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

const state = {
  latitude: '', // 当前纬度
  longitude: '', // 当前经度
  locateFailure: '', // 定位失败信息
  cityName: '', // 城市名
  shopListDataNative: [],
  msiteData: '',
  cityId: '', // 城市id
  cityGroup: '', // 所有城市
  clientHeight: '', // 屏幕高度
  historyList: [], // 搜索记录
  cityGroupData: {}, // 城市列表
  detailsHeight: '', // foodPage页面header高度
  shopDetailsData: '',
  foodMenu: {}, // order页数据
  shopSearch: {
    searchData: [],
    searchHistory: []
  },
  orderForms: [],
  userInfo: '', // 用户信息
  addressTS: {}, // 收获地址输入信息暂存
  deliveryAddress: '', // 收货地址
  invoiceType: {
    type: '不开发票',
    title: '不需要发票',
    selected: true,
    needTitle: false
  }, // 发票类型
  payAmount: 0 // 支付的钱数
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})

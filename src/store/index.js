import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

const state = {
  latitude: '', // 当前纬度
  longitude: '', // 当前经度
  geohash: '',
  cityName: '', // 城市名
  cityId: '', // 城市id
  cityGroup: '', // 所有城市
  clientHeight: '', // 屏幕高度
  backHeight: '',
  historyList: [], // 搜索记录
  cityGroupData: {}, // 城市列表
  detailsHeight: '', // foodPage页面header高度
  shopDetailsData: '',
  foodMenu: {}, // order页数据
  btmNavH: 0 // BottomNav页面高度
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})

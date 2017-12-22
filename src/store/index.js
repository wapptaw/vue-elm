import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

const state = {
  latitude: '39.915', // 当前纬度
  longitude: '116.404' // 当前经度
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})

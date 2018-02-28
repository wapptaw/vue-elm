export default {
  geoSave (state, geo) { // 存储经度和纬度
    state.latitude = geo.latitude
    state.longitude = geo.longitude
  },

  geohashSave (state, geohash) { // 存储geohash
    state.geohash = geohash
  },

  cityNameSave (state, cityName) { // 存储城市名称
    state.cityName = cityName
  },

  clientHeightSave (state, clientHeight) { // 存储屏幕高度
    state.clientHeight = clientHeight
  },

  backHeightSave (state, backHeight) { // 存储TopBack高度
    state.backHeight = backHeight
  },

  historyListSave (state, history) { // 存储地址搜索记录
    state.historyList.push(history)
  },

  historyListRemove (state) { // 删除地址搜索记录
    state.historyList = []
  },

  cityGroupDataSave (state, data) { // 存储所有城市列表
    state.cityGroupData = data
  },

  detailsHeightSave (state, height) { // 存储detailHeight
    state.detailsHeight = height
  },

  shopDetailsDataSave (state, shopDetailsData) { // 存储shopDetailsData
    state.shopDetailsData = shopDetailsData
  },

  foodMenuDataSave (state, foodMenuData) { // 存储foodMenuData
    state.foodMenu[foodMenuData.shopId] = foodMenuData.foodMenuData
  },

  bottomNavHeightSave (state, btmNavH) { // 存储bottomNav高度
    state.btmNavH = btmNavH
  }
}

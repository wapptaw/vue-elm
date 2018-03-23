export default {
  geoSave (state, geo) { // 存储经度和纬度
    state.latitude = geo.latitude
    state.longitude = geo.longitude
    state.locateFailure = geo.locateFailure
  },

  cityNameSave (state, cityName) { // 存储城市名称
    state.cityName = cityName
  },

  shopListDataSave (state, shopListData) { // 存储takeout页列表数据
    state.shopListDataNative = shopListData
  },

  msiteSave (state, msiteData) { // msite数据
    state.msiteData = msiteData
  },

  clientHeightSave (state, clientHeight) { // 存储屏幕高度
    state.clientHeight = clientHeight
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

  shopSearchSave (state, shopSearch) {
    state.shopSearch = shopSearch
  },

  orderFormAdd (state, orderForm) {
    state.orderForms.unshift = orderForm
  },

  userInfoSave (state, userInfo) { // 用户数据存储
    state.userInfo = userInfo
  },

  addressTemporaryDataSave (state, ts) { // 收货信息暂存
    for (let v in ts) {
      state.addressTS[v] = ts[v]
    }
  },

  addressSelectSave (state, address) { // 选中的地址保存
    state.deliveryAddress = address
  },

  invoiceTypeSave (state, invoiceType) { // 保存发票信息
    state.invoiceType = invoiceType
  },

  payAmountSave (state, payAmount) { // 需要支付的钱数
    state.payAmount = payAmount
  }
}

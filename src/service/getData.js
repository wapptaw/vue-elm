import fetch from '../config/fetch'

export const getAddress = (geo) => fetch('/geocoder/v2/', {
  location: geo,
  output: 'json',
  pois: 1,
  ak: 'YIxfqG9DZg5nlQqbMS5q7PuSom5wr4CK'
}, {}, 'JSONP', 'http://api.map.baidu.com') // 根据经纬度获取具体位置

export const getWeather = (geo) => fetch('/s6/weather/now', {
  key: '1cf2771a43d741a7af250f78bafb0c90',
  location: geo
}, {}, 'GET', 'https://free-api.heweather.com')  // 获取天气情况

export const cityHot = () => fetch('/v1/cities', {
  type: 'hot'
}) // 热门城市

export const cityGroup = () => fetch('/v1/cities', {
  type: 'group'
}) // 全部城市

export const msiteFoodTypes = geo => fetch('/v2/index_entry', {
  geohash: geo,
  group_type: '1',
  'flags[]': 'F'
}) // msite列表

export const shopList = (latitude, longitude, offset, restaurantCategoryId = '', restaurantCategoryIds = '', orderBy = '', deliveryMode = '', supportIds = []) => {
  let supportStr = ''
  supportIds.forEach(item => {
    supportStr += `&support_ids[]=${item}`
  })
  return fetch('/shopping/restaurants', {
    latitude,
    longitude,
    offset,
    limit: '20',
    'extras[]': 'activities',
    keyword: '',
    restaurant_category_id: restaurantCategoryId,
    'restaurant_category_ids[]': restaurantCategoryIds,
    order_by: orderBy,
    'delivery_mode[]': deliveryMode + supportStr
  })
} // takeout页面店铺列表

export const searchPlace = (cityId, value) => fetch('/v1/pois', {
  type: 'search',
  city_id: cityId,
  keyword: value
}) // 搜索地址

export const searchRestaurant = (geohash, keyword) => fetch('/v4/restaurants', {
  'extras[]': 'restaurant_activity',
  geohash,
  keyword,
  type: 'search'
}) // 店铺搜索

export const foodCategory = (latitude, longitude) => fetch('/shopping/v2/restaurant/category', {
  latitude,
  longitude
}) // food筛选

export const shopDetails = (shopId, latitude, longitude) => fetch(`/shopping/restaurant/${shopId}?extras[]=activities&extras[]=album&extras[]=license&extras[]=identification&extras[]=statistics`, {
  latitude,
  longitude
}) // 商铺详情

export const foodMenu = restaurantId => fetch('/shopping/v2/menu', {
  restaurant_id: restaurantId
}) // shop页面菜单列表

export const getRatingList = (shopId, offset, tagName = '') => fetch(`/ugc/v2/restaurants/${shopId}/ratings`, {
  has_content: true,
  offset,
  limit: 10,
  tag_name: tagName
}) // 商铺评价列表

export const ratingScores = shopId => fetch(`/ugc/v2/restaurants/${shopId}/ratings/scores`) // 评价分数

export const ratingTags = shopId => fetch(`/ugc/v2/restaurants/${shopId}/ratings/tags`) // 评价分类

export const foodDelivery = (latitude, longitude) => fetch('/shopping/v1/restaurants/delivery_modes', {
  latitude,
  longitude,
  kw: ''
}) // 配送方式

export const foodActivity = (latitude, longitude) => fetch('/shopping/v1/restaurants/activity_attributes', {
  latitude,
  longitude,
  kw: ''
}) // 商家属性活动列表

export const mobileCode = phone => fetch('/v4/mobile/verify_code/send', {}, {
  mobile: phone,
  scence: 'login',
  type: 'sms'
}, 'POST') // 获取短信验证码

export const captchasGet = () => fetch('/v1/captchas', {}, {}, 'POST') // 获取图片验证码

export const checkExsis = (checkNumber, type) => fetch('/v1/users/exists', {
  [type]: checkNumber,
  type
}) // 检测账号是否存在

export const sendMobile = (sendData, captchaCode, type, password) => fetch('/v1/mobile/verify_code/send', {}, {
  action: 'send',
  captchaCode,
  [type]: sendData,
  type: 'sms',
  way: type,
  password
}, 'POST') // 发送帐号

export const accountLogin = (username, password, captchaCode) => fetch('/v2/login', {}, {
  username,
  password,
  captcha_code: captchaCode
}, 'POST') // 用户名登录

export const sendLogin = (code, mobile, validateToken) => fetch('/v1/login/app_mobile', {}, {
  code,
  mobile,
  validate_token: validateToken
}, 'POST') // 手机号登录

export const signout = () => fetch('/v2/signout') // 退出登录

export const changePassword = (username, oldpassword, newpassword, confirmpassword, captchaCode) => fetch('/v2/changepassword', {}, {
  username,
  oldpassword,
  newpassword,
  confirmpassword,
  captchaCode
}, 'POST') // 改密码

export const addressGet = (id, sig) => fetch(`/v1/carts/${id}/addresses`, {
  sig
}) // 获取地址列表

export const getAddressList = (userId) => fetch('/v1/users/' + userId + '/addresses')

export const searchNearby = keyword => fetch('/v1/pois', {
  type: 'nearby',
  keyword
}) // 搜索地址

export const addressListGet = userId => fetch(`/v1/users/${userId}/addresses`) // 编辑地址

export const addressDelete = (userId, addressId) => fetch(`/v1/users/${userId}/addresses/${addressId}, {}, {} 'DELETE`) // 删除地址

export const checkout = (geohash, entities, shopid) => fetch('/v1/carts/checkout', {}, {
  come_form: 'web',
  geohash,
  entities,
  restaurant_id: shopid
}, 'POST') // 确认订单

export const addressAdd = (userId, address, addressDetail, geohash, name, phone, sex = '保密', tag = '公司', poiType = 0, tagType = 4, phoneBk = '') => fetch('/v1/users/' + userId + '/addresses', {}, {
  address,
  address_detail: addressDetail,
  geohash,
  name,
  phone,
  phone_bk: phoneBk,
  poi_type: poiType,
  sex,
  tag,
  tag_type: tagType
}, 'POST') // 添加地址

export const validateOrder = ({
  userId,
  cartId,
  addressId,
  description,
  entities,
  geohash,
  sig,
  validateCode,
  validateToken
}) => fetch(`/v1/users/${userId}/carts/'${cartId}/orders`, {}, {
  address_id: addressId,
  come_form: 'mobile_web',
  delivery_time: '',
  description,
  entities,
  geohash,
  paymethod_id: 1,
  sig,
  validation_code: validateCode,
  validation_token: validateToken
}, 'POST') // 下订单

export const payRequest = (merchantOrderNo, userId) => fetch('/payapi/payment/queryOrder', {
  merchantId: 5,
  merchantOrderNo,
  source: 'MOBILE_WAP',
  userId,
  version: '1.0.0'
}) // 重新发送订单验证码

export const orderListGet = (userId, offset) => fetch(`/bos/v2/users/${userId}/orders`, {
  limit: 10,
  offset
}) // 获取订单列表

export const orderDetailGet = (userId, orderId) => fetch(`/bos/v1/users/${userId}/orders/${orderId}/snapshot`) // 获取订单详情

export const getRemark = (id, sig) => fetch('/v1/carts/' + id + '/remarks', {
  sig
}) // 获取备注列表

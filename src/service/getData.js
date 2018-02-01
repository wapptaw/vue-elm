import fetch from '../config/fetch'
import { baseUrl } from '../config/url'

export const getAddress = (geo) => fetch('http://api.map.baidu.com/geocoder/v2/', {
  location: geo,
  output: 'json',
  pois: 1,
  ak: 'YIxfqG9DZg5nlQqbMS5q7PuSom5wr4CK'
}, 'JSONP') // 根据经纬度获取具体位置

export const getWeather = (geo) => fetch('https://free-api.heweather.com/s6/weather/now', {
  key: '1cf2771a43d741a7af250f78bafb0c90',
  location: geo
})  // 获取天气情况

export const cityHot = () => fetch(`${baseUrl}/v1/cities`, {
  type: 'hot'
}) // 热门城市

export const cityGroup = () => fetch(`${baseUrl}/v1/cities`, {
  type: 'group'
}) // 全部城市

export const msiteFoodTypes = geo => fetch(`${baseUrl}/v2/index_entry`, {
  geohash: geo,
  group_type: '1',
  'flags[]': 'F'
}) // msite列表

export const shopList = (latitude, longitude, offset, restaurantCategoryId = '', restaurantCategoryIds = '', orderBy = '', deliveryMode = '', supportIds = []) => {
  let supportStr = ''
  supportIds.forEach(item => {
    if (item.status) {
      supportStr += `&support_ids[]=${item.id}`
    }
  })
  return fetch(`${baseUrl}/shopping/restaurants`, {
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

export const searchNearby = keyword => fetch(`${baseUrl}/v1/pois`, {
  type: 'nearby',
  keyword
}) // 搜索附近

export const searchPlace = (cityId, value) => fetch(`${baseUrl}/v1/pois`, {
  type: 'search',
  city_id: cityId,
  keyword: value
}) // 搜索地址

export const searchRestaurant = (geohash, keyword) => fetch(`${baseUrl}/v4/restaurants`, {
  'extras[]': 'restaurant_activity',
  geohash,
  keyword,
  type: 'search'
})

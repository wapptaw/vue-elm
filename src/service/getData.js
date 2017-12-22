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

export const cityGuess = () => fetch(`${baseUrl}/v1/cities`, {
  type: 'guess'
}) // 默认城市

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
})

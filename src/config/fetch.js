import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)

export default async (url = '', data = {}, type = 'GET') => {
  let response = null
  try {
    switch (type) {
      case 'GET':
        response = await Vue.http.get(url, {
          params: data
        })
        break
      case 'POST':
        response = await Vue.http.post(url, {
          params: data
        })
        break
      case 'JSONP':
        response = await Vue.http.jsonp(url, {
          params: data
        })
        break
      default:
        throw new Error('不存在的请求方式')
    }
    const responseJson = await response.json()
    return responseJson
  } catch (error) {
    throw new Error(error)
  }
}

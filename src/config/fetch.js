import Vue from 'vue'
import VueResource from 'vue-resource'
import {baseUrl} from './url'
Vue.use(VueResource)

// export default async (url = '', data = {}, type = 'GET', base = baseUrl) => {
//   let response = null
//   let fllUrl = base + url
//   try {
//     switch (type) {
//       case 'GET':
//         response = await Vue.http.get(fllUrl, {
//           params: data
//         })
//         break
//       case 'POST':
//         response = await Vue.http.post(fllUrl, {
//           params: data
//         })
//         break
//       case 'JSONP':
//         response = await Vue.http.jsonp(fllUrl, {
//           params: data
//         })
//         break
//       default:
//         throw new Error('不存在的请求方式')
//     }
//     const responseJson = await response.json()
//     return responseJson
//   } catch (error) {
//     throw new Error(error)
//   }
// }

export default async (url, params = {}, data = {}, method = 'GET', base = baseUrl) => {
  try {
    let fllUrl = base + url
    let response = await Vue.http({
      url: fllUrl,
      method,
      data,
      params
    })
    return response.data
  } catch (e) {
    throw new Error(e)
  }
}

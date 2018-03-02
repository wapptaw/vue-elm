import { cityGroup } from '../service/getData'

export default {
  async cityIdSave ({state}) { // 获取城市id
    try {
      let res = await cityGroup()
      state.cityGroup = res
      for (let v in res) {
        for (let i = 0, len = res[v].length; i < len; i++) {
          let city = res[v][i]
          if (new RegExp(city.name).test(state.cityName)) {
            state.cityId = city.id
            break
          }
        }
      }
    } catch (e) {
      throw new Error(e)
    }
  }
}

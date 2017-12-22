<template>
  <div>
    <header class="header">
      <div class="geolocation">
        <span v-if="locationFailure">{{ failure }}</span>
        <span v-else>{{ address }}</span>
      </div>
      <div class="weather">
        <span>{{ weather.cond_txt }}</span>
        <span>{{ weather.temp }}</span>
      </div>
      <div class="search">
        <router-link to="">
          <input type="button" value="开始寻找美食">
        </router-link>
      </div>
    </header>
    <nav>
      <ul class="foodNav">
        <li v-for="item in msite" :key="item.id">
          <router-link to=""></router-link>
          <img :src="imgBaseUrl+item.image_url" :title="item.description" :alt="item.description">
          <p>{{ item.title }}</p>
        </li>
      </ul>
    </nav>
    <div></div>
    <footer></footer>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { getAddress, getWeather, msiteFoodTypes } from '../service/getData'
import { imgBaseUrl } from '../config/url'

export default {
  name: 'take-out',
  data () {
    return {
      failure: '',
      address: '',
      locationFailure: true,
      weather: {
        cond_txt: '',
        temp: ''
      },
      msite: '',
      imgBaseUrl
    }
  },
  
  computed: {
    geo () {
      return `${this.latitude},${this.longitude}`
    },

    ...mapState([
      'latitude',
      'longitude'
    ])
  },

  watch: {
    geo (val) {
      this.addressGet(val)
      this.weatherGet(val)
    }
  },

  mounted () {
    this.getGeo()
    this.addressGet(this.geo)
    this.weatherGet(this.geo)
    this.msiteFoodTypesGet(this.geo)
  },

  methods: {
    getGeo () { // h5定位
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition, this.showError)
      } else {
        this.failure = '浏览器不支持地理定位'
      }
    },

    showPosition (position) { // 获取经纬度和地址
      const latitude = position.coords.latitude
      const longitude = position.coords.longitude
      this.locationFailure = false
      this.geoGet({
        latitude,
        longitude
      })
    },

    showError (error) { // 定位失败处理
      switch (error.code) {
        case error.PERMISSION_DENIED:
          this.failure = '定位失败,用户拒绝请求地理定位'
          break
        case error.POSITION_UNAVAILABLE:
          this.failure = '定位失败,位置信息是不可用'
          break
        case error.TIMEOUT:
          this.failure = '定位失败,请求获取用户位置超时'
          break
        case error.UNKNOWN_ERROR:
          this.failure = '定位失败,定位系统失效'
          break
      }
    },

    addressGet (geo) {
      getAddress(geo).then(response => {
        this.address = response.result.formatted_address
      }).catch (e => {
        throw new Error(e)
      })
    },

    weatherGet (geo) {
      getWeather(geo).then(response => {
        this.weather.cond_txt = response.HeWeather6[0].now.cond_txt
        this.weather.temp = response.HeWeather6[0].now.tmp
      }).catch (e => {
        throw new Error(e)
      })
    },

    msiteFoodTypesGet (geo) {
      msiteFoodTypes(geo).then(response => {
        this.msite = response
      })
    },

    ...mapMutations([
      'geoGet'
    ])
  }
}
</script>

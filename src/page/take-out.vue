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
    <nav class="nav">
      <ul
        :style="{left: position1, transition: trans}"
        @click = "menuSlideLeft"
        @transitionend = "transEnd1"
        class="foodNav">
        <router-link
          to=""
          tag="li"
          v-for="item in foodClass[index]"
          :key="item.id">
          <img :src="imgBaseUrl+item.image_url" :title="item.description" :alt="item.description">
          <p>{{ item.title }}</p>
        </router-link>
      </ul>
      <ul
        v-if="visible"
        :style="{left: position2, transition: trans}"
        @transitionend = "transEnd2"
        class="foodNav">
        <router-link
          to=""
          tag="li"
          v-for="item in foodClass[transIndex]"
          :key="item.id">
          <img :src="imgBaseUrl+item.image_url" :title="item.description" :alt="item.description">
          <p>{{ item.title }}</p>
        </router-link>
      </ul>
      <ul class="mark">
        <li
          v-for="(item, key) in mark" 
          :key="key"
          :style="{backgroundColor: item.color}">
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
      imgBaseUrl,
      index: 0,
      transnum: 1,
      visible: false,
      position1: 0,
      position2: '100%',
      trans: ''
    }
  },

  computed: {
    geo () {
      return `${this.latitude},${this.longitude}`
    },

    msite1 () {
      return this.msite.slice(0, 8)
    },

    msite2 () {
      return this.msite.slice(8, 16)
    },

    foodClass () {
      return [
        this.msite1,
        this.msite2
      ]
    },

    transIndex () {
      return this.index + this.transnum
    },

    mark () {
      let mark = [{}, {}]
      for (let i = 0; i < 2; i++) {
        mark[i].color = ''
      }
      mark[this.index].color = '#29f8d6'
      return mark
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
      }).catch(e => {
        throw new Error(e)
      })
    },

    weatherGet (geo) {
      getWeather(geo).then(response => {
        this.weather.cond_txt = response.HeWeather6[0].now.cond_txt
        this.weather.temp = response.HeWeather6[0].now.tmp
      }).catch(e => {
        throw new Error(e)
      })
    },

    msiteFoodTypesGet (geo) {
      msiteFoodTypes(geo).then(response => {
        this.msite = response
      })
    },

    menuSlideLeft () {
      if (this.index < 1) {
        this.position1 = '-100%'
        this.trans = 'left 1s ease'
        this.visible = true
        this.position2 = '100%'
        this.transnum = 1
        setTimeout(() => {
          this.position2 = 0
        }, 16)
      }
    },

    menuSlideRight () { // 添加事件
      if (this.index > 0) {
        this.position1 = '100%'
        this.trans = 'left 1s ease'
        this.visible = true
        this.position2 = '-100%'
        this.transnum = -1
        setTimeout(() => {
          this.position2 = 0
        }, 16)
      }
    },

    transEnd1 () {
      this.position1 = 0
      this.trans = 'left 0s ease'
      this.index = this.transIndex
    },

    transEnd2 () {
      this.visible = false
    },

    ...mapMutations([
      'geoGet'
    ])
  }
}
</script>

<style lang="scss" scoped>
  .header {
    width: 100%;
    height: 1rem;
    padding: 0 2%;
    box-sizing: border-box;
    background-color: #0f96e4;
    font-size: 0;
    .geolocation {
      display: inline-block;
      width: 80%;
      text-align: left;
      margin-top: .1rem;
      span {
        font-size: .16rem;
        color: #1f1f1f;
      }
    }
    .weather {
      display: inline-block;
      width: 20%;
      text-align: right;
      margin-top: .1rem;
      span {
        font-size: .16rem;
        color: #1f1f1f;
      }
    }
    .search {
      margin-top: .1rem;
      input {
        display: block;
        color: rgb(80, 80, 80);
        background-color: #fff;
        width: 100%;
        height: .4rem;
        margin: 0 auto;
        border: 1px solid #a1a1a1;
        text-align: center;
        font-size: .18rem;
        border-radius: 5px;
      }
    }
  }
  .nav {
    position: relative;
    border: 1px solid rgba(0, 0, 0, 0);
  }
  .foodNav {
    width: 100%;
    padding: 0 2%;
    font-size: 0;
    box-sizing: border-box;
    position: absolute;
    left: 0;
    top: 0;
    li {
      display: inline-block;
      width: 25%;
      text-align: center;
      img {
        width: .6rem
      }
      p {
        font-size: .16rem;
        color: #1f1f1f;
      }
    }
  }
  .mark {
    width: .5rem;
    margin: .1rem auto;
    margin-top: 1.7rem;
    font-size: 0;
    li {
      width: .15rem;
      height: .05rem;
      display: inline-block;
      background-color: #bdfdf2;
      margin: 0 .05rem;
    }
  }
</style>

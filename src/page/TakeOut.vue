<template>
  <div>
    <div
      v-touchMove="{upScroll}"
      class="wrap1"
      :style="{height: heightWrap1, overflowY: overflowYWrap1}">
      <header
        class="header"
        :style="{height: headerHeight}">
        <div class="geolocation">
          <span v-if="loading">定位中...</span>
          <span v-else-if="locationFailure">{{ failure }}</span>
          <span v-else>{{ address }}</span>
        </div>
        <div class="weather">
          <span>{{ weather.cond_txt }}</span>
          <span>{{ weather.temp }}</span>
        </div>
      </header>
      <div
        class="search"
        :style="{height: searchHeight}">
        <router-link to="">
          <input type="button" value="开始寻找美食">
        </router-link>
      </div>
      <div
        v-touchMove
        class="wrap2"
        :style="{height: heightWrap2, overflowY: overflowYWrap2}">
        <nav class="nav">
          <v-touch
            @swipeleft="menuSlideLeft"
            @swiperight="menuSlideRight"
            :swipe-options="{direction: 'horizontal', threshold: 100}"
            :enabled="true">
            <ul  
              :style="{left: position1, transition: trans}"
              @transitionend = "transEnd1"
              class="foodNav">
              <router-link
                to=""
                tag="li"
                v-for="item in msite1"
                :key="item.id">
                <img :src="imgBaseUrl+item.image_url" :title="item.description" :alt="item.description">
                <p>{{ item.title }}</p>
              </router-link>
            </ul>
          </v-touch>
          <ul
            v-if="visible"
            :style="{left: position2, transition: trans}"
            @transitionend = "transEnd2"
            class="foodNav">
            <router-link
              to=""
              tag="li"
              v-for="item in msite2"
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
        <div
          v-touchMove
          class="shopList">
          <shop-list :geohash="geohash"></shop-list>
        </div>
      </div>
    </div>
    <footer
      class="footer"
      :style="{height: footerHeight}"></footer>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { getAddress, getWeather, msiteFoodTypes } from '../service/getData'
import { imgBaseUrl } from '../config/url'
import ShopList from '../components/common/ShopList'
import { switchRem, switchPx } from '../config/rem'

export default {
  name: 'TakeOut',

  components: {
    ShopList
  },

  data () {
    return {
      failure: '',
      address: '',
      locationFailure: false,
      loading: true,
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
      trans: '',
      clientHeight: '',
      headerHeight: '.4rem',
      searchHeight: '.7rem',
      footerHeight: '.55rem',
      overflowYWrap1: 'auto',
      overflowYWrap2: 'hidden'
    }
  },

  computed: {
    geohash () {
      return `${this.latitude},${this.longitude}`
    },

    msite1 () {
      return this.msite.slice(this.index * 8, this.index * 8 + 8)
    },

    msite2 () {
      return this.msite.slice(this.transIndex * 8, this.transIndex * 8 + 8)
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

    heightWrap1 () {
      return `${switchRem(this.clientHeight) - switchRem(this.footerHeight)}rem`
    },

    heightWrap2 () {
      return `${switchRem(this.clientHeight) - switchRem(this.footerHeight) - switchRem(this.searchHeight)}rem`
    },

    ...mapState([
      'latitude',
      'longitude'
    ])
  },

  watch: {
    geohash (val) {
      this.addressGet(val)
      this.weatherGet(val)
    }
  },

  mounted () {
    this.getGeo()
    this.addressGet(this.geohash)
    this.weatherGet(this.geohash)
    this.msiteFoodTypesGet(this.geohash)
    this.clientHeightGet()
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
      this.loading = false
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
          this.loading = false
          this.locationFailure = true
          break
        case error.POSITION_UNAVAILABLE:
          this.failure = '定位失败,位置信息是不可用'
          this.loading = false
          this.locationFailure = true
          break
        case error.TIMEOUT:
          this.failure = '定位失败,请求获取用户位置超时'
          this.loading = false
          this.locationFailure = true
          break
        case error.UNKNOWN_ERROR:
          this.failure = '定位失败,定位系统失效'
          this.loading = false
          this.locationFailure = true
          break
      }
    },

    addressGet (geohash) { // 具体地址获取
      getAddress(geohash).then(response => {
        this.address = response.result.formatted_address
      }).catch(e => {
        throw new Error(e)
      })
    },

    weatherGet (geohash) { // 天气获取
      getWeather(geohash).then(response => {
        this.weather.cond_txt = response.HeWeather6[0].now.cond_txt
        this.weather.temp = response.HeWeather6[0].now.tmp
      }).catch(e => {
        throw new Error(e)
      })
    },

    msiteFoodTypesGet (geohash) {  // 食物分类列表
      msiteFoodTypes(geohash).then(response => {
        this.msite = response
      })
    },

    menuSlideLeft () { // 左滑事件
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

    menuSlideRight () { // 右滑事件
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

    transEnd1 () { // 滑动结束事件
      this.position1 = 0
      this.trans = 'left 0s ease'
      this.index = this.transIndex
    },

    transEnd2 () { // 滑动结束事件
      this.visible = false
    },

    clientHeightGet () { // 获取屏幕高度
      this.clientHeight = `${document.documentElement.clientHeight}px`
      this.clientHeightSave(this.clientHeight)
    },

    upScroll (e) {
      if (e.scrollTop >= switchPx(this.headerHeight)) {
        this.overflowYWrap1 = 'hidden'
        this.overflowYWrap2 = 'auto'
        console.log(666)
      }
    },

    ...mapMutations([
      'geoGet',
      'clientHeightSave'
    ])
  }
}
</script>

<style lang="scss" scoped>
  .header {
    width: 100%;
    // height: .4rem;
    padding: 0 2%;
    box-sizing: border-box;
    background-color: #0f96e4;
    font-size: 0;
    .geolocation {
      float: left;
      width: 70%;
      span {
        display: inline-block;
        width: 100%;
        font-size: .16rem;
        line-height: .4rem;
        color: #1f1f1f;
        text-overflow: ellipsis;
        overflow-x: hidden;
        white-space: nowrap;
      }
    }
    .weather {
      float: right;
      span {
        line-height: .4rem;
        font-size: .16rem;
        color: #1f1f1f;
      }
    }
  }
  .search {
    padding: 0 .05rem;
    padding-bottom: .2rem;
    padding-top: .1rem;
    background-color: #0f96e4;
    box-sizing: border-box;
    // height: .7rem;
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
  .nav {
    position: relative;
    border: 1px solid rgba(0, 0, 0, 0);
    overflow: hidden;
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
  .footer {
    width: 100%;
    // height: .5rem;
    background-color: #000;
  }
</style>

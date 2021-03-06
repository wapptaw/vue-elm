<template>
  <scroll
    :click="true"
    :pullUpLoad="true"
    :pullDownRefresh="{threshold: 50, stop: 20}"
    :probeType="3"
    :useTransition="false"
    :scrollListen="true"
    :watcherData="watcherData"
    class="wrap1"
    @pullingUp="pullUpLoad"
    @pullingDown="pullDownRefresh"
    @scroll="scrollChange">
    <div>
      <header class="header">
        <router-link to="AddressSearch" tag="div" event="touchend">
          <div class="geolocation">
            <section v-if="locateFailure">
              <span v-if="locateFailure.status">{{locateFailure.message}}</span>
              <span v-else>{{ address }}</span>
            </section>
            <span v-else>定位中...</span>
          </div>
        </router-link>
        <div class="weather">
          <span>{{ weather.cond_txt }}</span>
          <span>{{ weather.temp }}℃</span>
        </div>
      </header>
      <div
        ref="search"
        class="search">
        <router-link
          to="ShopSearch"
          event="touchend"
          tag="input"
          type="button"
          value="开始寻找美食" />
      </div>
      <div>
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
                :to="{name: 'foodCategory', query: {restaurantCategoryId: restaurantCategoryIdGet(item.link), restaurantCategoryTitle: item.title}}" 
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
          class="shopList">
          <shop-list :shopListData="shopListData"></shop-list>
        </div>
      </div>
    </div>
    <prompt-box :boxStyle="loadStyle">
      <span>{{loadContent}}</span>
    </prompt-box>
    <loading v-if="loading"></loading>
  </scroll>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { getAddress, getWeather, msiteFoodTypes, shopList } from '../../../service/getData'
import { imgBaseUrl } from '../../../config/url'

export default {
  name: 'TakeOut',

  components: {
    ShopList: () => import('../../../components/common/ShopList'), // 异步加载组件
    scroll: () => import('../../../components/common/scroll'),
    PromptBox: () => import('../../../components/common/PromptBox'),
    loading: () => import('../../../components/common/loading')
  },

  data () {
    return {
      address: '',
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
      shopListData: [],
      offset: 0,
      shopListLimit: false,
      loadContent: '加载中...',
      loadStyle: {
        height: 0,
        bottom: 'auto',
        top: 'auto'
      },
      footerHeight: '',
      loading: false // 等待动画
    }
  },

  computed: {
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

    watcherData () {
      return [this.shopListData]
    },

    ...mapState([
      'latitude',
      'longitude',
      'locateFailure',
      'shopListDataNative',
      'msiteData'
    ]),
    ...mapGetters([
      'geohash'
    ])
  },
  watch: {
    geohash () {
      this.addressGet()
      this.weatherGet()
      this.msiteFoodTypesGet()
      this.shopListGet()
    }
  },

  mounted () {
    this.addressGet()
    this.weatherGet()
    this.msiteFoodTypesGet()
    this.shopListMountedGet()
  },

  methods: {
    async addressGet () { // 地址获取
      try {
        if (this.geohash) {
          let res = await getAddress(this.geohash)
          this.address = res.result.formatted_address
          this.cityNameSave(res.result.addressComponent.city + res.result.addressComponent.district)
          this.cityIdSave()
        }
      } catch (e) {
        throw new Error(e)
      }
    },

    async weatherGet () { // 天气获取
      try {
        if (this.geohash) {
          let res = await getWeather(this.geohash)
          this.weather.cond_txt = res.HeWeather6[0].now.cond_txt
          this.weather.temp = res.HeWeather6[0].now.tmp
        }
      } catch (e) {
        throw new Error(e)
      }
    },

    async msiteFoodTypesGet () { // 食物分类列表
      try {
        if (this.msiteData) {
          this.msite = this.msiteData
        } else {
          if (this.geohash) {
            let res = await msiteFoodTypes(this.geohash)
            this.msite = res
            this.msiteSave(this.msite)
          }
        }
      } catch (e) {
        throw new Error(e)
      }
    },

    restaurantCategoryIdGet (URL) { // 转码
      let urlData = decodeURIComponent(URL.split('=')[1].replace('&target_name', ''))
      if (/restaurant_category_id/gi.test(urlData)) {
        return JSON.parse(urlData).restaurant_category_id.id
      } else {
        return ''
      }
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

    scrollChange (scroll) { // scroll事件
      if (scroll.y <= -40) {
        this.$refs.search.style.transform = `translateY(${-(scroll.y + 40)}px)`
      } else {
        this.$refs.search.style.transform = 'translateY(0)'
      }
      if (this.shopListLimit) {
        if (scroll.maxScrollY - scroll.y > 0) {
          this.loadStyle = {
            bottom: 0,
            top: 'auto',
            height: `${scroll.maxScrollY - scroll.y}px`
          }
          this.loadContent = '没有了...'
        } else {
          this.loadStyle.height = 0
        }
      }
      if (scroll.y > 0) {
        this.loadStyle = {
          bottom: 'auto',
          top: 0,
          height: `${scroll.y}px`
        }
        this.loadContent = '正在刷新...'
      } else if (scroll.maxScrollY - scroll.y < 0) {
        this.loadStyle.height = 0
      }
    },

    async shopListGet () { // shopList数据获取
      try {
        if (this.geohash) {
          this.loading = true
          let res = await shopList(this.latitude, this.longitude, this.offset)
          this.shopListLimit = res.length < 20
          this.shopListData = this.shopListData.concat(res)
          this.shopListDataSave(this.shopListData)
          this.loading = false
        }
      } catch (e) {
        throw new Error(e)
      }
    },

    shopListMountedGet () { // 获取保存的数据
      if (this.shopListDataNative.length > 0) {
        this.shopListData = this.shopListDataNative
      } else {
        this.shopListGet()
      }
    },

    async pullDownRefresh (scroll) { // 下拉刷新
      try {
        this.shopListData = []
        this.offset = 0
        await this.shopListGet()
        scroll.finishPullDown()
      } catch (e) {
        throw new Error(e)
      }
    },

    async pullUpLoad (scroll) { // 上拉加载
      try {
        if (!this.shopListLimit) {
          this.offset += 20
          await this.shopListGet()
        }
        scroll.finishPullUp()
      } catch (e) {
        throw new Error(e)
      }
    },

    ...mapMutations([
      'cityNameSave',
      'shopListDataSave',
      'msiteSave'
    ]),

    ...mapActions([
      'cityIdSave'
    ])
  }
}
</script>

<style lang="scss" scoped>
  .header {
    width: 100%;
    height: .4rem;
    padding: 0 .1rem;
    box-sizing: border-box;
    background-color: #0f96e4;
    font-size: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .geolocation {
      span {
        display: inline-block;
        width: 70vw;
        font-size: .16rem;
        color: #dfdfdf;
        text-overflow: ellipsis;
        overflow-x: hidden;
        white-space: nowrap;
      }
    }
    .weather {
      span {
        font-size: .14rem;
        color: #dfdfdf;
      }
      span:last-of-type {
        margin-left: .1rem;
      }
    }
  }
  .search {
    padding: 0 .05rem;
    padding-bottom: .2rem;
    padding-top: .1rem;
    background-color: #0f96e4;
    box-sizing: border-box;
    height: .7rem;
    position: relative;
    z-index: 1;
    input {
      display: block;
      color: #505050;
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
    background-color: #fff;
    height: 2rem;
  }
  .foodNav {
    width: 100%;
    padding: 0 .1rem;
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
        font-size: .14rem;
        color: #464646;
        margin-top: .05rem;
      }
    }
  }
  .mark {
    width: .5rem;
    font-size: 0;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: .1rem;
    li {
      width: .15rem;
      height: .05rem;
      display: inline-block;
      background-color: #bdfdf2;
      margin: 0 .05rem;
    }
  }
  .wrap1 {
    height: 100%;
    overflow-y: hidden;
    position: relative;
  }
</style>

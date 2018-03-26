<template>
  <div>
    <section :style="{height: homeMainH, overflowY: 'hidden'}" class="homeMain">
      <transition name="fade" mode="out-in">
        <router-view :btmNavH="btmNavH"></router-view>
      </transition>
    </section>
    <BottomNav @heightGet="btmNavHGet"></BottomNav>
  </div>
</template>

<script>
import {mapMutations, mapState, mapGetters} from 'vuex'

export default {
  name: 'home',

  components: {
    BottomNav: async () => import('../../components/common/BottomNav')
  },

  data () {
    return {
      btmNavH: 0,
      clientHeight: 0,
      longitude: 121,
      latitude: 31,
      locateFailureMess: {
        status: false,
        message: ''
      }
    }
  },

  computed: {
    homeMainH () {
      return this.clientHeight - this.btmNavH + 'px'
    },

    ...mapState([
      'locateFailure'
    ]),
    ...mapGetters([
      'geohash'
    ])
  },

  mounted () {
    this.clientHeightGet()
    this.coordsGet()
  },

  methods: {
    btmNavHGet (val) { // 底部导航栏高度获取
      this.btmNavH = val
    },

    clientHeightGet () { // 获取屏幕高度
      this.clientHeight = document.documentElement.clientHeight
      this.clientHeightSave(this.clientHeight)
    },

    geolocation () {
      return new Promise(resolve => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(position => {
            resolve(position.coords)
          }, error => {
            this.locateFailureMess.status = true
            this.locateFailureMess.message = '定位失败，请手动选择地址'
            resolve(error)
          })
        } else {
          this.locateFailureMess.status = true
          this.locateFailureMess.message = '不支持定位，请手动选择地址'
          resolve()
        }
      })
    },

    async coordsGet () {
      try {
        if (this.geohash && this.locateFailure) return // 如果已经保存了定位信息，就直接返回
        let position = await this.geolocation() // 定位中
        if (this.locateFailureMess.status === false) {
          this.longitude = position.longitude
          this.latitude = position.latitude
        }
        this.geoSave({
          longitude: this.longitude,
          latitude: this.latitude,
          locateFailure: this.locateFailureMess
        })
      } catch (e) {
        throw new Error(e)
      }
    },

    ...mapMutations([
      'clientHeightSave',
      'geoSave'
    ])
  }
}
</script>

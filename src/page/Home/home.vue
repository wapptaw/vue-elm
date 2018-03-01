<template>
  <div>
    <section :style="{height: homeMainH, overflowY: 'hidden'}" class="homeMain">
      <router-view></router-view>
    </section>
    <BottomNav @heightGet="btmNavHGet"></BottomNav>
  </div>
</template>

<script>
import {mapMutations} from 'vuex'

export default {
  name: 'home',

  components: {
    BottomNav: async () => import('../../components/common/BottomNav')
  },

  data () {
    return {
      btmNavH: 0,
      clientHeight: 0
    }
  },

  computed: {
    homeMainH () {
      return this.clientHeight - this.btmNavH + 'px'
    }
  },

  mounted () {
    this.clientHeightGet()
  },

  methods: {
    btmNavHGet (val) {
      this.btmNavH = val
    },

    clientHeightGet () { // 获取屏幕高度
      this.clientHeight = document.documentElement.clientHeight
      this.clientHeightSave(this.clientHeight)
    },

    ...mapMutations([
      'clientHeightSave'
    ])
  }
}
</script>


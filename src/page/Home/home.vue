<template>
  <div>
    <section :style="{height: homeMainH}" class="homeMain">
      <router-view></router-view>
    </section>
    <BottomNav @heightGet="heightGet"></BottomNav>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'home',

  components: {
    BottomNav: async () => import('../../components/common/BottomNav')
  },

  data () {
    btmNavH: 0
  },

  computed: {
    homeMainH () {

    },

    ...mapState([
      'clientHeight'
    ])
  },

  mounted () {
    this.heightGet()
  },

  methods: {
    heightGet (val) {
      this.btmNavH = val
    }
  }
}
</script>


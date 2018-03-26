<template>
  <div>
    <nav class="foodNav">
      <router-link
        v-for="item in navData"
        :key="item.name"
        tag="div"
        :class="{selected: item.selected}"
        :to="{name: item.routerName}">
        {{item.name}}
      </router-link>
    </nav>
  </div>
</template>

<script>
import {mapMutations} from 'vuex'

export default {
  name: 'BottomNav',

  data () {
    return {
      navData: [
        {
          name: '外卖',
          routerName: 'takeOut',
          selected: true
        },
        {
          name: '搜索',
          routerName: 'shopSearch',
          selected: false
        },
        {
          name: '订单',
          routerName: 'orderForm',
          selected: false
        },
        {
          name: '我的',
          routerName: 'user',
          selected: false
        }
      ]
    }
  },

  computed: {
    routerName () {
      return this.$route.name
    }
  },

  watch: {
    routerName (newV) { // 切换到没有导航的页面后，导航状态为保存，考虑把状态保存到全局
      for (let v of this.navData) {
        if (v.routerName === newV) {
          v.selected = true
        } else {
          v.selected = false
        }
      }
    }
  },

  mounted () {
    this.$emit('heightGet', 55)
  },

  methods: {
    ...mapMutations([
      'bottomNavHeightSave'
    ])
  }
}
</script>

<style lang="scss" scoped>
  .foodNav {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    background-color: #d3d3d3;
    height: .55rem;
    .selected {
      color: #175cb6;
    }
  }
</style>

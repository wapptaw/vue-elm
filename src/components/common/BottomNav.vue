<template>
  <div>
    <nav class="foodNav">
      <router-link
        v-for="item in navData"
        :key="item.name"
        tag="div"
        :class="{selected: routerName === item.routerName}"
        class="foodItem"
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
          routerName: 'takeOut'
        },
        {
          name: '搜索',
          routerName: 'shopSearch'
        },
        {
          name: '订单',
          routerName: 'orderForm'
        },
        {
          name: '我的',
          routerName: 'user'
        }
      ]
    }
  },

  computed: {
    routerName () {
      return this.$route.name
    }
  },

  mounted () {
    this.$emit('heightGet', 50)
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
    background-color: #e0e0e0;
    height: .5rem;
    .foodItem {
      font-size: .12rem;
      color: #3f3f3f;
      width: .35rem;
      height: .35rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #4cdfd7;
      background-color: #fff;
      border-radius: .2rem;
    }
    .selected {
      color: #175cb6;
      font-weight: bold;
    }
  }
</style>

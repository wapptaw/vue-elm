<template>
  <div>
     <TopBack :title="$route.query.restaurantCategoryTitle"></TopBack>
     <ShopList :restaurantCategoryId="$route.query.restaurantCategoryId"></ShopList>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import TopBack from '../components/common/TopBack'

export default {
  name: 'foodCategory',

  components: {
    TopBack,
    ShopList: async () => import('../components/common/ShopList')
  },

  computed: {
    ...mapState([
      'latitude',
      'longitude'
    ])
  },

  mounted () {
    // sconsole.log(this.$route)
  },

  methods: {
    // 上拉刷新，下拉加载，极限控制
  }
}
</script>

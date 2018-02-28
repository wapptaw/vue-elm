<template>
  <div>
    <div ref="topContent">
      <TopBack title="美食选择"></TopBack>
      <SearchBox placeholder="美食、商铺" :inputEventAble="true" @getSearchData="searchFood"></SearchBox>
    </div>
    <div :style="{height: cityContentHeight, overflowY: 'auto'}">
      <ShopList :foodListData="foodSearchList" :getDataOutside="true"></ShopList>
    </div>
  </div>
</template>

<script>
import TopBack from '../../../components/common/TopBack'
import SearchBox from '../../../components/common/SearchBox'
import ShopList from '../../../components/common/ShopList'
import {searchRestaurant} from '../../../service/getData'
import {mapState} from 'vuex'

export default {
  name: 'shopSearch',

  components: {
    TopBack,
    SearchBox,
    ShopList
  },

  data () {
    return {
      foodSearchList: []
    }
  },

  computed: {
    cityContentHeight () {
      return `${this.clientHeight - this.topContentHeight}px`
    },

    ...mapState([
      'geohash',
      'clientHeight'
    ])
  },

  mounted () {
    this.$nextTick(() => {
      let topContent = this.$refs.topContent
      this.topContentHeight = topContent.offsetHeight
    })

  },

  methods: {
    async searchFood (val) {
      try {
        let res
        if (val) {
          res = await searchRestaurant(this.geohash, val)
        } else {
          res = []
        }
        this.foodSearchList = res
      } catch (e) {
        throw new Error(e)
      }
    }
  }
}
</script>


<template>
  <div>
    <div>
      <TopBack title="美食选择"></TopBack>
      <SearchBox placeholder="美食、商铺" :inputEventAble="true" @changeVal="searchFood"></SearchBox>
    </div>
    <div>
      <div>
        <ul>
          <li v-for="item in foodSearchList" :key="item.id">{{item.name}}</li>
        </ul>
      </div>
      <!-- <ShopList :foodListData="foodSearchList"></ShopList> -->
    </div>
  </div>
</template>

<script>
import TopBack from '../components/common/TopBack'
import SearchBox from '../components/common/SearchBox'
import ShopList from '../components/common/ShopList'
import {searchRestaurant} from '../service/getData'
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
    ...mapState([
      'geohash'
    ])
  },

  methods: {
    async searchFood (val) {
      try {
        let res = await searchRestaurant(this.geohash, val)
        this.foodSearchList = res
        console.log(res)
      } catch (e) {
        throw new Error(e)
      }
    }
  }
}
</script>


<template>
  <div :style="{backgroundColor: '#fff', height: '100vh'}">
    <div>
      <TopBack title="美食选择"  @heightGet="topBackHeightGet"></TopBack>
      <SearchBox
        placeholder="美食、商铺"
        :inputEventAble="true"
        @getSearchData="searchFood"
        @heightGet="searchBoxHeightGet"></SearchBox>
    </div>
    <section
      v-if="searchHistoryShow"
      class="searchHistory">
      <h3 class="title">搜索记录</h3>
      <ul class="ulHistories">
        <v-touch tag="li"
          v-for="item in shopSearch.searchHistory"
          :key="item"
          class="liHistory"
          @tap="searchFood(item)">
          {{item}}
        </v-touch>
      </ul>
      <v-touch
        v-if="shopSearch.searchHistory.length > 0"
        tag="footer"
        class="clearHistory"
        @tap="clearHistory">清空搜索记录</v-touch>
    </section>
    <scroll
      v-else-if="foodSearchList.length > 0"
      :click="true"
      :bounce="false"
      :style="{height: scrollHeight, overflow: 'hidden'}">
      <ShopList :shopListData="foodSearchList"></ShopList>
    </scroll>
    <div v-else class="noSearchResult">没有搜索结果</div>
    <loading v-if="loading"></loading>
  </div>
</template>

<script>
import {searchRestaurant} from '../../../service/getData'
import {mapState, mapGetters, mapMutations} from 'vuex'

export default {
  name: 'shopSearch',

  components: {
    TopBack: () => import('../../../components/common/TopBack'),
    SearchBox: () => import('../../../components/common/SearchBox'),
    ShopList: () => import('../../../components/common/ShopList'),
    scroll: () => import('../../../components/common/scroll'),
    loading: () => import('../../../components/common/loading')
  },

  props: {
    btmNavH: {
      type: Number,
      default: 0
    }
  },

  data () {
    return {
      foodSearchList: [],
      topBackHeight: 0,
      searchBoxHeight: 0,
      searchHistoryShow: true,
      loading: false
    }
  },

  computed: {
    scrollHeight () {
      return `${this.clientHeight - this.topBackHeight - this.searchBoxHeight - this.btmNavH}px`
    },

    ...mapState([
      'clientHeight',
      'shopSearch'
    ]),

    ...mapGetters([
      'geohash'
    ])
  },

  beforeRouteEnter (to, from, next) {
    if (from.name === 'order') {
      next(vm => {
        vm.foodSearchList = vm.shopSearch.searchData
        vm.searchHistoryShow = false
      })
    } else {
      next()
    }
  },

  methods: {
    async searchFood (val) { // 获取搜索结果
      try {
        let res
        if (val) {
          this.loading = true
          res = await searchRestaurant(this.geohash, val)
          this.loading = false
        } else {
          res = []
        }
        this.foodSearchList = res
        if (!this.shopSearch.searchHistory.includes(val)) { // 不保存重复搜索的记录
          this.shopSearch.searchHistory.push(val)
        }
        this.shopSearchSave({
          searchData: res,
          searchHistory: this.shopSearch.searchHistory
        })
        this.searchHistoryShow = false
      } catch (e) {
        throw new Error(e)
      }
    },

    topBackHeightGet (height) { // 获取topBack高度
      this.topBackHeight = height
    },

    searchBoxHeightGet (height) { // 获取searchBox高度
      this.searchBoxHeight = height
    },

    clearHistory () { // 清除历史记录
      this.shopSearchSave({
        searchHistory: []
      })
    },

    ...mapMutations([
      'shopSearchSave'
    ])
  }
}
</script>

<style lang="scss" scoped>
.searchHistory {
  background-color: #e9e9e9;
  .title {
    padding-left: .1rem;
    font-size: .14rem;
    color: #242424;
    background-color: #fff;
    padding-bottom: .1rem;
  }
  .ulHistories {
    .liHistory {
      padding: 0 .15rem;
      margin: .02rem 0;
      line-height: .25rem;
      font-size: .14rem;
      color: #555555;
      background-color: #fff;
      border-bottom: 1px solid #fff;
    }
  }
  .clearHistory {
    padding-top: .1rem;
    font-size: .14rem;
    color: #888888;
    text-align: center;
    background-color: #fff;
  }
}
.noSearchResult {
  color: #535353;
  font-size: .14rem;
  margin-left: .1rem;
}
</style>

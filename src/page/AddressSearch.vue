<template>
  <div>
    <div ref="topContent">
      <TopBack title="地址选择">
        <router-link to="CitySelect" class="switchCity">切换城市</router-link>
      </TopBack>
      <SearchBox @getSearchData="getSearchData" placeholder="请输入地址"></SearchBox>
    </div>
    <div :style="{height: searchContentHeight, overflowY: 'auto'}">
      <div v-if="searchHistory" class="searchHistory">
        <div class="searchRecord">搜索记录</div>
        <ul>
          <router-link
            to="/"
            tag="li"
            v-for="item in historyList"
            :key="item.name"
            class="place">
            <div @click="lookHistory(item)">{{item.name}}</div>
          </router-link>
        </ul>
        <div
          v-if="historyExist"
          @click="removeHistory"
          class="removeHistory">
          清除历史记录
        </div>
      </div>
      <div v-else-if="searchResult" class="searchResult">
        搜索不到此地址，请修改关键词
      </div>
      <div class="placeList" else>
        <ul>
          <router-link
            to="/"
            event="click"
            tag="li"
            v-for="item in placeList"
            :key="item.name"
            class="place">
            <div @click="changeGeohash(item)">
              <div class="name">{{item.name}}</div>
              <div class="address">{{item.address}}</div>
            </div>
          </router-link>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import TopBack from '../components/common/TopBack'
import SearchBox from '../components/common/SearchBox'
import { searchPlace } from '../service/getData'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'AddressSearch',

  components: {
    TopBack,
    SearchBox
  },

  data () {
    return {
      placeList: [],
      searchHistory: true,
      searchResult: true,
      geohash: '',
      topContentHeight: ''
    }
  },

  computed: {
    historyExist () {
      if (this.historyList.length > 0) {
        return true
      } else {
        return false
      }
    },

    searchContentHeight () {
      return `${this.clientHeight - this.topContentHeight}px`
    },

    ...mapState([
      'cityId',
      'historyList',
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
    getSearchData (val) { // 获取搜索地址列表
      searchPlace(this.cityId, val).then(res => {
        this.searchHistory = false
        if (res.length !== 0) {
          this.searchResult = false
          this.placeList = res
        } else {
          this.searchResult = true
          this.placeList = []
        }
      })
    },

    changeGeohash (item) {
      this.geohashSave(item.geohash)
      this.historyListSave(item)
    },

    lookHistory (item) {
      this.geohashSave(item.geohash)
    },

    removeHistory () {
      this.historyListRemove()
    },

    ...mapMutations([
      'geohashSave',
      'historyListSave',
      'historyListRemove'
    ])
  }
}
</script>

<style lang="scss" scoped>
  .switchCity {
    position: absolute;
    top: 0;
    right: .1rem;
    display: block;
    height: .4rem;
    line-height: .4rem;
    font-size: .14rem;
    color: #272727;
    text-align: center;
  }
  .searchHistory {
    .searchRecord {
      margin-top: .1rem;
      padding: 0 .1rem;
      font-size: .15rem;
      color: #313131;
    }
    .place {
      margin-left: .25rem;
      height: .3rem;
      line-height: .3rem;
      font-size: .15rem;
      color: #4d4d4d;
    }
    .removeHistory {
      text-align: center;
      height: .3rem;
      line-height: .25rem;
      color: #6e6e6e;
      margin-top: .3rem;
    }
  }
  .searchResult {
    margin-top: .1rem;
    padding: 0 .1rem;
    font-size: .15rem;
    color: #414141;
  }
  .placeList {
    margin-top: .1rem;
    .place {
      padding: .05rem .1rem;
      border-top: .01rem solid #d1d1d1;
      .name {
        font-size: .15rem;
        min-height: .3rem;
        line-height: .3rem;
        color: #414141;
      }
      .address {
        font-size: .1rem;
        min-height: .2rem;
        line-height: .2rem;
        color: #999;
      }
    }
  }
</style>



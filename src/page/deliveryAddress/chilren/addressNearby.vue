<template>
  <div class="addressNearbyPage">
    <top-back ref="topBack" title="地址搜索"></top-back>
    <search-box ref="searchBox" placeholder="请输入地址" @getSearchData="addressInput"></search-box>
    <section class="addressContainer" :style="{height: addressContainerHeight}">
      <ul v-if="addressNearbyData.length" class="addressSearchUl">
        <v-touch
          tag="li"
          v-for="item in addressNearbyData"
          :key="item.geohash"
          class="addressSearchLi"
          @tap="addressSelect(item)">
          <p class="addressName">{{item.name}}</p>
          <p class="addressDetail">{{item.address}}</p>
        </v-touch>
      </ul>
      <p v-else class="hint">未搜索到任何结果</p>
    </section>
  </div>
</template>

<script>
import TopBack from '../../../components/common/TopBack'
import SearchBox from '../../../components/common/SearchBox'
import {searchNearby} from '../../../service/getData'
import {mapState, mapMutations} from 'vuex'

export default {
  name: 'addressNearby',

  components: {
    TopBack,
    SearchBox
  },

  data () {
    return {
      addressNearbyData: '', // 搜索的地址数据
      addressContainerHeight: '' // 高度
    }
  },

  computed: {
    ...mapState([
      'clientHeight'
    ])
  },

  mounted () {
    this.addressContainerHeightGet()
  },

  methods: {
    async addressNearbyDataGet (key) { // 获取地址数据
      try {
        let res = await searchNearby(key)
        return res
      } catch (e) {
        throw new Error(e)
      }
    },

    async addressInput (key) { // 地址搜索结果
      try {
        let res = await this.addressNearbyDataGet(key)
        this.addressNearbyData = res
      } catch (e) {
        throw new Error(e)
      }
    },

    addressContainerHeightGet () { // 高度获取
      this.addressContainerHeight = `${this.clientHeight - this.$refs.topBack.$el.offsetHeight - this.$refs.searchBox.$el.offsetHeight}px`
    },

    addressSelect (item) { // 选择地址回到上一页
      this.addressTemporaryDataSave({
        pos: item.name,
        addressMore: item.address
      })
      this.$router.push({name: 'addressAdd'})
    },

    ...mapMutations([
      'addressTemporaryDataSave'
    ])
  }
}
</script>

<style lang="scss" scoped>
  .addressNearbyPage {
    position: fixed;
    left: 0;
    top: 0;
    background-color: #ebebeb;
    width: 100vw;
    height: 100%;
    .addressContainer {
      overflow-y: auto;
      .addressSearchUl {
        .addressSearchLi {
          padding: 0 .1rem;
          background-color: #fff;
          margin: 1px 0;
          .addressName {
            font-size: .15rem;
            color: #525252;
            line-height: 2em;
          }
          .addressDetail {
            font-size: .13rem;
            color: #b1b1b1;
            line-height: 2em;
            text-indent: .5em;
          }
        }
      }
      .hint {
        font-size: .15rem;
        color: #4b4b4b;
        padding: 0 .1rem;
      }
    }
  }
</style>


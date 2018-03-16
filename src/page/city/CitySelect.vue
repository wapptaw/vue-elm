<template>
  <div>
    <div ref="topContent">
      <TopBack title="选择城市"></TopBack>
      <SearchBox placeholder="请输入城市" :inputEventAble="true" @getSearchData="clickSearchButton" @changeVal="changeVal"></SearchBox>
    </div>
    <div :style="{height: cityContentHeight, overflowY: 'auto'}">
      <div class="citySearch">
        <ul>
          <v-touch
            tag="li"
            v-for="item in citySearchResult"
            :key="item.id"
            @tap="changeCity(item)"
            class="searchResult">
            <router-link to="/" tag="div">{{item.name}}</router-link>
          </v-touch>
        </ul>
      </div>
      <div class="citys">
        <div class="cityGuess">
          <h4>当前城市：</h4>
          <p class="cityName">{{cityName}}</p>
        </div>
        <div class="cityHot">
          <h4>热门城市：</h4>
          <ul class="cityBox">
            <v-touch tag=li
              v-for="item in hotCity" 
              :key="item.id"
              @tap="changeCity(item)"
              class="cityName">
              <router-link tag="div" to="/">{{item.name}}</router-link>
            </v-touch>
          </ul>
        </div>
        <div class="cityGroup">
          <h4>全部城市：</h4>
          <ul>
            <li v-for="item in cityGroupKey" :key="item" class="cityIndex">
              <h5>{{item}}</h5>
              <ul class="cityBox">
                <v-touch
                  v-for="city in groupCity[item]"
                  tag="li"
                  :key="city.id"
                  @tap="changeCity(city)"
                  class="cityName">
                  <router-link to="/" tag="div">{{city.name}}</router-link>
                </v-touch>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopBack from '../../components/common/TopBack'
import SearchBox from '../../components/common/SearchBox'
import {cityHot, cityGroup} from '../../service/getData'
import {mapState, mapMutations} from 'vuex'

export default {
  name: 'CitySelect',

  components: {
    TopBack,
    SearchBox
  },

  data () {
    return {
      hotCity: [],
      groupCity: {},
      cityGroupKey: [],
      citySearchResult: [],
      citySearchResultAll: true,
      topContentHeight: ''
    }
  },

  computed: {
    cityContentHeight () {
      return `${this.clientHeight - this.topContentHeight}px`
    },

    ...mapState([
      'cityName',
      'cityGroupData',
      'clientHeight'
    ])
  },

  mounted () {
    this.hotCityGet()
    this.groupCityGet()
    this.$nextTick(() => {
      let topContent = this.$refs.topContent
      this.topContentHeight = topContent.offsetHeight
    })
  },

  methods: {
    async hotCityGet () {
      try {
        let res = await cityHot()
        this.hotCity = res
      } catch (e) {
        throw new Error(e)
      }
    },

    async groupCityGet () {
      try {
        let res
        // let cityGroupData = sessionStorage.getItem('cityGroup') // 使用sessionStorage保存
        // if (cityGroupData) {
        //   res = JSON.parse(cityGroupData)
        // } else {
        //   res = await cityGroup()
        //   sessionStorage.setItem('cityGroup', JSON.stringify(res))
        // }
        if (Object.keys(this.cityGroupData).length > 0) {
          res = this.cityGroupData
        } else {
          res = await cityGroup()
          this.cityGroupDataSave(res)
        }
        this.groupCity = res
        let cityGroupKey = Object.keys(this.groupCity)
        let cityGroupKeySort = cityGroupKey.sort()
        let cityGroupKeySortLen = cityGroupKeySort.length
        let count = 0
        let timer = setInterval(() => {
          this.cityGroupKey.push(cityGroupKeySort[count++])
          if (count === cityGroupKeySortLen) {
            clearInterval(timer)
          }
        }, 0)
      } catch (e) {
        throw new Error(e)
      }
    },

    getSearchData (val) {
      if (Object.keys(this.groupCity).length > 0) {
        let reg1 = new RegExp(`^${val}`) // 关心顺序
        let reg2 = new RegExp(val) // 不关心顺序
        let searchResult1 = []
        let searchResult2 = []
        for (let v in this.groupCity) {
          for (let item of this.groupCity[v]) {
            if (reg1.test(item.name)) {
              searchResult1.push(item)
            }
            if (reg2.test(item.name)) {
              searchResult2.push(item)
            }
          }
        }
        if (this.citySearchResultAll) {
          this.citySearchResult = searchResult2
        } else {
          this.citySearchResult = searchResult1
        }
      }
    },

    changeVal (val) {
      if (val === '') {
        this.citySearchResult = []
      } else {
        this.citySearchResultAll = false
        this.getSearchData(val)
      }
    },

    clickSearchButton (val) {
      this.citySearchResultAll = true
      this.getSearchData(val)
    },

    changeCity (item) {
      this.geoSave({
        latitude: item.latitude,
        longitude: item.longitude,
        locateFailure: {
          status: false,
          message: '已手动选择地址'
        }
      })
    },

    ...mapMutations([
      'cityGroupDataSave',
      'geoSave'
    ])
  }
}
</script>

<style lang="scss" scoped>
  .citySearch {
    margin-top: .05rem;
    .searchResult {
      background-color: #d1d1d1;
      padding: 0 .1rem;
      font-size: .15rem;
      line-height: .25rem;
      height: .25rem;
      color: #2c2c2c;
      margin-bottom: .01rem;
    }
  }
  .citys {
    padding: 0 .1rem;
    h4 {
      font-size: .16rem;
      color: #3a3a3a;
    }
    h5 {
      font-size: .15rem;
      color: #474747;
    }
    .cityBox {
      display: flex;
      flex-flow: row wrap;
    }
    .cityName {
      display: flex;
      flex: 1 1 20%;
      justify-content: center;
      align-items: center;
      font-size: .14rem;
      background-color: #84c4e2;
      color: #292929;
      box-sizing: border-box;
      border-radius: .02rem;
      margin: .05rem;
      padding: .02rem;
    }
    .cityGuess {
      & > p {
        background-color: #2395ca;
      }
    }
    .cityHot {
      margin-top: .15rem;
    }
    .cityGroup {
      margin-top: .15rem;
      & > ul {
        margin-top: .1rem;
      }
      .cityIndex {
        margin-left: .1rem;
        margin-top: .05rem;
      }
    }
  }
</style>

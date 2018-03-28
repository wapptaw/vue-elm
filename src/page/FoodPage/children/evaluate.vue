<template>
  <scroll
    :style="{height: evaHeight, overflowY: 'hidden'}"
    :pullUpLoad="true"
    :watcherData="watcherData"
    @pullingUp="ratingLoad">
    <div>
      <section class="ratingScores">
        <div class="compareRating">
          <div class="scores">
            <span class="score">{{ratingScoresData.overall_score | toFixed}}</span>
            <h4>综合评价</h4>
          </div>
          <p class="compare">高于周边{{ratingScoresData.compare_rating * 100 | toFixed}}%的商家</p>
        </div>
        <div class="classifyRating">
          <div class="serviceScore">
            <h4>服务态度</h4>
            <span class="star"></span>
            <span class="score">{{ratingScoresData.service_score | toFixed}}</span>
          </div>
          <div class="foodScore">
            <h4>菜品评价</h4>
            <span class="star"></span>
            <span class="score">{{ratingScoresData.food_score | toFixed}}</span>
          </div>
          <div class="deliverTime">
            <h4>送达时间</h4>
            <span class="time">{{ratingScoresData.deliver_time}}</span>
            <span class="timeBasis">分钟</span>
          </div>
        </div>
      </section>
      <section class="ratingTags">
        <ul class="ulRatingTags">
          <v-touch tag="li"
            v-for="(item, index) in ratingTagsData"
            :key="item.name"
            :class="{unsatisfied: item.unsatisfied, selected: item.selected}"
            class="ratingTag"
            @tap="tagSelected(index)">
            {{item.name}}({{item.count}})
          </v-touch>
        </ul>
      </section>
      <section class="ratingList">
        <ul class="ulRatingList">
          <li v-for="(item, index) in getRatingListData" :key="index" class="itemRating">
            <img v-if="item.avatar" :src="`${imgBaseUrl}${item.avatar}.jpeg`" alt="">
            <img v-else :src="userAvatarDefault" alt="">
            <section class="ratingContent">
              <header class="ratingUser">
                <section class="userScore">
                  <span class="username">{{item.username}}</span>
                  <section class="score">
                    <span class="star"></span>
                    <span class="timeSpent">{{item.time_spent_desc}}</span>
                  </section>
                </section>
                <time class="ratingDate">{{item.rated_at}}</time>
              </header>
              <div class="ratingDetail">
                <ul class="ulRatingImg">
                  <li v-for="rating in item.item_ratings" v-if="rating.image_hash" :key="rating.food_id" class="itemRatingImg">
                    <img :src="`${imgBaseUrl}${rating.image_hash}.jpeg`" alt="">
                  </li>
                </ul>
                <ul class="ulFoodId">
                  <li v-for="rating in item.item_ratings" :key="rating.food_id" class="itemFoodId">
                    {{rating.food_name}}
                  </li>  
                </ul>
              </div>
            </section>
          </li>
        </ul>
      </section>
    </div>
    <loading v-if="loading"></loading>
  </scroll>
</template>

<script>
import {ratingScores, ratingTags, getRatingList} from '../../../service/getData'
import {imgBaseUrl, userAvatarDefault} from '../../../config/url'
import {mapState} from 'vuex'

export default {
  name: 'evaluate',

  components: {
    scroll: async () => import('../../../components/common/scroll'),
    loading: async () => import('../../../components/common/loading')
  },

  filters: {
    toFixed (num) {
      if (!num) return
      return num.toFixed(1)
    }
  },

  props: {
    id: {
      type: [Number, String],
      default: 1
    }
  },

  data () {
    return {
      ratingScoresData: '',
      ratingTagsData: '',
      getRatingListData: [],
      ratingDataLoad: true,
      offset: 0,
      tagName: '',
      imgBaseUrl,
      userAvatarDefault,
      tagSelectedMark: 0,
      loading: false
    }
  },

  computed: {
    evaHeight () {
      return this.clientHeight - this.detailsHeight + 'px'
    },

    watcherData () {
      return [this.offset]
    },

    ...mapState([
      'detailsHeight',
      'clientHeight'
    ])
  },

  watch: {
    tagSelectedMark (newV, oldV) {
      this.ratingTagsData[oldV].selected = false
      this.ratingTagsData[newV].selected = true
    }
  },

  mounted () {
    this.ratingScoresGet()
    this.ratingTagsGet()
    this.getRatingListGet()
  },

  methods: {
    async ratingScoresGet () {
      try {
        let res = await ratingScores(this.id)
        this.ratingScoresData = res
      } catch (e) {
        throw new Error(e)
      }
    },

    async ratingTagsGet () {
      try {
        let res = await ratingTags(this.id)
        for (let v of res) {
          v.selected = false
        }
        res[0].selected = true
        this.ratingTagsData = res
      } catch (e) {
        throw new Error(e)
      }
    },

    async getRatingListGet () {
      try {
        this.loading = true
        let res = await getRatingList(this.id, this.offset, this.tagName)
        if (res.length < 10) this.ratingDataLoad = false
        this.getRatingListData = this.getRatingListData.concat(res)
        this.loading = false
      } catch (e) {
        throw new Error(e)
      }
    },

    tagSelected (index) {
      this.tagSelectedMark = index
      this.tagName = this.ratingTagsData[index].name
      this.getRatingListGet()
    },

    async ratingLoad (scroll) {
      if (this.ratingLoad) {
        this.offset += 10
        await this.getRatingListGet()
        scroll.finishPullUp()
      } else {
        this.arriveBtm = true
        setTimeout(() => {
          this.arriveBtm = false
        }, 1000)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  %mlhc {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
  .ratingScores {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: .3rem 0;
    border-bottom: .1rem solid #ebebeb;
    h4 {
      font-size: .14rem;
      color: #5c5c5c;
    }
    .compareRating {
      @extend %mlhc;
      .scores {
        @extend %mlhc;
        .score {
          font-size: .25rem;
          color: #f78a25;
        }
      }
      .compare {
        font-size: .12rem;
        color: #8d8d8d;
      }
    }
    .classifyRating {
      margin-left: .2rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .star {
        //
      }
      .score {
        font-size: .12rem;
        color: #f78a25;
        margin-left: .1rem;
      }
      & > div {
        display: flex;
      }
      .deliverTime {
        .time {
          font-size: .15rem;
          color: #55da50;
          margin: 0 .1rem;
        }
        .timeBasis {
          font-size: .14rem;
          color: #5c5c5c;
        }
      }
    }
  }
  .ratingTags {
    .ulRatingTags{
      display: flex;
      flex-wrap: wrap;
      padding: .1rem .1rem;
      .ratingTag {
        flex: 0 1 auto;
        font-size: .14rem;
        color: #666666;
        padding: .1rem .1rem;
      }
      .unsatisfied {
        color: #969696;
      }
      .selected {
        color: #fff;
        background-color: #2f82e0;
        border-radius: 5px;
      }
    }
  }
  .ratingList {
    .ulRatingList {
      .itemRating {
        display: flex;
        justify-content: space-between;
        padding: .2rem .1rem;
        & > img {
          width: 10%;
          height: 100%;
          border-radius: 50%;
        }
        .ratingContent {
          width: 90%;
          margin-left: .1rem;
          .ratingUser {
            display: flex;
            justify-content: space-between;
            .userScore {
              .username {
                font-size: .12rem;
                color: #919191;
              }
              .score {
                .star {
                  //
                }
                .timeSpent {
                  font-size: .13rem;
                  color: #919191;
                }
              }
            }
            .ratingDate {
              font-size: .12rem;
              color: #919191;
            }
          }
          .ratingDetail {
            margin-top: .05rem;
            .ulRatingImg {
              display: flex;
              .itemRatingImg {
                width: 20%;
                margin-right: .05rem;
                img {
                  width: 100%
                }
              }
            }
            .ulFoodId {
              margin-top: .05rem;
              .itemFoodId {
                font-size: .14rem;
                color: #5a5a5a;
              }
            }
          }
        }
      }
    }
  }
  .without {
    position: fixed;
    left: 0;
    bottom: .3rem;
    width: 100%;
    font-size: .18rem;
    display: flex;
    justify-content: center;
    color: #d44747;
  }
</style>


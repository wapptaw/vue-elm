<template>
  <div>
    <header class="details" :style="detailsStyle">
      <img :src="`${this.imgBaseUrl2}${this.shopDetailsData && this.shopDetailsData.image_path}`" class="headerBg">
      <div class="headerContent" ref="headerContent">
        <v-touch tag="span" class="back" @tap="goBack">&lt;</v-touch>
        <div class="icon">
          <img :src="`${imgBaseUrl2}${shopDetailsData.image_path}`" alt="">
        </div>
        <div class="message">
          <h2 class="shopName">{{shopDetailsData.name}}</h2>
          <div class="shopTips">商家配送/准时送达/{{shopDetailsData && shopDetailsData.piecewise_agent_fee.tips}}</div>
          <p class="shopIntroduction">公告：{{shopDetailsData.promotion_info}}</p>
          <v-touch tag="div" class="active" @tap="activeShow">
            <div class="description">
              <span
                :style="{backgroundColor: `#${shopDetailsData && shopDetailsData.activities[0] && shopDetailsData.activities[0].icon_color}`}">
                {{shopDetailsData && shopDetailsData.activities[0] && shopDetailsData.activities[0].icon_name}}
              </span>
              <p>{{shopDetailsData && shopDetailsData.activities[0] && shopDetailsData.activities[0].description}}</p>
            </div>
            <span class="activesNum">
              {{shopDetailsData && shopDetailsData.activities.length}}个优惠
            </span>
          </v-touch>
        </div>
      </div>
    </header>
    <div class="shopContent">
      <ul class="title" ref="title">
        <router-link
          v-for="item of titles"
          :key="item.className"
          tag="li"
          :to="{name: item.className}">
          <span>{{item.title}}</span>
        </router-link>
      </ul>
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
    <matte-opacity v-if="actives" @tapScreen="activeClose"></matte-opacity>
    <transition name="slide">
      <div class="activesAll" v-if="actives">
        <h2 class="title">优惠活动</h2>
        <ul>
          <li
            v-for="item in shopDetailsData.activities"
            :key="item.id"
            class="active">
            <div class="description">
              <span :style="{backgroundColor: `#${item.icon_color}`}">{{item.icon_name}}</span>
              <p>{{item.description}}</p>
            </div>
          </li>
        </ul>
        <v-touch tag="span" class="cancel" @tap="activeClose">×</v-touch>
      </div>
    </transition>
  </div>
</template>

<script>
import {shopDetails} from '../../service/getData'
import {mapState, mapMutations} from 'vuex'
import {imgBaseUrl2} from '../../config/url'

export default {
  name: 'FoodPage',

  components: {
    TopBack: () => import('../../components/common/TopBack'),
    MatteOpacity: () => import('../../components/common/MatteOpacity')
  },

  props: {
    id: {
      type: [String, Number],
      default: 1
    }
  },

  data () {
    return {
      shopDetailsData: '',
      imgBaseUrl2,
      detailsHeight: '',
      actives: false,
      titles: [
        {title: '点餐', className: 'order'},
        {title: '评价', className: 'evaluate'},
        {title: '商家', className: 'merchant'}
      ]
    }
  },

  computed: {
    detailsStyle () {
      return {
        'background-image': `url(${this.imgBaseUrl2}${this.shopDetailsData && this.shopDetailsData.image_path})`,
        'background-size': 'cover',
        'background-repeat': 'no-repeat',
        height: this.detailsHeight + 'px'
      }
    },

    titleHeight () {
      return this.$refs.title.offsetHeight
    },

    ...mapState([
      'latitude',
      'longitude'
    ])
  },

  mounted () {
    this.shopDetailsDataGet()
  },

  methods: {
    async shopDetailsDataGet () { // 获取商铺信息
      let res = await shopDetails(this.id, this.latitude, this.longitude)
      this.shopDetailsData = res
      this.shopDetailsDataSave(res)
      this.$nextTick(() => {
        this.detailsHeight = this.$refs.headerContent.offsetHeight
        this.detailsHeightSave(this.detailsHeight + this.titleHeight)
      })
    },

    activeShow () {
      this.actives = true
    },

    activeClose () {
      this.actives = false
    },

    goBack () {
      this.$router.go(-1)
    },

    ...mapMutations([
      'detailsHeightSave',
      'shopDetailsDataSave'
    ])
  }
}
</script>

<style lang="scss" scoped>
  %active {
    font-size: .12rem;
    color: #fff;
    display: flex;
    justify-content: space-between;
    .description {
      display: flex;
      span {
        padding: 0 .02rem;
        border-radius: .02rem;
      }
      p {
        margin-left: .1rem;
      }
    }
    .activesNum {
      color: #56abfa;
    }
  }

  .details {
    width: 100%;
    position: relative;
    overflow: hidden;
    .headerBg {
      position: absolute;
      width: 100%;
      filter: blur(10px);
    }
    .headerContent {
      position: absolute;
      padding: 0 .1rem;
      display: flex;
      width: 100%;
      box-sizing: border-box;
      .back {
        position: fixed;
        left:.1rem;
        top: 0;
        color: rgba(255, 255, 255, 0.6);
        font-size: .25rem;
        transform: scale(1, 2);
      }
      .icon {
        width: 20%;
        margin-top: .15rem;
        img {
          width: 100%;
        }
      }
      .message {
        width: 80%;
        margin-top: .15rem;
        color: #d8d8d8;
        margin-left: .15rem;
        .shopName {
          font-size: .2rem;
          line-height: .3rem;
        }
        .shopTips {
          font-size: .15rem;
          line-height: .25rem;
        }
        .shopIntroduction {
          font-size: .14rem;
          line-height: .25rem;
        }
        margin-bottom: .05rem;
        .active {
          width: 100%;
          @extend %active;
        }
      }
    }
  }
  .shopContent {
    .title {
      display: flex;
      margin-top: 1px;
      border-bottom: 1px solid #cecece;
      li {
        display: flex;
        justify-content: center;
        align-items: center;
        height: .3rem;
        font-size: .16rem;
        color: #181818;
        flex: auto;
      }
      .router-link-active {
        span {
          position: relative;
          &::after {
            content: '';
            width: 100%;
            height: 3px;
            background-color: #1666b1;
            position: absolute;
            left: 0;
            bottom: -0.06rem;
          }
        }
      }
    }
  }
  .activesAll {
    background-color: #e0e0e0;
    min-height: 2rem;
    padding: 0 .1rem .1rem .1rem;;
    box-sizing: border-box;
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 100;
    .title {
      text-align: center;
      font-size: .18rem;
      margin-top: .05rem;
      color: #2e2e2e;
    }
    .active {
      @extend %active;
      margin-top: .1rem;
      .description {
        p {
          color: #1a1a1a;
          font-size: .14rem;
        }
      }
    }
    .cancel {
      width: .25rem;
      height: .25rem;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      right: 0;
      top: 0;
      color: #fff;
      background-color: rgba(0, 0, 0, 0.3);
    }
  }
</style>


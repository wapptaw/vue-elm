<template>
  <div>
    <ul class="shopList">
      <router-link
        tag="li"
        :to="{name: 'order', params: {id: item.id}}"
        v-for="(item, index) in listDate"
        :key="item.id"
        class="list">
        <div class="storeLogo">
          <img :src="`${imgBaseUrl2}${item.image_path}`" alt="">
        </div>
        <div class="storeContent">
          <div class="title">
            <p>{{ item.name }}</p>
            <ul class="support">
              <li
                v-for="support in item.supports"
                :key="support.id"
                :style="{color: `#${support.icon_color}`}">
                {{ support.icon_name }}
              </li>
            </ul>
          </div>
          <div class="market">
            <span class="performance">
              <span class="rating">{{item.rating}}</span>
              <span class="recent">月售{{item.recent_order_num}}单</span>
            </span>
            <span
              :style="{backgroundColor: `#${item.delivery_mode && item.delivery_mode.color}`}"
              class="deliveryMode">
                {{item.delivery_mode && item.delivery_mode.text}}
            </span>
          </div>
          <div class="delivery">
            <span class="fee">
              <span class="minFee">¥{{item.float_minimum_order_amount}}起送</span>
              <span class="deliveryFee">配送费¥{{item.float_delivery_fee}}</span>
            </span>
            <span class="place">
              <span class="distance">{{item.distance}}</span>
              <span class="lendTime">{{item.order_lead_time}}</span>
            </span>
          </div>
        </div>
        <div class="activities">
          <ul>
            <li
              v-for="activity in activityShow(item.activities, item)"
              :key="activity.id"
              class="activity">
              <span 
                :style="{backgroundColor: `#${activity.icon_color}`}"
                class="iconName">
                {{activity.icon_name}}
              </span>
              <span class="description">{{activity.description}}</span>
            </li>
          </ul>
          <div
            class="amount"
            @click.stop="activittyOnOff(index)">
            {{item.activities.length}}个活动
          </div>
        </div>
      </router-link>
    </ul>
    <div
      v-if="!offsetLimit"
      class="ending">
      已经到底了
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { shopList } from '../../service/getData'
import { imgBaseUrl2 } from '../../config/url'

export default {
  name: 'ShopList',

  props: {
    restaurantCategoryId: {
      type: [String, Number],
      default: ''
    },
    restaurantCategoryIds: {
      type: Array,
      default () {
        return []
      }
    },
    orderBy: {
      type: String,
      default: ''
    },
    deliveryMode: {
      type: String,
      default: ''
    },
    supportIds: {
      type: Array,
      default () {
        return []
      }
    },
    confirmSelect: {
      type: String,
      default: ''
    },
    offset: {
      type: Number,
      default: 0
    },
    refreshContral: { // 刷新控制
      type: Boolean,
      default: false
    },
    foodListData: { // 外部直接传入列表数据
      type: Array,
      default () {
        return []
      }
    },
    getDataOutside: { // 是否使用外部传入列表数据
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      listDate: [],
      imgBaseUrl2,
      offsetLimit: true // offset极限控制
    }
  },

  computed: {
    ...mapState([
      'latitude',
      'longitude',
      'geohash'
    ])
  },

  watch: {
    offset () {
      if (this.offsetLimit) {
        this.listDateGet()
      } else {
        this.$emit('listenOffset', this.offsetLimit)
      }
    },

    refreshContral () {
      this.listDate = []
      this.listDateGet()
      this.offsetLimit = true
    },

    foodListData () {
      this.listDateGet()
    },

    geohash () {
      this.listDateGet()
    }
  },

  mounted () {
    this.listDateGet()
  },

  methods: {
    async listDateGet () {
      try {
        if (!this.getDataOutside) {
          if (this.geohash !== '') {
            let res = await shopList(this.latitude, this.longitude, this.offset, this.restaurantCategoryId, this.restaurantCategoryIds, this.orderBy, this.deliveryMode, this.supportIds)
            let listArr = res.map(item => {
              item.show = false
              return item
            })
            if (listArr < 20) {
              this.offsetLimit = false
            }
            this.listDate = this.listDate.concat(listArr)
          }
        } else {
          let listArr = this.foodListData.map(item => {
            item.show = false
            return item
          })
          this.listDate = listArr
        }
      } catch (err) {
        throw new Error(err)
      }
    },

    activittyOnOff (index) {
      this.listDate[index].show = !this.listDate[index].show
    },

    activityShow (activities, item) {
      if (item.show) {
        return activities
      } else {
        return activities.slice(0, 1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .shopList {
    .list {
      font-size: 0;
      width: 100%;
      padding: .2rem .1rem;
      box-sizing: border-box;
      border-top: 1px solid #dbdbdb;
      background-color: #faf9f9;
      .storeLogo {
        display: inline-block;
        width: 20%;
        img {
          width: .6rem;
        }
      }
      .storeContent {
        display: inline-block;
        width: 80%;
        .title {
          & > p {
            display: inline-block;
            font-size: .2rem;
            font-family: '黑体';
            font-weight: bold;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 65%;
          }
          .support {
            float: right;
            & > li {
              display: inline-block;
              margin-left: .05rem;
              padding: 0 .03rem;
              font-size: .15rem;
              line-height: .18rem;
              height: .18rem;
              border: .01rem solid #bdbdbd;
              border-radius: .02rem;
            }
          }
        }
        .market {
          font-size: .15rem;
          height: .2rem;
          line-height: .2rem;
          color: #999;
          .performance {
            .rating {
              margin-left: .1rem;
            }
            .recent {
              margin-left: .05rem;
            }
          }
          .deliveryMode {
            float: right;
            font-size: .12rem;
            font-weight: lighter;
            color: #fff;
            height: .2rem;
            line-height: .2rem;
            padding: 0 .04rem;
            border-radius: .02rem;
          }
        }
        .delivery {
          font-size: .15rem;
          color: #999;
          & > span {
            line-height: .2rem;
          }
          .place {
            float: right;
          }
        }
      }
      .activities {
        position: relative;
        margin-left: 20%;
        margin-top: .1rem;
        .activity {
          .iconName {
            font-size: .15rem;
            font-weight: lighter;
            color: #fff;
            height: .18rem;
            line-height: .18rem;
            border-radius: .02rem;
            display: inline-block;
            padding: 0 .02rem;
          }
          .description {
            font-size: .15rem;
            color: #999;
            margin-left: .05rem;
          }
        }
        .amount {
          position: absolute;
          right: 0;
          top: 0;
          font-size: .14rem;
          color: #999;
        }
      }
    }
  }
  .ending {
    text-align: center;
    background-color: #fd6161;
    line-height: .25rem;
    height: .25rem;
    color: #fff;
  }
</style>

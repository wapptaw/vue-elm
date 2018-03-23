<template>
  <div>
    <ul class="ulShopList">
      <router-link
        v-for="(item, index) in shopListData" 
        :key="index"
        tag="li"
        :to="{name: 'order', params: {id: item.id}}"
        class="liShopList">
        <img :src="`${imgBaseUrl2}${item.image_path}`" :alt="item.name" class="shopIcon">
        <section class="shopDetail">
          <div class="shopDetailTop">
            <h2 class="shopName">{{item.name}}</h2>
            <ul class="ulSupports">
              <li
                v-for="support in item.supports"
                :key="support.id"
                class="liSupport"
                :style="{backgroundColor: `#${support.icon_color}`}">{{support.icon_name}}</li>
            </ul>
          </div>
          <div class="shopDetailCenter">
            <section class="ratingOrderNum">
              <span class="rating">{{item.rating}}</span>
              <span class="orderNum">月售{{item.recent_order_num}}单 / {{item.rating_count}}评价</span>
            </section>
            <ul class="ulDelivery">
              <li
                :style="{backgroundColor: `#${item.delivery_mode && item.delivery_mode.color}`}"
                class="liDelivery">{{item.delivery_mode && item.delivery_mode.text}}</li>
            </ul>
          </div>
          <div class="shopDetailBottom">
            <p class="deliveryCost">配送费￥{{item.float_delivery_fee}}</p>
            <section class="deliveryDistanceTime">
              <span class="distance">{{item.distance}}</span>
              <span class="time">{{item.order_lead_time}}</span>
            </section>
          </div>
        </section>
      </router-link>
    </ul>
  </div>
</template>

<script>
import {imgBaseUrl2} from '../../config/url'

export default {
  name: 'ShopList',

  props: {
    shopListData: {
      type: Array,
      default () {
        return []
      }
    }
  },

  data () {
    return {
      imgBaseUrl2
    }
  }
}
</script>

<style lang="scss" scoped>
%spaceBetween {
  display: flex;
  justify-content: space-between;
}
%vc {
  display: flex;
  justify-content: center;
  align-items: center;
}
.ulShopList {
  background-color: #dadada;
  padding-top: .05rem;
  .liShopList {
    @extend %spaceBetween;
    width: 100%;
    padding: .1rem .1rem;
    box-sizing: border-box;
    background-color: #fff;
    margin: .05rem 0;
    .shopIcon {
      width: 20%;
      height: 100%;
      border-radius: .05rem;
    }
    .shopDetail {
      margin-left: .1rem;
      width: 80%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .shopDetailTop {
        @extend %spaceBetween;
        align-items: center;
        .shopName {
          font-size: .16rem;
          color: #4e4e4e;
          font-weight: bold;
        }
        .ulSupports {
          display: flex;
          .liSupport {
            font-size: .12rem;
            color: #fff;
            margin-left: .03rem;
            padding: 0 .02rem;
            border-radius: .02rem;
          }
        }
      }
      .shopDetailCenter {
        @extend %spaceBetween;
        align-items: center;
        .ratingOrderNum {
          display: flex;
          .rating {
            color: #da631f;
            font-size: .13rem;
          }
          .orderNum {
            color: #9e9e9e;
            font-size: .12rem;
            margin-left: .05rem;
          }
        }
        .ulDelivery {
          display: flex;
          .liDelivery {
            font-size: .12rem;
            color: #fff;
            border-radius: .02rem;
            padding: 0 .02rem;
          }
        }
      }
      .shopDetailBottom {
        @extend %spaceBetween;
        align-items: center;
        .deliveryCost {
          font-size: .12rem;
          color: #8f8f8f;
        }
        .deliveryDistanceTime {
          display: flex;
          .distance {
            font-size: .12rem;
            color: #9e9e9e;
          }
          .time {
            font-size: .13rem;
            color: #1684ce;
            margin-left: .05rem;
          }
        }
      }
    }
  }
}
</style>

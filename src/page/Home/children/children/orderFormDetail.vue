<template>
  <div class="orderFormDetail">
    <top-back title="订单详情" ref="topBack"></top-back>
    <section class="orderContent" :style="{height: `${orderContentHeight}px`}">
      <section class="payoutStatus">
        <div class="shopIcon">
          <img :src="`${imgBaseUrl2}${orderFormDetailData && orderFormDetailData._doc.restaurant_image_url}`">
        </div>
        <p class="status">{{orderFormDetailData && orderFormDetailData._doc.status_bar.title}}</p>
        <div class="againContainer">
          <router-link
            tag="span"
            class="again"
            event="touchend"
            :to="{name: 'order', params: {id: orderFormDetailData && orderFormDetailData._doc.restaurant_id}}">再来一单</router-link>
        </div>
      </section>
      <section class="orderFormList">
        <dl class="orderFormDl">
          <dt class="orderDt">
            <section class="shopName">
              <img :src="`${imgBaseUrl2}${orderFormDetailData && orderFormDetailData._doc.restaurant_image_url}`">
              <h3>{{orderFormDetailData && orderFormDetailData._doc.restaurant_name}}</h3>
            </section>
            <span class="arrows">&gt;</span>
          </dt>
          <dd
            v-for="item in foodList"
            :key="item.name"
            class="orderFormDd">
            <p class="foodName">{{item.name}}</p>
            <section class="amount">
              <span class="quantity">{{item.quantity ? '×' + item.quantity : item.quantity}}</span>
              <span class="price">￥{{item.price}}</span>
            </section>
          </dd>
        </dl>
        <span class="sumPrice">￥{{sumPrice}}</span>
      </section>
      <section class="delivery">
        <h4>配送信息</h4>
        <p class="deliveryTime">送达时间：{{orderFormDetailData && orderFormDetailData.deliver_time}}</p>
        <section class="address">
          <h5>送货地址：</h5>
          <div class="deliveryDetail">
            <p class="addressDetail">{{orderFormDetailData && orderFormDetailData.addressDetail}}</p>
            <p class="phone">{{orderFormDetailData && orderFormDetailData.phone}}</p>
          </div>
        </section>
      </section>
    </section>
  </div>
</template>

<script>
import TopBack from '../../../../components/common/TopBack'
import {orderDetailGet} from '../../../../service/getData'
import {mapState} from 'vuex'
import {imgBaseUrl2} from '../../../../config/url'

export default {
  name: 'orderFormDetail',

  components: {
    TopBack
  },

  props: {
    orderId: {
      type: [String, Number],
      default: ''
    }
  },

  data () {
    return {
      orderFormDetailData: null,
      imgBaseUrl2,
      orderContentHeight: 'auto'
    }
  },

  computed: {
    foodList () { // 订单列表
      let foodList = []
      if (this.orderFormDetailData) {
        let deliverFee = {
          name: '配送费',
          price: this.orderFormDetailData._doc.basket.deliver_fee.price,
          quantity: ''
        }
        let packingFee = {
          name: this.orderFormDetailData._doc.basket.packing_fee.name,
          price: this.orderFormDetailData._doc.basket.packing_fee.price,
          quantity: this.orderFormDetailData._doc.basket.packing_fee.quantity
        }
        let foodGroup = []
        for (let item1 of this.orderFormDetailData._doc.basket.group) {
          for (let item2 of item1) {
            foodGroup.push({
              name: item2.name,
              price: item2.price,
              quantity: item2.quantity
            })
          }
        }
        foodList = foodGroup.concat(packingFee, deliverFee)
      }
      return foodList
    },

    sumPrice () { // 总价
      let sumPrice = 0
      for (let item of this.foodList) {
        if (item.quantity) {
          sumPrice += item.quantity * item.price
        } else {
          sumPrice += item.price
        }
      }
      return sumPrice
    },

    ...mapState([
      'userInfo',
      'clientHeight'
    ])
  },

  mounted () {
    this.orderFormDetailDataGet()
    this.orderContentGet()
  },

  methods: {
    async orderFormDetailDataGet () { // 订单详情
      try {
        let res = await orderDetailGet(this.userInfo.user_id, this.orderId)
        this.orderFormDetailData = res
      } catch (e) {
        throw new Error(e)
      }
    },

    orderContentGet () { // 获取orderContent的高度
      this.orderContentHeight = this.clientHeight - this.$refs.topBack.$el.offsetHeight
    }
  }
}
</script>

<style lang="scss" scoped>
  .orderFormDetail {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    background-color: #fff;
    .orderContent {
      overflow: auto;
      .payoutStatus {
        .shopIcon {
          width: 20%;
          margin: 0 auto;
          padding-top: .15rem;
          img {
            width: 100%;
            border-radius: 50%;
            border: 1px solid #1f9dc4;
          }
        }
        .status {
          font-size: .2rem;
          font-weight: bold;
          color: #3f3f3f;
          text-align: center;
          line-height: .4rem;
        }
        .againContainer {
          display: flex;
          justify-content: center;
          margin: .1rem 0 .15rem 0;
          .again {
            border: 1px solid #1f9dc4;
            color: #1f9dc4;
            border-radius: 3px;
            font-size: .13rem;
            padding: .03rem .1rem;
          }
        }
      }
      .orderFormList {
        padding: 0 .1rem;
        border-top: .1rem solid #e4e4e4;
        border-bottom: .1rem solid #e4e4e4;
        .orderFormDl {
          .orderDt {
            display: flex;
            justify-content: space-between;
            height: .4rem;
            .shopName {
              display: flex;
              align-items: center;
              img {
                width: 10%;
              }
              h3 {
                font-size: .16rem;
                color: #3b3b3b;
                font-weight: bold;
                margin-left: .1rem;
              }
            }
            .arrows {
              color: #747474;
              transform: scale(1, 2);
              display: flex;
              align-items: center;
            }
          }
          .orderFormDd {
            display: flex;
            justify-content: space-between;
            height: .4rem;
            align-items: center;
            .foodName {
              font-size: .14rem;
              color: #636363;
            }
            .amount {
              width: 30%;
              display: flex;
              justify-content: space-between;
              .quantity {
                color: #e0a22f;
                font-size: .14rem;
              }
              .price {
                color: #5e5e5e;
                font-size: .14rem;
              }
            }
          }
        }
        .sumPrice {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          color: #e29727;
          font-size: .13rem;
          font-weight: bold;
          height: .4rem;
        }
      }
      .delivery {
        padding: 0 .1rem;
        padding-bottom: .2rem;
        h4 {
          font-size: .16rem;
          color: #464646;
          line-height: .5rem;
        }
        .deliveryTime {
          font-size: .14rem;
          color: #535353;
          line-height: .5rem;
        }
        .address {
          display: flex;
          h5 {
            font-size: .14rem;
            color: #535353;
            line-height: .4rem;
          }
          .deliveryDetail {
            .addressDetail {
              font-size: .14rem;
              color: #535353;
              line-height: .4rem;
            }
            .phone {
              font-size: .14rem;
              color: #535353;
            }
          }
        }
      }
    }
  }
</style>


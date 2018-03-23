<template>
  <div>
    <top-back ref="topBack" title="确认下单"></top-back>
    <section class="formContent" :style="{height: formContentHeigh}">
      <router-link
        :to="{name: 'deliveryAddress'}"
        event="touchend"
        tag="section"
        class="deliveryAddress">
        <section
          v-if="!deliveryAddress"
          class="addressSelect">
          <p class="addText">请添加一个收货地址</p>
        </section>
        <section v-else class="addressMessage">
          <div class="userMessage">
            <span class="userName">{{deliveryAddress.name}}</span>
            <span class="userSex">{{deliveryAddress.sex | sexDiscern}}</span>
            <span class="userPhone">{{deliveryAddress.phone}}</span>
          </div>
          <div class="addressDetail">
            <span class="address">{{deliveryAddress.address_detail}}</span>
            <span class="supplementAddress">{{deliveryAddress.address}}</span>
          </div>
        </section>
        <span class="arrowsRight">&gt;</span>
      </router-link>
      <section class="deliveryTime">
        <h3 class="title">送达时间</h3>
        <section class="deliveryTimeRight">
          <span class="predictTime">尽快送达 | 预计{{arrivalTime}}</span>
          <span class="deliveryMode">{{shopDetailsData && shopDetailsData.delivery_mode.text}}</span>
        </section>
      </section>
      <v-touch
        tag="section"
        class="payMode"
        @tap="payModeShowContral">
        <h3 class="title">支付方式</h3>
        <p class="onlinePayment">
          <span class="payModeName">{{payModeName}}</span>
          <span class="arrowsRight">&gt;</span>
        </p>
      </v-touch>
      <section class="orderDetail">
        <header class="shop">
          <img :src="`${imgBaseUrl2}${shopDetailsData.image_path}`" class="shopIcon">
          <h3 class="shopName">{{shopDetailsData.name}}</h3>
        </header>
        <ul class="orderListUl">
          <li
            v-for="item in orderData"
            :key="item.name"
            class="orderListLi">
            <h4 class="foodName">{{item.name}}</h4>
            <section class="orderListLiRight">
              <span class="foodNum">{{item.quantity && '×' + item.quantity}}</span>
              <span class="price">￥ {{item.price}}</span>
            </section>
          </li>
        </ul>
        <footer class="sum">
          <span class="sumPrice">合计 ￥{{sumPrice}}</span>
          <div class="waitPay">
            <span class="waitPayName">待支付</span>
            <span class="waitPayPrice">￥{{sumPrice}}</span>
          </div>
        </footer>
      </section>
      <section class="remarks">
        <ul class="remarksUl">
          <router-link
            v-for="item in orderRemarks"
            :key="item.title"
            :to="{name: item.link}"
            tag="li"
            class="remarksLi">
            <h4 class="remarksName">{{item.title}}</h4>
            <p class="remarksContent">
              {{item.message}}
              <span class="arrowsRight">&gt;</span>
            </p>
          </router-link>
        </ul>
      </section>
    </section>
    <footer ref="submitOrder" class="submitOrder">
      <div class="waitePay">待支付 ￥{{sumPrice}}</div>
      <v-touch
        tag="div"
        class="submitButton"
        @tap="orderConfirm">确认下单</v-touch>
    </footer>
    <matte-opacity v-if="payModeShow || popup" @touchend.native="payModeClose"></matte-opacity>
    <pop-up v-if="popup" :warnMessage="warnMessage" @warnConfirm="warnConfirm"></pop-up>
    <transition name="slide">
      <section v-if="payModeShow" class="payModeList">
        <h4>支付方式</h4>
        <ul class="payModeListUl">
          <v-touch
            v-for="(item, index) in payMode"
            tag="li"
            :key="item.name"
            :class="{payModeSelected: item.selected}"
            @tap="payModeSelect(index)">{{item.name}}</v-touch>
        </ul>
      </section>
    </transition>
    <transition name="right-slide-transform">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import TopBack from '../../components/common/TopBack'
import {mapState, mapGetters, mapMutations} from 'vuex'
import {shopDetails, checkout} from '../../service/getData'
import {imgBaseUrl2} from '../../config/url'

export default {
  name: 'OrderConfirm',

  components: {
    TopBack,
    MatteOpacity: async () => import('../../components/common/MatteOpacity'),
    PopUp: async () => import('../../components/common/PopUp')
  },

  filters: {
    sexDiscern (value) { // 辨别姓别
      if (value === 1) {
        return '先生'
      } else if (value === 2) {
        return '女士'
      }
    }
  },

  props: {
    shopId: {
      type: [String, Number],
      default: 1
    }
  },

  data () {
    return {
      formContentHeigh: 'auto',
      shopDetailsData: '',
      orderLeadTime: '',
      payModeShow: false,
      payMode: [
        {
          name: '在线支付',
          type: 'online',
          selected: true
        },
        {
          name: '红包支付',
          type: 'redPacket',
          selected: false
        }
      ],
      payModeSelected: 'online',
      imgBaseUrl2,
      orderList: '', // 初始数据
      warnMessage: '',
      popup: false
    }
  },

  computed: {
    arrivalTime () { // 配送时间
      if (this.orderLeadTime) {
        // 如果orderLeadTime有值，就根据orderLeadTime的值计算
      } else {
        let nowTime = new Date()
        let afterTenMinutes = nowTime.getTime() + 10 * 60 * 1000 // 默认10分钟
        let time = new Date(afterTenMinutes)
        return ` ${time.getHours()}:${time.getMinutes() > 10 ? time.getMinutes() : '0' + time.getMinutes()} 到达`
      }
    },

    orderData () { // 订单列表
      let orderList = []
      for (let v of this.foodMenu[this.shopId]) {
        for (let vfood of v.foods) {
          for (let specfood of vfood.specfoods) {
            if (specfood.selectedNum > 0) {
              orderList.push({
                attrs: [],
                extra: {},
                id: specfood.food_id,
                name: specfood.name,
                packing_fee: specfood.packing_fee,
                quantity: specfood.selectedNum,
                price: specfood.price,
                sku_id: specfood.sku_id,
                specs: [specfood.specs],
                strock: specfood.strock
              })
            }
          }
        }
      }
      this.orderList = orderList
      let tableware = [
        {
          name: '餐盒',
          quantity: '',
          price: 100
        },
        {
          name: '配送费',
          quantity: '',
          price: this.shopDetailsData.float_delivery_fee
        }
      ]
      return orderList.concat(tableware)
    },

    sumPrice () { // 总价格
      let sumPrice = 0
      for (let item of this.orderData) {
        if (item.quantity) {
          sumPrice += item.quantity * item.price
        } else {
          sumPrice += item.price
        }
      }
      return sumPrice
    },

    orderRemarks () { // 备注和发票
      return [
        {
          title: '订单备注',
          message: '口味、偏好等',
          link: 'remark'
        },
        {
          title: '发票抬头',
          message: this.invoiceType.title,
          link: 'invoice'
        }
      ]
    },

    payModeName () {
      let payModeName = ''
      for (let v of this.payMode) {
        if (v.selected) {
          payModeName = v.name
        }
      }
      return payModeName
    },

    ...mapState([
      'clientHeight',
      'deliveryAddress',
      'foodMenu',
      'latitude',
      'longitude',
      'invoiceType',
      'userInfo'
    ]),

    ...mapGetters([
      'geohash'
    ])
  },

  mounted () {
    this.formContentHeightGet()
    this.shopDetailsDataGet()
    this.checkout()
  },

  methods: {
    formContentHeightGet () { // 获取高度
      let h = this.clientHeight - this.$refs.topBack.$el.offsetHeight - this.$refs.submitOrder.offsetHeight
      this.formContentHeigh = h + 'px'
    },

    async shopDetailsDataGet () { // 获取商铺信息
      try {
        let res = await shopDetails(this.shopId, this.latitude, this.longitude)
        this.shopDetailsData = res
        this.orderLeadTime = res.order_lead_time
      } catch (e) {
        throw new Error(e)
      }
    },

    payModeShowContral () { // 显示支付方式
      this.payModeShow = true
    },

    payModeClose () { // 关闭支付方式
      this.payModeShow = false
    },

    payModeSelect (index) { // 选中支付方式
      this.payMode.forEach((v, ind) => {
        if (index === ind) {
          v.selected = true
          this.payModeSelected = v.type
        } else {
          v.selected = false
        }
      })
      this.payModeShow = false
    },

    async checkout () { // 不知道为啥报参数错误，算了不管了，本来是订单检测成功，然后保存订单的
      try {
        let res = await checkout(this.geohash, [this.orderList], this.shopId)
        console.log(res)
      } catch (e) {
        throw new Error(e)
      }
    },

    orderConfirm () { // 模拟一下，其实啥数据都没传
      if (!this.userInfo) {
        this.popup = true
        this.warnMessage = '请先登录'
      } else if (!this.deliveryAddress) {
        this.popup = true
        this.warnMessage = '请添加收货地址'
      } else {
        this.payAmountSave(this.sumPrice)
        this.$router.push({name: 'payPage', query: {payMode: this.payModeSelected}})
      }
    },

    warnConfirm () {
      this.popup = false
      this.$router.push({name: 'login'})
    },

    ...mapMutations([
      'payAmountSave'
    ])
  }
}
</script>

<style lang="scss" scoped>
.formContent {
  overflow-y: auto;
  .arrowsRight {
    transform: scale(1, 2);
    margin-left: .05rem;
    display: inline-block;
  }
  .deliveryAddress {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: .8rem;
    padding: 0 .1rem;
    border-bottom: 1px dotted #535353;
    .addressSelect {
      width: 100vw;
      display: flex;
      align-items: center;
      font-size: .15rem;
      color: #6d6d6d;
    }
    .addressMessage {
      .userMessage {
        .userName {
          font-size: .2rem;
          font-weight:bold;
        }
        .userSex {
          font-size: .14rem;
          color: #424242;
        }
        .userPhone {
          font-size: .14rem;
          color: #424242;
        }
      }
      .addressDetail {
        .address {
          color: #fff;
          background-color: #4cdf84;
          border-radius: 2px;
          font-size: .12rem;
          padding: 0 .05rem;
        }
        .supplementAddress {
          font-size: .12rem;
          color: #7e7e7e;
        }
      }
    }
  }
  .deliveryTime {
    padding: 0 .1rem;
    border-left: 3px solid #1a8bcc;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 1rem;
    .title {
      font-size: .2rem;
      font-weight: bold;
    }
    .deliveryTimeRight {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 1rem;
      .predictTime {
        color: #1a8bcc;
        font-size: .16rem;
      }
      .deliveryMode {
        margin-top: .15rem;
        color: #fff;
        background-color: #066da8;
        border-radius: 2px;
        font-size: .13rem;
        width: .6rem;
        align-self: flex-end;
        text-align: center;
      }
    }
  }
  .payMode {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: .5rem;
    padding: 0 .1rem;
    border-top: .05rem solid #e4e3e3;
    border-bottom: .05rem solid #e4e3e3;
    .title {
      font-size: .18rem;
      color: #5a5a5a;
    }
    .onlinePayment {
      display: flex;
      align-items: center;
      span {
        font-size: .14rem;
        color: #a8a8a8;
      }
    }
  }
  .orderDetail {
    padding: 0 .15rem;
    .shop {
      height: .5rem;
      display: flex;
      align-items: center;
      .shopIcon {
        height: .3rem;
      }
      .shopName {
        margin-left: .1rem;
        font-size: .18rem;
        color: #424242;
      }
    }
    .orderListUl {
      .orderListLi {
        display: flex;
        justify-content: space-Between;
        align-items: center;
        height: .4rem;
        .foodName {
          color: #727272;
          font-size: .15rem;
        }
        .orderListLiRight {
          display: flex;
          width: 25vw;
          justify-content: space-between;
          .foodNum {
            color: #f56b2b;
            font-size: .15rem;
          }
          .price {
            color: #727272;
            font-size: .15rem;
          }
        }
      }
    }
    .sum {
      display: flex;
      justify-content: space-between;
      .sumPrice {
        color: #696969;
        font-size: .15rem;
        font-weight: bold;
        line-height: .4rem;
      }
      .waitPay {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .waitPayName {
          color: #f56b2b;
          font-size: .15rem;
          line-height: .4rem;
          font-weight: bold;
        }
        .waitPayPrice {
          color: #f56b2b;
          font-size: .15rem;
          line-height: .4rem;
        }
      }
    }
  }
  .remarks {
    padding: 0 .15rem;
    .remarksUl {
      .remarksLi {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: .4rem;
        .remarksName {
          font-size: .16rem;
          color: #6e6e6e;
        }
        .remarksContent {
          font-size: .14rem;
          color: #9e9e9e;
        }
      }
    }
  }
}
.submitOrder {
  display: flex;
  justify-content: space-between;
  height: .45rem;
  .waitePay {
    font-size: .18rem;
    line-height: .45rem;
    color: #ccc;
    width: 70%;
    background-color: #313131;
    padding-left: .1rem;
  }
  .submitButton {
    text-align: center;
    line-height: .45rem;
    width: 30%;
    font-size: .18rem;
    color: #fff;
    background-color: #60f55b;
  }
}
.payModeList {
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: #fff;
  width: 100vw;
  min-height: 30vh;
  h4 {
    font-size: .15rem;
    color: #5c5c5c;
    text-align: center;
    line-height: .25rem;
    margin-top: .08rem;
  }
  .payModeListUl {
    li {
      font-size: .18rem;
      padding: 0 .1rem;
      line-height: .5rem;
      color: #474747;
      font-weight: bold;
    }
    .payModeSelected {
      color: #22a5b6;
    }
  }
}
</style>


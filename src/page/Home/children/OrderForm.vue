<template>
  <div>
    <TopBack title="我的订单" ref="topBack"></TopBack>
    <section class="orderForm" :style="{height: orderFormHeight + 'px'}">
      <ul class="orderFormUl">
        <router-link
          v-for="item in orderListData"
          :key="item.id"
          :to="{name: 'orderFormDetail', params: {orderId: item.id}}"
          tag="li"
          class="orderFormLi">
          <span class="headIcon">
            <img :src="`${imgBaseUrl2}${item.restaurant_image_url}`">
          </span>
          <section class="orderFormContent">
            <header class="orderFormTop">
              <h3>{{item.restaurant_name}}</h3>
              <span>{{item.status_bar.title}}</span>
            </header>
            <section class="orderDate">
              <time>{{item.formatted_created_at}}</time>
            </section>
            <section class="orderFormBottom">
              <p>{{item.basket.group[0][0].name}}等{{item.basket.group.length}}件商品</p>
              <span>￥{{item.basket | sumPrice}}</span>
            </section>
            <footer class="overtime">
              <span v-if="item.interval > 0" class="countDown">剩余支付时间：{{item.remainingTime}}</span>
              <router-link
                v-else
                tag="span"
                class="again"
                event="touchend"
                :to="{name: 'order', params: {id: item.restaurant_id}}">再来一单</router-link>
            </footer>
          </section>
        </router-link>
      </ul>
    </section>
    <matte-opacity v-if="!userInfo"></matte-opacity>
    <pop-up v-if="!userInfo" warnMessage="请先登录" @warnConfirm="linkLogin"></pop-up>
    <transition name="right-slide-transform">
      <router-view></router-view>
    </transition>
    <loading v-if="loading"></loading>
  </div>
</template>

<script>
import TopBack from '../../../components/common/TopBack'
import {orderListGet} from '../../../service/getData'
import {mapState} from 'vuex'
import {imgBaseUrl2} from '../../../config/url'

export default {
  name: 'OrderForm',

  components: {
    TopBack,
    MatteOpacity: async () => import('../../../components/common/MatteOpacity'),
    PopUp: async () => import('../../../components/common/PopUp'),
    loading: async () => import('../../../components/common/loading')
  },

  filters: {
    sumPrice (basket) { // 计算总价
      let deliverFee = basket.deliver_fee.price
      let foodFee = 0
      for (let v1 of basket.group) {
        for (let v2 of v1) {
          foodFee += v2.price * v2.quantity
        }
      }
      let packingFee = basket.packing_fee.price * basket.packing_fee.quantity
      return deliverFee + foodFee + packingFee
    }
  },

  props: {
    btmNavH: {
      type: Number,
      default: 0
    }
  },

  data () {
    return {
      offset: 0,
      orderListData: '',
      imgBaseUrl2,
      orderFormHeight: 0,
      loading: false
    }
  },

  computed: {
    ...mapState([
      'userInfo',
      'clientHeight'
    ])
  },

  mounted () {
    this.orderList()
    this.orderFormHeightGet()
  },

  methods: {
    async orderList () { // 订单列表获取
      try {
        if (!this.userInfo) return
        this.loading = true
        let res = await orderListGet(this.userInfo.user_id, this.offset)
        res.forEach((item) => {
          item.interval = new Date(item.formatted_created_at).getTime() + 15 * 60 * 1000 - new Date().getTime()
          item.remainingTime = 0
          this.countDown(item)
        })
        this.orderListData = res
        this.loading = false
      } catch (e) {
        throw new Error(e)
      }
    },

    countDown (item) { // 支付倒计时
      let timer = setInterval(() => {
        let time = new Date(item.formatted_created_at).getTime() + 15 * 60 * 1000 - new Date().getTime()
        if (time < 0) {
          item.interval = 0
          clearInterval(timer)
        } else {
          let minute = parseInt(time / (1000 * 60))
          let second = parseInt(time % (1000 * 60) / 1000)
          item.remainingTime = `${minute > 9 ? minute : '0' + minute}分${second > 9 ? second : '0' + second}秒`
        }
      }, 1000)
    },

    orderFormHeightGet () { // 计算高度
      this.orderFormHeight = this.clientHeight - this.btmNavH - this.$refs.topBack.$el.offsetHeight
    },

    linkLogin () {
      this.$router.push({name: 'login'})
    }
  }
}
</script>

<style lang="scss" scoped>
  %bc {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .orderForm {
    background-color: #dfdfdf;
    overflow: auto;
    .orderFormUl {
      .orderFormLi {
        display: flex;
        margin: .1rem 0;
        background-color: #fff;
        padding: .1rem .15rem;
        .headIcon {
          width: 15%;
          img {
            width: 100%;
          }
        }
        .orderFormContent {
          width: 85%;
          margin-left: .1rem;
          .orderFormTop {
            @extend %bc;
            h3 {
              font-size: .17rem;
              color: #363636;
            }
            span {
              font-size: .13rem;
              color: #363636;
            }
          }
          .orderDate {
            @extend %bc;
            time {
              font-size: .12rem;
              color: #a7a7a7;
            }
          }
          .orderFormBottom {
            @extend %bc;
            line-height: .5rem;
            p {
              font-size: .14rem;
              color: #666;
            }
            span {
              font-size: .14rem;
              color: #fca017;
              font-weight: bold;
            }
          }
          .overtime {
            display: flex;
            justify-content: flex-end;
            font-size: .14rem;
            .countDown {
              color: #e9b117;
              border: 1px solid #e9b117;
              border-radius: .04rem;
              padding: 0 .04rem;
            }
            .again {
              color: #36c2d4;
              border: 1px solid #36c2d4;
              border-radius: .04rem;
              padding: 0 .04rem;
            }
          }
        }
      }
    }
  }
</style>


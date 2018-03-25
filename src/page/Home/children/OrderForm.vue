<template>
  <div>
    <TopBack title="我的订单"></TopBack>
    <section class="orderForm">
      <ul class="orderFormUl">
        <li
          v-for="item in orderListData"
          :key="item.id"
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
              <span v-if="new Date() - new Date(item.formatted_created_at) > 0" class="countDown">{{item.formatted_created_at}}</span>
              <span v-else class="again">再来一单</span>
            </footer>
          </section>
          </li>
      </ul>
    </section>
    <transition name="right-slide-transform">
      <router-view></router-view>
    </transition>
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
    TopBack
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
    },

    countDown (createDate) {
      let timer = setInterval(() => {
        let time = new Date() - new Date(createDate)
        if (time < 0) {
          clearInterval(timer)
          return
        } else {
          let minute = parseInt(time / (1000 * 60))
          let second = parseInt(time % (1000 * 60) / 1000)
          // 返回值返回不出去啊，咋办
        }
      }, 1000)
    }
  },

  data () {
    return {
      offset: 0,
      orderListData: '',
      imgBaseUrl2
    }
  },

  computed: {
    ...mapState([
      'userInfo'
    ])
  },

  mounted () {
    this.orderList()
  },

  methods: {
    async orderList () { // 订单列表获取
      try {
        let res = await orderListGet(this.userInfo.user_id, this.offset)
        console.log(res)
        this.orderListData = res
      } catch (e) {
        throw new Error(e)
      }
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


<template>
  <div class="payPage">
    <top-back title="支付"></top-back>
    <section class="payTypeContainer">
      <p v-if="overtime" class="overtime">支付超时，请重新下单</p>
      <section v-else class="countDown">
        <h3>支付剩余时间：</h3>
        <div class="time">{{time}}</div>
      </section>
      <ul v-if="$route.query.payMode === 'online'" class="payTypeUl">
        <v-touch
          v-for="(item, index) in payDataOnline"
          :key="item.name"
          tag="li"
          class="payTypeLi"
          :class="{payTypeLiSelected: item.selected}"
          @tap="payTypeSelect(payDataOnline, index)">
          {{item.name}}
        </v-touch>
      </ul>
      <ul v-if="$route.query.payMode === 'redPacket'" class="payTypeUl">
        <v-touch
          v-for="(item, index) in payDataRedPacket"
          :key="item.name"
          tag="li"
          class="payTypeLi"
          :class="{payTypeLiSelected: item.selected}"
          @tap="payTypeSelect(payDataRedPacket, index)">
          {{item.name}}
        </v-touch>
      </ul>
      <v-touch
        tag="section"
        class="confirm"
        @tap="payConfirm">确定</v-touch>
    </section>
    <matte-opacity v-if="popup"></matte-opacity>
    <pop-up
      v-if="popup"
      :warnMessage="warnMessage"
      @warnConfirm="warnConfirm"></pop-up>
  </div>
</template>

<script>
import TopBack from '../../../components/common/TopBack'
import {mapState} from 'vuex'

export default {
  name: 'payPage',

  components: {
    TopBack,
    MatteOpacity: () => import('../../../components/common/MatteOpacity'),
    PopUp: () => import('../../../components/common/PopUp')
  },

  data () {
    return {
      payDataOnline: [
        {
          name: '支付宝',
          selected: true
        },
        {
          name: '微信支付',
          selected: false
        }
      ],
      payDataRedPacket: [
        {
          name: '红包',
          selected: true
        }
      ],

      warnMessage: '',
      popup: false,
      time: '',
      overtime: false // 支付是否超时
    }
  },

  computed: {
    ...mapState([
      'orderTime',
      'orderData'
    ])
  },

  mounted () {
    this.timeRemaining()
  },

  methods: {
    payTypeSelect (payData, index) { // 支付方式选择
      payData.forEach((v, ind) => {
        if (index === ind) {
          v.selected = true
        } else {
          v.selected = false
        }
      })
    },

    payConfirm () {
      this.popup = true
      this.warnMessage = '不支持支付'
    },

    warnConfirm () {
      this.popup = false
      this.$router.push({name: 'orderForm'})
    },

    timeRemaining () {
      let payTime = 0
      if (this.orderTime) {
        payTime = this.orderTime
      } else {
        payTime = new Date().getTime() + 10 * 60 * 1000
        // 需要保存倒计时，但是还缺订单号
      }
      let timer = setInterval(() => {
        let nowTime = new Date().getTime()
        let MS = payTime - nowTime
        let minute = parseInt(MS / (1000 * 60))
        let second = parseInt(MS % (1000 * 60) / 1000)
        this.time = `${minute >= 10 ? minute : '0' + minute} 分钟 ${second >= 10 ? second : '0' + second} 秒`
        if (MS <= 0) {
          clearInterval(timer)
          this.overtime = true
        }
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
  .payPage {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: #fff;
    .payTypeContainer {
      .overtime {
        font-size: .16rem;
        color: #c72c2c;
        padding: .15rem;
      }
      .countDown {
        padding: .15rem;
        display: flex;
        h3 {
          font-size: .16rem;
          color: #444;
        }
        .time {
          font-size: .15rem;
          color: #24a6b8;
        }
      }
      .payTypeUl {
        .payTypeLi {
          font-size: .25rem;
          color: #535353;
          height: .5rem;
          line-height: .5rem;
          padding: .15rem;
          border-bottom: .05rem solid #e2e2e2;
        }
        .payTypeLiSelected {
          color: #1db1b1;
        }
      }
      .confirm {
        width: 95%;
        height: .4rem;
        background-color: #1db14e;
        margin: 0 auto;
        line-height: .4rem;
        text-align: center;
        border-radius: 5px;
        color: #fff;
        margin-top: .1rem;
      }
    }
  }
</style>

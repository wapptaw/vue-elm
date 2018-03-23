<template>
  <div class="payPage">
    <top-back title="支付"></top-back>
    <section class="payTypeContainer">
      <section>
        <h3>支付剩余时间：</h3>
        <div>{{time}}</div>
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

export default {
  name: 'payPage',

  components: {
    TopBack,
    MatteOpacity: async () => import('../../../components/common/MatteOpacity'),
    PopUp: async () => import('../../../components/common/PopUp')
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
      time: ''
    }
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
      let payTime = new Date().getTime() + 15 * 60 * 1000
      let timer = setInterval(() => {
        let nowTime = new Date().getTime()
        let MS = payTime - nowTime
        let minute = parseInt(MS / (1000 * 60))
        let second = parseInt(MS % (1000 * 60) / 1000)
        this.time = `${minute > 10 ? minute : '0' + minute}分钟 ${second > 10 ? second : '0' + second}秒`
        // 判断事件到了后的事件
      })
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

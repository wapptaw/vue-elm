<template>
  <div class="shopSafe">
    <TopBack title="食品监督安全公示" @heightGet="topBackHeightGet"></TopBack>
    <div :style="{height: shopSafeHeight, overflowY: 'auto'}">
    <section class="result">
      <h2>食品监督安全公示</h2>
      <section class="safeResult">
        <img v-if="shopDetailsData.status == 1" src="" alt="好">
        <img v-else src="" alt="差">
        <section class="safeContent">
          <div class="examineResult">
            <span>监督检查结果：</span>
            <span v-if="shopDetailsData.status == 1" class="shopStatusH">良好</span>
            <span v-else class="shopStatusB">差</span>
          </div>
          <div class="date">
            <span>检查日期：</span>
            <time></time>
          </div>
        </section>
      </section>
    </section>
    <section class="message">
      <h2>工商登记信息</h2>
      <section class="messages">
        <span>企业名称：{{shopDetailsData.company_name}}</span>
        <span>工商执照注册号：{{shopDetailsData.registered_number}}</span>
        <span>注册资本：</span>
        <span>注册地址：{{shopDetailsData.registered_address}}</span>
        <span>属地监管所：{{shopDetailsData.identificate_agency}}</span>
        <span>法定代表人：{{shopDetailsData.legal_person}}</span>
        <span>经营范围：{{shopDetailsData.licenses_scope}}</span>
      </section>
    </section>
    <section class="licence">
      <h2>餐饮许可证</h2>
      <section class="licences">
        <span>营业范围：</span>
        <span>许可证有效期：{{shopDetailsData.legal_person}}</span>
        <span>许可证号：{{shopDetailsData.licenses_scope}}</span>
        <span>发证时间：{{shopDetailsData.licenses_date}}</span>
      </section>
    </section>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: 'shopSafe',

  components: {
    TopBack: async () => import('../../../../components/common/TopBack')
  },

  data () {
    return {
      topBackH: 0
    }
  },

  computed: {
    shopSafeHeight () {
      return this.clientHeight - this.topBackH + 'px'
    },

    ...mapState([
      'shopDetailsData',
      'clientHeight'
    ])
  },

  methods: {
    topBackHeightGet (H) {
      this.topBackH = H
    }
  }
}
</script>

<style lang="scss" scoped>
  .result, .message, .licence {
    padding: 0 .1rem;
  }
  .shopSafe {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #fff;
    h2 {
      font-size: .16rem;
      color: #292929;
      height: .4rem;
      line-height: .4rem;
      border-bottom: 1px solid #e2e2e2;
    }
    .result {
      .safeResult {
        display: flex;
        align-items: center;
        img {
          //
        }
        .safeContent {
          margin-left: .15rem;
          font-size: .14rem;
          color: #707070;
          .examineResult {
            line-height: 2.5em;
            .shopStatusH {
              color: #55e629;
            }
            .shopStatusB {
              color: #d83d3d;
            }
          }
        }
        .date {
          line-height: 2.5em;
          time {
            color: #1487aa;
          }
        }
      }
    }
    .message {
      border-top: .1rem solid #e2e2e2;
      border-bottom: .1rem solid #e2e2e2;
      .messages {
        display: flex;
        flex-direction: column;
        padding: 0 .1rem;
        span {
          font-size: .14rem;
          color: #707070;
          line-height: 2.5em;
        }
      }
    }
    .licence {
      .licences {
        display: flex;
        flex-direction: column;
        padding: 0 .1rem;
        span {
          font-size: .14rem;
          color: #707070;
          line-height: 2.5em;
        }
      }
    }
  }
</style>


<template>
  <div class="shopDetails" :style="{height: shopDetailsHeight, overflowY: 'auto'}">
    <section class="actives">
      <h2>活动与属性</h2>
      <ul class="ulActive">
        <li
          v-for="active in actives"
          :key="active.id"
          class="active">
          <span
            class="activeIcon"
            :style="{backgroundColor: `#${active.icon_color}`}">{{active.icon_name}}</span>
          <p class="activeContent">{{active.description}}</p>
        </li>
      </ul>
    </section>
    <section class="safe">
      <header class="safeTitle">
        <h2>食品监督安全公示</h2>
        <router-link tag="span" :to="{name: 'shopSafe'}" class="safeDetail">企业认证详情></router-link>
      </header>
      <section class="safeMessage">
        <img v-if="shopDetailsData.status == 1" src="" alt="好">
        <img v-else src="" alt="差">
        <section class="safeResult">
          <div class="result">
            <span>监督检查结果：</span>
            <span v-if="shopDetailsData.status == 1" class="shopStatusH">良好</span>
            <span v-else class="shopStatusB">差</span>
          </div>
          <div class="date">
            <span>检查日期：</span>
            <time>{{shopDetailsData.identification.identificate_date}}</time>
          </div>
        </section>
      </section>
    </section>
    <section class="detail">
      <h2>商家信息</h2>
      <section class="shopMessage">
        <h3 class="shopName">{{shopDetailsData.name}}</h3>
        <p class="address">{{shopDetailsData.address}}</p>
        <span class="opendingHours">营业时间：{{shopDetailsData.opening_hours[0]}}</span>
        <span class="busunessLicense">
          <span>营业执照：</span>
          <img :src="`${imgBaseUrl2}${shopDetailsData.business_license_image}`" alt="营业执照">
        </span>
        <span class="serviceLicense">
          <span>餐饮服务许可证：</span>
          <img :src="`${imgBaseUrl2}${shopDetailsData.catering_service_license_image}`" alt="餐饮许可证">
        </span>
      </section>
    </section>
    <transition name="right-slide-transform">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {imgBaseUrl2} from '../../../config/url'

export default {
  name: 'merchant',

  data () {
    return {
      imgBaseUrl2,
      shopDetailsShow: true
    }
  },

  computed: {
    actives () {
      let actives = this.shopDetailsData.activities.concat(this.shopDetailsData.supports)
      return actives
    },

    shopDetailsHeight () {
      return `${this.clientHeight - this.detailsHeight}px`
    },

    ...mapState([
      'shopDetailsData',
      'clientHeight',
      'detailsHeight'
    ])
  }
}
</script>


<style lang="scss" scoped>
  .shopDetails {
    h2 {
      font-size: .16rem;
      color: #292929;
      height: .4rem;
      line-height: .4rem;
      border-bottom: 1px solid #e2e2e2;
    }
    .actives, .safe, .detail {
      padding: 0 .1rem;
      padding-bottom: .2rem;
    }
    .actives {
      border-top: .05rem solid #e2e2e2;
      .ulActive {
        .active {
          display: flex;
          align-items: center;
          height: .3rem;
          margin-top: .1rem;
          .activeIcon {
            font-size: .14rem;
            color: #fff;
            line-height: 1.5em;
            padding: 0 .03rem;
            border-radius: 3px;
          }
          .activeContent {
            margin-left: .1rem;
            font-size: .13rem;
            color: #707070;
          }
        }
      }
    }
    .safe {
      border-top: .1rem solid #e2e2e2;
      border-bottom: .1rem solid #e2e2e2;
      .safeTitle {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        .safeDetail {
          font-size: .15rem;
          color: #aaa;
        }
      }
      .safeMessage {
        display: flex;
        align-items: center;
        padding-top: .1rem;
        img {
          //
        }
        .safeResult {
          margin-left: .15rem;
          span {
            font-size: .14rem;
            color: #707070;
            line-height: 2.5em;
          }
          .result {
            .shopStatusH {
              color: #55e629;
            }
            .shopStatusB {
              color: #d83d3d;
            }
          }
          .date {
            time {
              color: #1487aa;
            }
          }
        }
      }
    }
    .detail {
      .shopMessage {
        display: flex;
        flex-direction: column;
        padding-top: .1rem;
        .shopName, .address, span {
          color: #707070;
          font-size: .14rem;
          line-height: 4.5em;
        }
        .busunessLicense, .serviceLicense {
          vertical-align: center;
        }
        img {
          max-height: .3rem;
        }
      }
    }
  }
</style>

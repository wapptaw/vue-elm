<template>
  <div>
    <top-Back title="我的"></top-Back>
    <router-link
      :to="{name: 'login'}"
      event="touchend"
      tag="section"
      class="userMessage">
      <section class="userMessageLeft">
        <span class="userIconSpan">
          <svg width="60" height="50" xmlns="http://www.w3.org/2000/svg">
            <g>
              <title>Layer 1</title>
              <path fill="#fff" stroke="#000" stroke-width="1.5" opacity="0.5" d="m177.5,194.5c0,0 -10,-6 19,-21c29,-15 25,-19 38,-25" id="svg_2"/>
            </g>
            <g>
              <title>background</title>
              <rect x="-1" y="-1" width="62" height="52" id="canvas_background" fill="none"/>
              <g id="canvasGrid" display="none">
                <rect id="svg_1" width="100%" height="100%" x="0" y="0" stroke-width="0" fill="url(#gridpattern)"/>
              </g>
              <path stroke="#000" fill="#939393" stroke-width="0" d="m42.315065,17.465797c-3.697289,-3.111021 0.706587,-8.074633 -1.246508,-10.809887c-1.955396,-2.735253 -2.735253,-4.557222 -7.034823,-5.861585s-2.732953,-1.044411 -5.859285,-0.910985c-3.126332,0.131127 -5.732759,1.821968 -5.732759,2.732953c0,0 -1.953095,0.131127 -2.732953,0.913285c-0.782158,0.782158 -2.084222,4.426095 -2.084222,5.33938s0.651031,7.034823 1.302064,8.336886l-0.775256,0.259952c-0.651031,7.552428 2.604126,8.465713 2.604126,8.465713c1.170937,7.034823 2.344174,4.039617 2.344174,5.861585s-1.173237,1.173237 -1.173237,1.173237s-1.03981,2.864079 -3.643937,3.90619c-2.604126,1.03981 -17.06025,6.639142 -18.235788,7.81238c-1.175538,1.175538 -1.04211,6.643744 -1.04211,6.643744l61.990637,0c0,0 0.135727,-5.468206 -1.03981,-6.643744c-1.177839,-1.175538 -15.633962,-6.77257 -18.238089,-7.81238c-2.604126,-1.04211 -3.643937,-3.90619 -3.643937,-3.90619s-1.173237,0.648731 -1.173237,-1.173237s1.173237,1.173237 2.346475,-5.861585c0,0 3.252858,-0.913285 2.604126,-8.465713" id="svg_7"/>
            </g>
          </svg>
        </span>
        <section class="userDetail">
          <span class="userName">登录/注册</span>
          <span class="userPhone">暂无绑定手机号</span>
        </section>
      </section>
      <span class="userMessageRight">&gt</span>
    </router-link>
    <section class="userAsset">
      <ul class="userAssetUl">
        <li
          v-for="item in userAsset"
          :key="item.name"
          class="userAssetLi">
          <section class="userAssetDetail">
            <span class="userAssetNum" :style="{color: item.colorText}">{{item.number}}</span>
            <span class="unit">{{item.unit}}</span>
          </section>
          <h4 class="userAssentName">{{item.name}}</h4>
        </li>
      </ul>
    </section>
    <section class="userMore">
      <ul class="userMoreUl">
        <li
          v-for="item in userMore"
          :key="item.name"
          class="userMoreLi">
          <img src="" alt="" class="userMoreIcon">
          <span class="userMoreDetail">{{item.name}}</span>
        </li>
      </ul>
      <ul class="support">
        <li
          v-for="item in support"
          :key="item.name"
          class="supportLi">
          <img src="" alt="" class="supportIcon">
          <span class="supportDetail">{{item.name}}</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import TopBack from '../../../components/common/TopBack'

export default {
  name: 'user',

  components: {
    TopBack
  },

  data () {
    return {
      userAsset: [
        {
          name: '我的余额',
          number: '0.00',
          unit: '元',
          colorText: '#e98330'
        },
        {
          name: '我的优惠',
          number: 0,
          unit: '个',
          colorText: '#e94630'
        },
        {
          name: '我的积分',
          number: 0,
          unit: '分',
          colorText: '#30b5e9'
        }
      ],
      userMore: [
        {
          name: '我的订单'
        },
        {
          name: '积分商城'
        },
        {
          name: '饿了么会员卡'
        }
      ],
      support: [
        {
          name: '服务中心'
        },
        {
          name: '下载饿了么APP'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
  .userMessage {
    height: .9rem;
    background-color: #228ed6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 .1rem;
    border-top: 1px solid #9b9b9b;
    .userMessageLeft {
      display: flex;
      width: 100%;
      .userIconSpan {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #dbdbdb;
        border-radius: .1rem;
        height: .6rem;
      }
      .userDetail {
        margin-left: .05rem;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .userName {
          display: block;
          font-size: .18rem;
          color: #fff;
          font-weight: bold;
        }
        .userPhone {
          display: block;
          font-size: .13rem;
          color: #fff;
        }
      }
    }
    .userMessageRight {
      font-size: .2rem;
      color: #c9c9c9;
      transform: scale(1, 2);
    }
  }
  .userAsset {
    padding: 0 .2rem;
    border-bottom: .08rem solid #ebebeb;
    .userAssetUl {
      height: .9rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .userAssetLi {
        text-align: center;
        .userAssetDetail {
          .userAssetNum {
            font-size: .25rem;
            font-weight: bold;
          }
          .unit {
            font-size: .13rem;
            color: #686868;
          }
        }
        .userAssentName {
          font-size: .12rem;
          color: #757575;
        }
      }
    }
  }
  .userMore {
    padding: 0 .1rem;
    .userMoreUl {
      border-bottom: .08rem solid #ebebeb;
      .userMoreLi {
        border-bottom: 1px solid #ebebeb;
        .userMoreIcon {
          //
        }
        .userMoreDetail {
          font-size: .14rem;
          color: #424242;
          line-height: .35rem;
        }
      }
    }
    .support {
      .supportLi {
        border-bottom: 1px solid #ebebeb;
        .supportIcon {
          //
        }
        .supportDetail {
          font-size: .14rem;
          color: #424242;
          line-height: .35rem;
        }
      }
    }
  }
</style>

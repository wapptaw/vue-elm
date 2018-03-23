<template>
  <transition name="right-slide-transform">
    <div class="userInfoPage">
      <top-back title="账户信息"></top-back>
      <section class="userInfo">
        <div class="headIcon userInfoItem">
          <h4 class="headIconText">头像</h4>
          <span class="rightInfo">
            <img :src="`${imgBaseUrl2}${userInfo.avatar}`" class="headIconImg">
            <span class="skipIcon">&gt;</span>
          </span>
        </div>
        <div class="userName userInfoItem">
          <h4>用户名</h4>
          <span class="rightInfo">
            <span class="userNameText">{{userInfo.username}}</span>
            <span class="skipIcon">&gt;</span>
          </span>
        </div>
        <router-link
          :to="{name: 'deliveryAddress'}"
          tag="div"
          event="touchend"
          class="address userInfoItem">
          <h4>收货地址</h4>
          <span class="skipIcon">&gt;</span>
        </router-link>
        <dl class="account">
          <dt>账号绑定</dt>
          <dd class="userInfoItem">
            <span class="rightInfo">
              <span></span>
              <h4>手机</h4>
            </span>
            <span class="skipIcon">&gt;</span>
          </dd>
          <dt>安全设置</dt>
          <router-link
            :to="{name: 'resetPassword'}"
            tag="dd"
            class="userInfoItem">
            <h4>登录密码</h4>
            <span class="rightInfo">
              <span class="removePassword">修改</span>
              <span class="skipIcon">&gt;</span>
            </span>
          </router-link>
        </dl>
        <v-touch 
          tag="footer"
          class="logout"
          @tap="logout">退出登录</v-touch>
      </section>
    </div>
  </transition>
</template>

<script>
import {mapState} from 'vuex'
import TopBack from '../../../../components/common/TopBack'
import {imgBaseUrl2} from '../../../../config/url'
import {signout} from '../../../../service/getData'

export default {
  name: 'userInfo',

  components: {
    TopBack
  },

  data () {
    return {
      imgBaseUrl2
    }
  },

  computed: {
    ...mapState([
      'userInfo'
    ])
  },

  methods: {
    async logout () { // 退出登录
      try {
        let res = await signout() // 退出登录是不可能成功的，因为我压根都没登陆上，所以就不模拟了
        res.slice()
        this.$router.go(-1)
      } catch (e) {
        throw new Error(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .userInfoPage {
    position: fixed;
    left: 0;
    top: 0;
    background-color: #d6d6d6;
    width: 100%;
    height: 100%;
    .userInfo {
      margin-top: .1rem;
      h4 {
        font-size: .15rem;
        color: #313131;
      }
      dt {
        font-size: .14rem;
        color: #4d4d4d;
        padding: .04rem .1rem;
      }
      .userInfoItem {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #fff;
        padding: .1rem .1rem;
        margin: 1px 0;
        .rightInfo {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          .headIconImg {
            width: 25%;
            height: 100%;
            border-radius: .1rem;
          }
          .userNameText {
            font-size: .15rem;
            color: #888;
          }
          .removePassword {
            font-size: .15rem;
            color: #acacac;
          }
        }
        .skipIcon {
          font-size: .16rem;
          color: #b1b1b1;
          transform: scale(1, 2);
          margin-left: .1rem;
        }
      }
    }
    .logout {
      width: 95%;
      font-size: .15rem;
      color: #fff;
      margin: 0 auto;
      text-align: center;
      line-height: .4rem;
      background-color: #b83a3a;
      border-radius: .05rem;
      margin-top: .1rem;
    }
  }
</style>


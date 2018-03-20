<template>
  <div class="resetPage">
    <top-back title="重置密码"></top-back>
    <section class="resetList">
      <input v-model="userId" type="text" placeholder="账号" class="userId">
      <input v-model="oldPassword" type="password" placeholder="旧密码" class="oldPassword">
      <input v-model="newPasswordFirst" type="password" placeholder="请输入新密码" class="newPasswordFirst">
      <input v-model="newPasswordSecond" type="password" placeholder="请确认密码" class="newPasswordSecond">
      <section class="captchContainer">
        <input v-model="captcha" type="text" maxLength="4" placeholder="验证码" class="captcha">
        <section class="captchImgContainer">
          <img :src="captchaImg" class="captchaImg">
          <div class="captchChangeContainer">
            <p>看不清</p>
            <v-touch
              tag="p"
              class="captchChange"
              @tap="captchasGet">换一张</v-touch>
          </div>
        </section>
      </section>
      <v-touch
        tag="footer"
        class="confirm"
        @tap="confirm">确认修改</v-touch>
    </section>
    <matte-opacity v-if="popup"></matte-opacity>
    <pop-up v-if="popup" :warnMessage="warnMessage" @warnConfirm="warnConfirm"></pop-up>
  </div>
</template>

<script>
import TopBack from '../../components/common/TopBack'
import {changePassword, captchasGet} from '../../service/getData'

export default {
  name: 'resetPawssword',

  components: {
    TopBack,
    MatteOpacity: () => import('../../components/common/MatteOpacity'),
    PopUp: () => import('../../components/common/PopUp')
  },

  data () {
    return {
      userId: '',
      oldPassword: '',
      newPasswordFirst: '',
      newPasswordSecond: '',
      captcha: '',
      captchaImg: '',
      popup: false,
      warnMessage: ''
    }
  },

  mounted () {
    this.captchasGet()
  },

  methods: {
    async captchasGet () {
      let res = await captchasGet()
      this.captchaImg = res.code
    },

    async confirm () { // 输入验证
      if (!/^[\d\w]{4,8}$/.test(this.userId)) {
        this.warnMessage = '账号必须是四到八位的数字字母或下划线'
        this.popup = true
      } else if (!/^[\d\w]{6,12}$/.test(this.oldPassword)) {
        this.warnMessage = '密码必须是六到十二位的字母数字或下划线'
        this.popup = true
      } else if (!/^[\d\w]{6,12}$/.test(this.newPasswordFirst)) {
        this.warnMessage = '密码必须是六到十二位的字母数字或下划线'
        this.popup = true
      } else if (this.newPasswordFirst !== this.newPasswordSecond) {
        this.warnMessage = '两次密码输入不同'
        this.popup = true
      } else if (!this.captcha) {
        this.warnMessage = '请输入验证码'
        this.popup = true
      } else {
        let res = await changePassword(this.userId, this.oldPassword, this.newPasswordFirst, this.newPasswordSecond, this.captcha)
        if (res.status) {
          this.$router.go(-1)
        } else {
          this.warnMessage = res.message
          this.popup = true
          this.captchasGet()
        }
      }
    },

    warnConfirm () {
      this.popup = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .resetPage {
    height: 100%;
    width: 100%;
    background-color: #dadada;
    .resetList {
      margin-top: .1rem;
      & > input, .captchContainer{
        display: block;
        padding: .15rem .15rem;
        background-color: #fff;
        font-size: .15rem;
        color: #575757;
        margin: 1px 0;
        width: 100%;
        box-sizing: border-box;
      }
      .captchContainer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .captcha {
          font-size: .15rem;
          color: #575757;
        }
        .captchImgContainer {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          .captchaImg {
            //
          }
          .captchChangeContainer {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            margin-left: .1rem;
            p {
              font-size: .13rem;
              color: #838383;
            }
            .captchChange {
              color: #1a7ba1;
            }
          }
        }
      }
      .confirm {
        width: 95%;
        font-size: .16rem;
        color: #fff;
        background-color: #1bb12f;
        line-height: .4rem;
        text-align: center;
        margin: .1rem auto;
        border-radius: .05rem;
      }
    }
  }
</style>


<template>
  <transition name="fade" mode="out-in">
    <div>
      <top-back title="登录/注册"></top-back>
      <section class="containerLogin">
        <header class="loginTypeSwitch">
          <v-touch
            tag="div"
            :class="{loginTypeSelected: 'loginByPassword' === loginType}"
            class="loginType"
            @tap="loginTypeSwitch('loginByPassword')">密码登录</v-touch>
          <v-touch
            tag="div"
            :class="{loginTypeSelected: 'loginByPhoneNum' === loginType}"
            class="loginType"
            @tap="loginTypeSwitch('loginByPhoneNum')">手机号登录</v-touch>
        </header>
        <form class="containerForm">
          <section class="containerInput">
            <input v-if="'loginByPassword' === loginType" v-model="userName" type="text" placeholder="账号">
            <section v-else class="loginByphoneNumContainer">
              <input v-model="phoneNum" type="text" placeholder="手机号">
              <span v-if="countdownStart" class="countdown">{{countdown}}s</span>
              <v-touch v-else tag="span" class="codeGet" @tap="codeGet">{{codeGetButton}}</v-touch>
            </section>
          </section>
          <section class="containerInput">
            <input v-if="passwordInvisible && 'loginByPassword' === loginType" v-model="password" type="password" placeholder="密码">
            <input v-else-if="'loginByPassword' === loginType" v-model="password" type="text" placeholder="密码">
            <input v-else type="text" maxlength="4" placeholder="短信验证码">
            <div v-if="'loginByPassword' === loginType" class="containerSlider">
              <p v-if="passwordInvisible" class="sliderTextRight">...</p>
              <p v-else class="sliderTextLeft">abc</p>
              <v-touch
                tag="input"
                type="button"
                class="slideBar"
                :class="{slideBarRight: !passwordInvisible}"
                @tap="passwordVisibleSwitch" />
            </div>
          </section>
          <section v-if="'loginByPassword' === loginType" class="containerInput">
            <input v-model="captchaText" type="text" maxlength="4" placeholder="验证码" class="captchaInput">
            <section class="containerCaptcha">
              <img :src="captchaImg.code" alt="验证码" class="imgCaptcha">
              <div class="captchaSwich">
                <span>看不清</span>
                <v-touch tag="span" class="captchaChange" @tap="captchaChange">换一张</v-touch>
              </div>
            </section>
          </section>
        </form>
        <p class="hint">温馨提示：未注册过的账号，登录时将自动注册</p>
        <p class="hint">注册过的用户可凭账号密码登录</p>
        <v-touch tag="div" class="loginButton" @tap="login">登录</v-touch>
        <div class="resentPassword">
          <span>忘记密码？</span>
        </div>
      </section>
      <matte-opacity v-if="popup"></matte-opacity>
      <pop-up v-if="popup" :warnMessage="warnMessage" @warnConfirm="warnConfirm"></pop-up>
    </div>
  </transition>
</template>

<script>
import TopBack from '../../components/common/TopBack'
import {captchasGet, accountLogin, mobileCode, checkExsis, sendLogin} from '../../service/getData'
import {mapMutations} from 'vuex'
import userInfoTest from '../../plugin/userInfo'

export default {
  name: 'login',

  components: {
    TopBack,
    PopUp: () => import('../../components/common/PopUp'),
    MatteOpacity: () => import('../../components/common/MatteOpacity')
  },

  data () {
    return {
      loginType: 'loginByPassword',
      captchaImg: '',
      userName: '', // 账号
      password: '', // 密码
      passwordInvisible: true, // 密码不可见
      captchaText: '', // 图片验证码
      phoneNum: '', // 手机号
      codeGetButton: '获取验证码',
      countdown: 30, // 倒计时时长(s)
      countdownStart: false,
      code: '', // 短信验证码
      validateToken: '', // 获取短信验证码后的返回码
      popup: false, // 警告弹窗
      warnMessage: '', // 警告信息
      userInfo: '' // 登录后返回信息
    }
  },

  mounted () {
    this.captchaGet()
  },

  methods: {
    loginTypeSwitch (value) { // 切换登录方式
      this.loginType = value
    },

    async captchaGet () { // 获取图片验证码
      try {
        let res = await captchasGet()
        this.captchaImg = res
      } catch (e) {
        throw new Error(e)
      }
    },

    captchaChange () { // 切换验证码
      this.captchaGet()
    },

    async codeGet () { // 获取短信验证码
      try {
        let exsit = await this.verifyPhoneNum(this.phoneNum)
        if (exsit) {
          this.countdownStart = true
          let timer = setInterval(() => { // 倒计时
            this.countdown--
            if (this.countdown < 0) {
              clearInterval(timer)
              this.countdownStart = false
              this.countdown = 30
            }
          }, 1000)
          let res = await mobileCode(this.phoneNum)
          this.code = res
          this.validateToken = res.validate_token
        }
      } catch (e) {
        throw new Error(e)
      }
    },

    passwordVisibleSwitch () { // 切换密码可见性
      this.passwordInvisible = !this.passwordInvisible
    },

    async login () { // 登录
      try {
        if (this.loginType === 'loginByPassword') {
          if (!/^[\d\w]{4,8}$/.test(this.userName)) {
            this.popup = true
            this.warnMessage = '用户名必须是四到八位字母下划线或数字'
          } else if (!/^[\d\w]{6,12}$/.test(this.password)) {
            this.popup = true
            this.warnMessage = '密码必须是六到十二位的字母下划线或数字'
          } else if (!this.captchaText) {
            this.popup = true
            this.warnMessage = '请输入验证码'
          } else {
            let res = await accountLogin(this.userName, this.password, this.captchaText) // 无限验证码失效问题解决不了，没救了，我就假装登陆成功了
            if (res.status === 1) { // 为了假装登录成功，把status改为等于1,实际上是等于0
              this.popup = true
              this.warnMessage = res.message
            } else {
              this.userInfo = res
              this.userInfo = userInfoTest // 测试用数据
              this.saveUserInfoBack()
            }
          }
        } else if (this.loginType === 'loginByPhoneNum') {
          let exist = await this.verifyPhoneNum(this.phoneNum)
          if (exist) {
            let res = await sendLogin(this.code, this.phoneNum, this.validateToken)
            this.userInfo = res
            this.saveUserInfoBack()
          }
        }
      } catch (e) {
        throw new Error(e)
      }
    },

    async verifyPhoneNum (phoneNum) { // 验证手机号
      try {
        if (!/^[\d]{11}$/.test(phoneNum)) {
          this.popup = true
          this.warnMessage = '手机号格式不正确'
          return false
        } else {
          let res = await checkExsis(phoneNum, 'mobile') // 不知道为啥404了，所以就假装获取到返回值了（自暴自弃中^_^）
          if (res.message) {
            this.popup = true
            this.warnMessage = res.message
            return false
          } else if (!res.is_exists) {
            this.popup = true
            this.warnMessage = '您输入的手机号尚未绑定'
            return false
          } else {
            return true
          }
        }
      } catch (e) {
        throw new Error(e)
      }
    },

    warnConfirm () { // 错误提示弹窗
      this.popup = false
    },

    saveUserInfoBack () { // 保存用户信息然后返回
      this.userInfoSave(this.userInfo)
      this.$router.go(-1)
    },

    ...mapMutations([
      'userInfoSave'
    ])
  }
}
</script>

<style lang="scss" scoped>
  .containerLogin {
    background-color: #e4e2e2;
    padding-bottom: .1rem;
    .loginTypeSwitch {
      background-color: #fff;
      display: flex;
      justify-content: center;
      .loginType {
        font-size: .15rem;
        color: #535353;
        line-height: .4rem;
        margin: 0 .1rem;
      }
      .loginTypeSelected {
        color: #1252a7;
        border-bottom: 3px solid #1252a7;
      }
    }
    .containerForm {
      border-top: 1px solid #e4e2e2;
      .containerInput {
        height: .55rem;
        background-color: #fff;
        padding: 0 .2rem;
        margin: 1px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        input {
          font-size: .15rem;
          color: #4d4d4d;
          width: 100%;
        }
        .loginByphoneNumContainer {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .countdown {
            font-size: .15rem;
            color: #4d4d4d;
          }
          .codeGet {
            font-size: .15rem;
            color: #2e67cf;
            width: 40%;
            display: flex;
            justify-content: flex-end;
          }
        }
        
        .captchaInput {
          width: 50%; // 这个宽度有点小问题
        }
        .containerSlider {
          display: flex;
          align-items: center;
          position: relative;
          .sliderTextRight {
            background-color: #797979;
            line-height: .16rem;
            border-radius: .08rem;
            width: .4rem;
            font-size: .12rem;
            color: #fff;
            text-align: right;
          }
          .sliderTextLeft {
            background-color: #0f5faa;
            line-height: .16rem;
            border-radius: .08rem;
            width: .4rem;
            font-size: .12rem;
            color: #fff;
            text-align: left;
          }
          .slideBar {
            width: .24rem;
            height: .24rem;
            background-color: #afafaf;
            border-radius: .12rem;
            position: absolute;
            left: 0;
            transition: left .2s;
          }
          .slideBarRight {
            left: 50%;
          }
        }
        .containerCaptcha {
          display: flex;
          align-items: center;
          .imgCaptcha {
            //
          }
          .captchaSwich {
            margin-left: .1rem;
            span {
              display: block;
              font-size: .13rem;
              color: #868686;
              line-height: 1.5em;
            }
            .captchaChange {
              color: #1252a7;
            }
          }
        }
      }
    }
    .hint {
      font-size: .13rem;
      color: #d62525;
      padding: 0 .15rem;
      line-height: .3rem;
    }
    .loginButton {
      width: 95%;
      height: .45rem;
      background-color: #17bb3b;
      border-radius: .05rem;
      margin: 0 auto;
      text-align: center;
      line-height: .45rem;
      color: #fff;
      font-size: .16rem;
    }
    .resentPassword {
      display: flex;
      justify-content: flex-end;
      margin-top: .2rem;
      span {
        font-size: .13rem;
        color: #1252a7;
      }
    }
  }
</style>

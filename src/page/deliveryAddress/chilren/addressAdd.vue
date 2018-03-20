<template>
  <div class="addressAddPage">
    <top-back title="添加地址"></top-back>
    <section class="addressDetail">
      <section class="name">
        <h4>联系人</h4>
        <input v-model="name" type="text" placeholder="你的姓名">
      </section>
      <section class="sex">
        <div class="sexItem">
          <input v-model="sex" type="radio" value="先生" id="man">
          <label for="man">先生</label>
        </div>
        <div class="sexItem">
          <input v-model="sex" type="radio" value="女士" id="woman">
          <label for="woman">女士</label>
        </div>
      </section>
      <section class="phone">
        <h4>电话</h4>
        <input v-model="phone" type="text" placeholder="你的手机号">
      </section>
      <router-link
        :to="{name: 'addressNearby'}"
        tag="section"
        event="touchend"
        class="pos">
        <h4>位置</h4>
        <div class="posRight">
          <input v-model="pos" type="text" placeholder="小区/写字楼/学校等">
          <span class="arrows">&gt;</span>
        </div>
      </router-link>
      <section class="addressMore">
        <h4>详细地址</h4>
        <textarea v-model="addressMore" placeholder="详细地址(如门牌号)" class="addressMoreText"></textarea>
      </section>
      <section class="tag">
        <h4>标签</h4>
        <section class="tagRight">
          <div class="tagItem">
            <input v-model="tag" type="radio" value="家" id="home">
            <label for="home">家</label>
          </div>
          <div class="tagItem">
            <input v-model="tag" type="radio" value="学校" id="school">
            <label for="school">学校</label>
          </div>
          <div class="tagItem">
            <input v-model="tag" type="radio" value="公司" id="company">
            <label for="company">公司</label>
          </div>
        </section>
      </section>
      <v-touch
        tag="footer"
        class="confirm"
        @tap="confirm">确定</v-touch>
    </section>
    <matte-opacity v-if="popup"></matte-opacity>
    <pop-up v-if="popup" :warnMessage="warnMessage" @warnConfirm="warnConfirm"></pop-up>
  </div>
</template>

<script>
import TopBack from '../../../components/common/TopBack'
import {addressAdd} from '../../../service/getData'
import {mapState, mapGetters, mapMutations} from 'vuex'

export default {
  name: 'AddressAdd',

  components: {
    TopBack,
    MatteOpacity: () => import('../../../components/common/MatteOpacity'),
    PopUp: () => import('../../../components/common/PopUp')
  },

  data () {
    return {
      name: '',
      sex: '',
      phone: '',
      pos: '',
      addressMore: '',
      tag: '',
      popup: false,
      warnMessage: ''
    }
  },

  computed: {
    ...mapState([
      'userInfo',
      'addressTS'
    ]),

    ...mapGetters([
      'geohash'
    ])
  },

  beforeRouteEnter (to, from, next) { // 从addressNEarby回到此页前,从store获取数据，填写表单
    if (from.name === 'addressNearby') {
      next(vm => {
        if (Object.keys(vm.addressTS).length > 0) {
          ['name', 'sex', 'phone', 'pos', 'addressMore', 'tag'].forEach((item, index) => {
            if (vm.addressTS[item]) vm[item] = vm.addressTS[item]
          })
        }
      })
    } else {
      next()
    }
  },

  beforeRouteLeave (to, from, next) { // 离开此页去addressNearby页时保存填写的表单数据
    if (to.name === 'addressNearby') {
      this.addressTemporaryDataSave({
        name: this.name,
        sex: this.sex,
        phone: this.phone,
        pos: this.pos,
        addressMore: this.addressMore,
        tag: this.tag
      })
    }
    next()
  },

  methods: {
    async confirm () {
      if (!this.name) {
        this.popup = true
        this.warnMessage = '请输入您的名字'
      } else if (!this.phone) {
        this.popup = true
        this.warnMessage = '请输入手机号'
      } else if (!this.pos) {
        this.popup = true
        this.warnMessage = '请输入地址'
      } else if (!this.addressMore) {
        this.popup = true
        this.warnMessage = '请输入详细地址'
      } else if (!this.userInfo) {
        this.popup = true
        this.warnMessage = '请先登录'
      } else {
        let res = await this.addressAdd()
        if (res.status === 0) {
          this.popup = true
          this.warnMessage = res.message
        } else {
          this.$router.push({name: 'deliveryAddress'})
        }
      }
    },

    async addressAdd () {
      let res = await addressAdd(this.userInfo.user_id, this.pos, this.addressMore, this.geohash, this.name, this.phone, this.sex, this.tag)
      return res
    },

    warnConfirm () {
      this.popup = false
    },

    ...mapMutations([
      'addressTemporaryDataSave'
    ])
  }
}
</script>

<style lang="scss" scoped>
  .addressAddPage {
    position: fixed;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    background-color: #ebebeb;
    .addressDetail {
      h4 {
        font-size: .14rem;
        font-weight: bold;
        color: #202020;
        width: 20%
      }
      input {
        font-size: .14rem;
        color: #707070;
      }
      .name, .sex, .phone, .pos, .addressMore, .tag {
        display: flex;
        align-items: center;
        background-color: #fff;
        margin: 1px 0;
        padding: .15rem;
        .addressMoreText {
          font-size: .13rem;
          color: #707070;
        }
        .posRight {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 80%;
        }
        .arrows {
          font-size: .16rem;
          color: #8a8a8a;
          transform: scale(1, 2);
        }
      }
      .name, .phone, .addressMore {
        input, textarea {
          width: 80%;
        }
      }
      .sex {
        .sexItem {
          display: flex;
          justify-content: center;
          align-items: center;
          flex: auto;
          color: #3a3a3a;
          font-size: .14rem;
          label {
            margin-left: .05rem;
          }
        }
      }
      .tag {
        .tagRight {
          display: flex;
          align-items: center;
          width: 80%;
          .tagItem {
            display: flex;
            justify-content: center;
            align-items: center;
            flex: auto;
            font-size: .14rem;
            color: #3a3a3a;
            label {
              margin-left: .05rem;
            }
          }
        }
      }
      .confirm {
        width: 95%;
        background-color: #2dc954;
        font-size: .16rem;
        color: #fff;
        padding: .1rem 0;
        margin: 0 auto;
        text-align: center;
        border-radius: .05rem;
        margin-top: .1rem;
      }
    }
  }
</style>


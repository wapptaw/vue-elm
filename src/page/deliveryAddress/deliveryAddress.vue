<template>
  <div>
    <top-back title="我的地址"></top-back>
    <section>
      <ul>
        <li v-for="item in addressList" :key="item"></li>
      </ul>
      <router-link
        :to="{name: 'addressAdd'}"
        tag="footer"
        event="touchend"
        class="add">
        <span class="addText">+</span>
      </router-link>
    </section>
    <router-view></router-view>
  </div>
</template>

<script>
import TopBack from '../../components/common/TopBack'
import {getAddressList} from '../../service/getData'
import {mapState} from 'vuex'

export default {
  name: 'deliveryAddress',

  components: {
    TopBack
  },

  data () {
    return {
      addressList: '' // 地址列表
    }
  },

  computed: {
    ...mapState([
      'userInfo'
    ])
  },

  mounted () {
    this.addressListGet()
  },

  methods: {
    async addressListGet () { // api不太好用，所以这一页就不写了，以后再说
      try {
        let res = await getAddressList(this.userInfo.user_id)
        console.log(res)
      } catch (e) {
        throw new Error(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .add {
    position: fixed;
    left: 50%;
    bottom: 5%;
    transform: translateX(-50%);
    width: .35rem;
    height: .35rem;
    background-color: #1871b9;
    border-radius: .2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    .addText {
      font-size: .25rem;
      color: #fff;
    }
  }
</style>


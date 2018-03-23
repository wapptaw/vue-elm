<template>
  <div>
    <top-back title="我的地址"></top-back>
    <section class="addressAddContainer">
      <ul class="addressUl">
        <v-touch
          tag="li"
          v-for="item in addressList"
          :key="item.id"
          class="addressList"
          @tap="addressSelect(item)">
          <p class="name">姓名：{{item.name}}</p>
          <p class="address">地址：{{item.address}}</p>
          <p class="phone">手机：{{item.phone}}</p>
        </v-touch>
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
import {mapState, mapMutations} from 'vuex'

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
        this.addressList = res
      } catch (e) {
        throw new Error(e)
      }
    },

    addressSelect (item) {
      this.addressSelectSave(item)
      this.$router.go(-1)
    },

    ...mapMutations([
      'addressSelectSave'
    ])
  }
}
</script>

<style lang="scss" scoped>
.addressAddContainer {
  .addressUl {
    background-color: #e9e9e9;
    padding: 1px 0; // 因为外边距撑不起父元素，露不出父元素的背景颜色，所以加了padding撑起父元素
    .addressList {
      background-color: #fff;
      margin: .1rem 0;
      padding: 0 .15rem;
      p {
        line-height: .25rem;
      }
      .name {
        font-size: .14rem;
        font-weight: bold;
        color: #4e4e4e;
      }
      .address {
        font-size: .13rem;
        color: #707070;
      }
      .phone {
        font-size: .12rem;
        color: #919191;
      }
    }
  }
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
}
</style>


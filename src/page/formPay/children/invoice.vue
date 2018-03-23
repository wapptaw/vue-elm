<template>
  <div class="invoice">
    <top-back title="选择发票抬头"></top-back>
    <section class="invoiceDetail">
      <ul class="invoiceUl">
        <v-touch
          tag="li"
          v-for="(item, index) in invoiceType"
          :key="item.type"
          class="invoiceLi"
          @tap="invoiceSelect(index)">
          <h4 class="invoiceType" :class="{invoiceSelected: item.selected}">{{item.type}}</h4>
          <transition name="fade">
            <section v-if="item.selected && item.needTitle" class="invoiceTitle">
              <textarea v-model="item.title" type="text" placeholder="输入发票抬头"></textarea>
            </section>
          </transition>
        </v-touch>
      </ul>
    </section>
    <v-touch
      tag="section"
      class="confirm"
      @tap="confirm">确定</v-touch>
  </div>
</template>

<script>
import TopBack from '../../../components/common/TopBack'
import {mapMutations} from 'vuex'

export default {
  name: 'invoice',

  components: {
    TopBack
  },

  data () {
    return {
      invoiceType: [
        {
          type: '不开发票',
          title: '不需要发票',
          selected: true,
          needTitle: false
        },
        {
          type: '个人',
          title: '',
          selected: false,
          needTitle: true
        },
        {
          type: '企业',
          title: '',
          selected: false,
          needTitle: true
        }
      ]
    }
  },

  methods: {
    invoiceSelect (index) {
      this.invoiceType.forEach((v, ind) => {
        if (index === ind) {
          v.selected = true
        } else {
          v.selected = false
        }
      })
    },

    confirm () {
      for (let v of this.invoiceType) { // 只支持开发票或不开发票两项
        if (v.selected) {
          this.invoiceTypeSave(v)
        }
      }
      this.$router.go(-1)
    },

    ...mapMutations([
      'invoiceTypeSave'
    ])
  }
}
</script>

<style lang="scss" scoped>
  .invoice {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;
    .invoiceDetail {
      .invoiceUl {
        .invoiceLi {
          padding: 0 .15rem;
          width: 100%;
          box-sizing: border-box;
          height: 1.1rem;
          .invoiceType {
            font-size: .14rem;
            color: #464646;
            font-weight: bold;
            margin-right: .1rem;
            line-height: .4rem;
            
          }
          .invoiceSelected {
            color: #73d8e6;
          }
          textarea {
            border: 1px solid #adadad;
            width: 100%;
            color: #636363;
            border-radius: .02rem;
            height: .6rem;
          }
        }
      }
    }
  }
  .confirm {
    width: 95%;
    height: .4rem;
    color: #fff;
    background-color: #22b653;
    margin: 0 auto;
    text-align: center;
    line-height: .4rem;
    border-radius: 5px;
    margin-top: .1rem;
  }
</style>


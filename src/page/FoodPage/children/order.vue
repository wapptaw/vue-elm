<template>
  <div>
    <div class="foodMenu">
      <ul class="menu" :style="{height: foodMenuHeight}">
        <v-touch tag="li"
          v-for="menu in foodMeanData"
          :key="menu.id"
          class="menuItem">
          <img :src="`${imgBaseUrl}${menu.icon_url}.jpeg`" :alt="menu.icon_url" class="icon" v-if="menu.icon_url">
          <span class="menuName">{{menu.name}}</span>
        </v-touch>
      </ul>
      <section class="food" :style="{height: foodMenuHeight}">
        <dl v-for="menu in foodMeanData" :key="menu.id" class="foodCategory">
          <dt>
            <h2>{{menu.name}}</h2>
            <p>{{menu.description}}</p>
          </dt>
          <v-touch tag="dd" v-for="food in menu.foods" :key="food.item_id" class="foodDetails">
            <img :src="`${imgBaseUrl2}${food.image_path}`" alt="" class="foodIcon">
            <div class="foodDespriction">
              <h3 class="foodName">{{food.name}}</h3>
              <p class="foodDes">{{food.description}}</p>
              <p class="foodTips">{{food.tips}}</p>
              <span
                class="foodActivity"
                :style="{
                  color: food.activity && `#${food.activity.image_text_color}`,
                  border: food.activity && `#${food.activity.icon_color} 1px solid`
                }">
                {{food.activity && food.activity.image_text}}
              </span>
              <footer class="foodFooter">
                <span class="price">￥{{food && food.specfoods[0].price}}</span>
                <section class="specifications">
                  <v-touch tag="span" class="foodReduce" v-if="foodNumShow" @tap="foodReduce(food.specfoods[0].price)">-</v-touch>
                  <span v-if="foodNumShow" class="foodSize">{{foodNum}}</span>
                  <v-touch tag="span" class="foodSelect" v-if="food.specifications.length !== 0">选择</v-touch>
                  <v-touch tag="span" class="foodAdd" v-else @tap="foodAdd(food.specfoods[0].price)">+</v-touch>
                </section>
              </footer>
            </div>
          </v-touch>
        </dl>
      </section>
    </div>
    <footer class="cartView" ref="cartView">我是底部</footer>
  </div>
</template>

<script>
import {foodMean} from '../../../service/getData'
import {imgBaseUrl, imgBaseUrl2} from '../../../config/url'
import {mapState} from 'vuex'

export default {
  name: 'order',

  props: {
    id: {
      type: [String, Number],
      default: 1
    }
  },

  data () {
    return {
      foodMeanData: '',
      imgBaseUrl,
      imgBaseUrl2,
      footerHeight: '',
      foodNum: 0,
      totalPrices: 0
    }
  },

  computed: {
    foodMenuHeight () {
      return this.clientHeight - this.detailsHeight - this.footerHeight + 'px'
    },

    foodNumShow () {
      return this.foodNum > 0
    },

    ...mapState([
      'detailsHeight',
      'clientHeight'
    ])
  },

  mounted () {
    this.foodMeanGet()
    this.$nextTick(() => {
      this.footerHeight = this.$refs.cartView.offsetHeight
    })
  },

  methods: {
    async foodMeanGet () {
      let res = await foodMean(this.id)
      this.foodMeanData = res
      console.log(res)
    },

    foodAdd (price) {
      this.foodNum ++
      this.totalPrices += price
      this.foodNumShow = true
    },

    foodReduce (price) {
      if (this.foodNum > 0) {
        this.foodNum --
        this.totalPrices -= price
      } else {
        this.foodNumShow = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  %vc {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .foodMenu {
    display: flex;
    justify-content: space-between;
    .menu {
      width: 30%;
      box-sizing: border-box;
      overflow-y: auto;
      .menuItem {
        height: .5rem;
        border-bottom: 1px solid #a5a5a5;
        @extend %vc;
        position: relative;
        .icon {
          width: 20%;
          position: absolute;
          left: 5%;
        }
        .menuName {
          font-size: .14rem;
          color: #474747;
        }
      }
    }
    .food {
      width: 70%;
      box-sizing: border-box;
      overflow-y: auto;
      box-sizing: border-box;
      border-left: 1px solid #a5a5a5;
      .foodCategory {
        dt {
          height: .35rem;
          background-color: #e2e2e2;
          display: flex;
          align-items: baseline;
          padding-left: .1rem;
          h2 {
            font-size: .17rem;
            color: #5f5f5f;
            font-weight: bold;
            display: flex;
            height: .35rem;
            line-height: .35rem;
          }
          p {
            font-size: .13rem;
            color: #646464;
            margin-left: .1rem;
          }
        }
        .foodDetails {
          display: flex;
          .foodIcon {
            width: 20%;
            height: 100%;
            align-self: center;
            padding-left: .1rem;
          }
          .foodDespriction {
            width: 100%;
            padding: .05rem .1rem;
            box-sizing: border-box;
            .foodName {
              font-size: .18rem;
              font-weight: bold;
              color: #464646;
              margin-bottom: .05rem;
            }
            .foodDes {
              font-size: .12rem;
              color: #8d8d8d;
              margin-bottom: .05rem;
            }
            .foodTips {
              font-size: .12rem;
              color: #4e4e4e;
              margin-bottom: .05rem;
            }
            .foodActivity {
              font-size: .1rem;
              border-radius: .04rem;
              margin-bottom: .05rem;
              padding:0 .02rem;
              display: inline-block;
            }
            .foodFooter {
              display: flex;
              justify-content: space-between;
              .price {
                font-size: .16rem;
                color: #e9451b;
                font-weight: bold;
              }
              .specifications {
                display: flex;
                .foodSelect {
                  font-size: .12rem;
                  border-radius: .05rem;
                  height: .2rem;
                  color: #fff;
                  width: .36rem;
                  background-color: #255cd1;
                  text-align: center;
                  line-height: .2rem;
                }
                .foodAdd {
                  width: .18rem;
                  height: .18rem;
                  font-size: .16rem;
                  border-radius: .09rem;
                  color: #fff;
                  background-color: #255cd1;
                  text-align: center;
                  line-height: .18rem;
                }
                .foodReduce {
                  width: .18rem;
                  height: .18rem;
                  font-size: .16rem;
                  color: #525252;
                  border: 1px solid #525252;
                  border-radius: .09rem;
                  box-sizing: border-box;
                  text-align: center;
                  line-height: .18rem;
                }
                .foodSize {
                  font-size: .16rem;
                  color: #444444;
                  margin: 0 .08rem;
                  text-align: center;
                  line-height: .18rem;
                }
              }
            }
          }
        }
      }
    }
  }
  .cartView {
    height: .5rem;
    width: 100%;
    position: fixed;
    bottom: 0;
    background-color: #000;
  }
</style>


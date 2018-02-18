<template>
  <div>
    <div class="foodMenu">
      <ul class="menu" :style="{height: foodMenuHeight}">
        <v-touch tag="li"
          v-for="(menu, index) in foodMeanData"
          :key="menu.id"
          @tap="menuSelected(index)"
          :class="{menuSelectedStyle: menu.menuSelected }"
          class="menuItem">
          <img :src="`${imgBaseUrl}${menu.icon_url}.jpeg`" :alt="menu.icon_url" class="icon" v-if="menu.icon_url">
          <span class="menuName">{{menu.name}}</span>
        </v-touch>
      </ul>
      <section class="food" :style="{height: foodMenuHeight}">
        <dl 
          v-for="(menu, index) in foodMeanData"
          :key="menu.id"
          :id="index"
          class="foodCategory">
          <dt>
            <h2>{{menu.name}}</h2>
            <p>{{menu.description}}</p>
          </dt>
          <v-touch tag="dd" v-for="(food, foodIndex) in menu.foods" :key="food.item_id" class="foodDetails">
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
                  <v-touch tag="span" class="foodReduce" v-if="food.selectedNum > 0" @tap="foodReduce(index, foodIndex, food.specfoods[0].price)">-</v-touch>
                  <span v-if="food.selectedNum > 0" class="foodSize">{{food.selectedNum}}</span>
                  <v-touch tag="span" class="foodSelect" v-if="food.specfoods.length > 1" @tap="specSelectShow(index, foodIndex)">选择</v-touch>
                  <v-touch tag="span" class="foodAdd" v-else @tap="foodAdd(index, foodIndex, food.specfoods[0].price)">+</v-touch>
                </section>
              </footer>
            </div>
          </v-touch>
        </dl>
        <v-touch tag="div" class="fullScreen" v-if="shadowShow" @tap="shadowClose"></v-touch>
        <section v-if="specShow" class="specSelect">
          <h3 class="specTitle">规格</h3>
          <ul class="specs">
            <v-touch
              tag="li"
              v-for="(spec, specIndex) in specData"
              :key="spec.food_id"
              @tap="specSelect(specIndex)"
              :class="{setStyle: spec.selected}"
              class="spec">
              {{spec.specs_name}}
            </v-touch>
          </ul>
          <footer class="specFooter">
            <span class="specPrice">￥{{specData[specMark].price}}</span>
            <section class="specCount">
              <v-touch tag="span" class="specReduce" v-if="specData[specMark].selectedNum > 0" @tap="specReduce">-</v-touch>
              <span class="specNum" v-if="specData[specMark].selectedNum > 0">{{specData[specMark].selectedNum}}</span>
              <v-touch tag="span" class="specAdd" @tap="specAdd">+</v-touch>
            </section>
          </footer>
        </section>
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
      foodNum: 0, // 总数量
      totalPrices: 0, // 总价
      specShow: false,
      specData: '',
      shadowShow: false,
      specMark: 0 // 记录选中的spec选项的序号
    }
  },

  computed: {
    foodMenuHeight () {
      return this.clientHeight - this.detailsHeight - this.footerHeight + 'px'
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
      for (let val of res) {
        for (let food of val.foods) {
          if (food.specfoods.length > 1) {
            food.specShow = false
          } else {
            food.selectedNum = 0
          }
        }
        val.menuSelected = false // 提前添加属性视图就能自动更新了
      }
      res[0].menuSelected = true
      this.foodMeanData = res
    },

    menuSelected (index) {
      this.foodMeanData.forEach((val, ind) => { // 这里只有两层，响应不管用，视图不能自动更新
        if (index === ind) {
          val.menuSelected = true
          // this.$set(val, 'menuSelected', true) // 用了set问题解决，但是我还是感觉莫名其妙
        } else {
          val.menuSelected = false
          // this.$set(val, 'menuSelected', false)
        }
      })
      document.getElementById(index).scrollIntoView()
    },

    foodAdd (index, foodIndex, price) {
      this.foodNum ++
      this.totalPrices += price
      this.foodMeanData[index].foods[foodIndex].selectedNum ++
    },

    foodReduce (index, foodIndex, price) {
      if (this.foodMeanData[index].foods[foodIndex].selectedNum > 0) {
        this.foodNum --
        this.totalPrices -= price
        this.foodMeanData[index].foods[foodIndex].selectedNum -- // 这里是4层，响应还管用，就是这里没用set都管用才莫名其妙
      }
    },

    specSelectShow (index, foodIndex) {
      let data = this.foodMeanData[index].foods[foodIndex].specfoods
      for (let val of data) {
        if (!val.selectedNum) {
          val.selectedNum = 0
        }
        val.selected = false
      }
      data[0].selected = true
      this.specData = data
      this.specShow = true
      this.shadowShow = true
      this.specPrice = 0
      this.specMark = 0
    },

    shadowClose () {
      this.shadowShow = false
      this.specShow = false
    },

    specSelect (specIndex) {
      this.specMark = specIndex
      this.specPrice = this.specData[specIndex].price
      this.specData.forEach((val, index) => { // 还有这里，也没用set却没问题
        if (specIndex === index) {
          val.selected = true
        } else {
          val.selected = false
        }
      })
    },

    specAdd () {
      this.foodNum ++
      this.totalPrices += this.specData[this.specMark].price
      // this.specData[this.specMark].selectedNum ++
      this.$set(this.specData, this.specMark, Object.assign(this.specData[this.specMark], {selectedNum: this.specData[this.specMark].selectedNum + 1})) // 由于使用序号修改数组不支持响应,这里是6层，响应不管用所以用set
    },

    specReduce () {
      if (this.specData[this.specMark].selectedNum > 0) {
        this.foodNum --
        this.totalPrices -= this.specData[this.specMark].price
        // this.specData[this.specMark].selectedNum --
        this.$set(this.specData, this.specMark, Object.assign(this.specData[this.specMark], {selectedNum: this.specData[this.specMark].selectedNum - 1}))
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
  %Add {
    width: .18rem;
    height: .18rem;
    font-size: .16rem;
    border-radius: .09rem;
    color: #fff;
    background-color: #255cd1;
    text-align: center;
    line-height: .18rem;
  }
  %Reduce {
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
  %Number {
    font-size: .16rem;
    color: #444;
    margin: 0 .08rem;
    text-align: center;
    line-height: .18rem;
  }
  %Price {
    font-size: .16rem;
    color: #e9451b;
    font-weight: bold;
  }
  .fullScreen {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .7);
    z-index: 99;
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
      .menuSelectedStyle {
        ::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 3px;
          background-color: #1571bd;
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
                @extend %Price;
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
                  @extend %Add;
                }
                .foodReduce {
                  @extend %Reduce;
                }
                .foodSize {
                  @extend %Number
                }
              }
            }
          }
        }
      }
      .specSelect {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80%;
        min-height: 30%;
        background-color: #fff;
        border-radius: .05rem;
        z-index: 100;
        padding: .1rem;
        box-sizing: border-box;
        .specTitle {
          font-size: .16rem;
          color: #272727;
        }
        .specs {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          margin-top: .1rem;
          .spec {
            @extend %vc;
            flex: auto;
            border: 1px solid #14a2a7;
            border-radius: .03rem;
            margin:.02rem .05rem;
            color: #494949;
            line-height: 1.4em;
          }
          .setStyle {
            border-color: #da1671;
            color: #da1671;
          }
        }
        .specFooter {
          display: flex;
          justify-content: space-between;
          margin-top: 30%;
          .specPrice {
            @extend %Price;
          }
          .specCount {
            display: flex;
            .specReduce {
              @extend %Reduce;
            }
            .specNum {
              @extend %Number;
            }
            .specAdd {
              @extend %Add;
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


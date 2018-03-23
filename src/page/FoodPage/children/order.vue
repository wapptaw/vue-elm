<template>
  <div>
    <div class="foodMenu">
      <ul class="menu" :style="{height: foodMenuHeight}">
        <v-touch tag="li"
          v-for="(menu, index) in foodMenuData"
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
          v-for="(menu, index) in foodMenuData"
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
                  <v-touch tag="span" class="foodReduce" v-if="food.specfoods[0].selectedNum > 0 && food.specfoods.length === 1" @tap="foodReduce(index, foodIndex, food.specfoods[0].price)">-</v-touch>
                  <span v-if="food.specfoods[0].selectedNum > 0 && food.specfoods.length === 1" class="foodSize">{{food.specfoods[0].selectedNum}}</span>
                  <v-touch tag="span" class="foodSelect" v-if="food.specfoods.length > 1" @tap="specSelectShow(index, foodIndex)">选择</v-touch>
                  <v-touch tag="span" class="foodAdd" v-else @tap="foodAdd(index, foodIndex, food.specfoods[0].price)">+</v-touch>
                </section>
              </footer>
            </div>
          </v-touch>
        </dl>
        <transition name="fullScreenFade">
          <v-touch
            tag="div"
            class="fullScreen"
            v-if="shadowShow"
            @tap="shadowClose"
            :style="{zIndex: tier}">
          </v-touch>
        </transition>
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
              <v-touch tag="span" class="specReduce" v-if="specData[specMark].selectedNum > 0" @tap="foodReduce">-</v-touch>
              <span class="specNum" v-if="specData[specMark].selectedNum > 0">{{specData[specMark].selectedNum}}</span>
              <v-touch tag="span" class="specAdd" @tap="foodAdd">+</v-touch>
            </section>
          </footer>
        </section>
      </section>
    </div>
    <transition name="slide">
      <section v-if="carListShow" class="car" :style="{bottom: footerHeight + 'px'}">
        <div class="cartViewTop">
          <h2 class="title">购物车</h2>
          <v-touch tag="span" class="carClear" @tap="carClear">清空</v-touch>
        </div>
        <transition-group tag="ul" class="foodItems" name="fade">
          <li v-for="(item, index) in allFoods" :key="item.food_id" class="foodItem">
            <section class="foodTitle">
              <h3 class="title">{{item.name}}</h3>
              <span v-if="item.specs_name" class="spec">{{item.specs_name}}</span>
            </section>
            <span class="price">￥{{item.selectedNum * item.price}}</span>
            <section class="foodNum">
              <v-touch tag="span" class="reduce" @tap="carReduce(index)">-</v-touch>
              <span class="num">{{item.selectedNum}}</span>
              <v-touch tag="span" class="add" @tap="carAdd(index)">+</v-touch>
            </section>
          </li>
        </transition-group>
      </section>
    </transition>
    <footer class="cartView" ref="cartView">
      <v-touch tag="span" class="foodNum" @tap="carShow">购买数：{{sum.foodNum}}</v-touch>
      <span class="totalPrices">￥{{sum.totalPrices}}</span>
      <router-link
        :to="{path: `/orderConfirm/${id}`}"
        tag="span"
        event="touchend"
        class="pay">
        付款
      </router-link>
    </footer>
  </div>
</template>

<script>
import {foodMenu} from '../../../service/getData'
import {imgBaseUrl, imgBaseUrl2} from '../../../config/url'
import {mapState, mapMutations} from 'vuex'

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
      foodMenuData: '',
      imgBaseUrl,
      imgBaseUrl2,
      footerHeight: '',
      specShow: false,
      specData: '',
      shadowShow: false,
      specMark: 0, // 记录选中的spec选项的序号
      carListShow: false,
      tier: 99 // 阴影层级
    }
  },

  computed: {
    foodMenuHeight () {
      return this.clientHeight - this.detailsHeight - this.footerHeight + 'px'
    },

    allFoods () { // 购物车列表
      let allFoods = []
      for (let foodType of this.foodMenuData) {
        for (let food of foodType.foods) {
          for (let spec of food.specfoods) {
            if (spec.selectedNum > 0) {
              if (food.specfoods.length > 1) {
                allFoods.push({
                  name: spec.name,
                  specs_name: spec.specs_name,
                  price: spec.price,
                  food_id: spec.food_id,
                  get selectedNum () {
                    return spec.selectedNum
                  },
                  set selectedNum (v) {
                    spec.selectedNum = v
                  }
                })
              } else {
                allFoods.push({
                  name: spec.name,
                  price: spec.price,
                  food_id: spec.food_id,
                  get selectedNum () {
                    return spec.selectedNum
                  },
                  set selectedNum (v) {
                    spec.selectedNum = v
                  }
                })
              }
            }
          }
        }
      }
      return allFoods
    },

    sum () { // 总计
      let foodNum = 0
      let totalPrices = 0
      for (let v of this.allFoods) {
        foodNum += v.selectedNum
        totalPrices += v.selectedNum * v.price
      }
      return {
        foodNum,
        totalPrices
      }
    },

    ...mapState([
      'detailsHeight',
      'clientHeight',
      'foodMenu'
    ])
  },

  watch: {
    allFoods (newV) {
      if (newV.length === 0) {
        this.shadowShow = false
        this.carListShow = false
      }
    }
  },

  mounted () {
    this.foodMenuGet()
    this.$nextTick(() => {
      this.footerHeight = this.$refs.cartView.offsetHeight
    })
  },

  beforeRouteLeave (to, from, next) {
    this.foodMenuDataSave({
      foodMenuData: this.foodMenuData,
      shopId: this.id})
    if (to.name === 'orderConfirm') {
      // 需要验证用户所以user页面写完再说
    }
    next()
  },

  methods: {
    async foodMenuGet () {
      try {
        if (this.foodMenu[this.id]) {
          this.foodMenuData = this.foodMenu[this.id]
        } else {
          let res = await foodMenu(this.id)
          for (let val of res) {
            for (let food of val.foods) {
              for (let spec of food.specfoods) {
                spec.selectedNum = 0
              }
            }
            val.menuSelected = false // 提前添加属性视图就能自动更新了
          }
          res[0].menuSelected = true
          this.foodMenuData = res
        }
      } catch (e) {
        throw new Error(e)
      }
    },

    menuSelected (index) {
      this.foodMenuData.forEach((val, ind) => {
        if (index === ind) {
          val.menuSelected = true
        } else {
          val.menuSelected = false
        }
      })
      document.getElementById(index).scrollIntoView()
    },

    foodAdd (index, foodIndex) {
      let specfoods
      if (this.specData) {
        specfoods = this.specData
      } else {
        specfoods = this.foodMenuData[index].foods[foodIndex].specfoods
      }
      specfoods[this.specMark].selectedNum ++
    },

    foodReduce (index, foodIndex) {
      let specfoods
      if (this.specData) {
        specfoods = this.specData
      } else {
        specfoods = this.foodMenuData[index].foods[foodIndex].specfoods
      }
      if (specfoods[this.specMark].selectedNum > 0) {
        specfoods[this.specMark].selectedNum --
      }
    },

    specSelectShow (index, foodIndex) {
      let specfoods = this.foodMenuData[index].foods[foodIndex].specfoods
      for (let spec of specfoods) {
        spec.selected = false
      }
      specfoods[0].selected = true
      this.specData = specfoods
      this.specShow = true
      this.shadowShow = true
      this.tier = 101
    },

    shadowClose () {
      this.shadowShow = false
      this.specShow = false
      this.specMark = 0
      this.specData = ''
      this.carListShow = false
    },

    specSelect (specIndex) {
      this.specMark = specIndex
      this.specData.forEach((val, index) => {
        if (specIndex === index) {
          val.selected = true
        } else {
          val.selected = false
        }
      })
    },

    carClear () {
      for (let v of this.allFoods) {
        v.selectedNum = 0
      }
    },

    carReduce (index) {
      if (this.allFoods[index].selectedNum > 0) {
        this.allFoods[index].selectedNum --
      }
    },

    carAdd (index) {
      this.allFoods[index].selectedNum ++
    },

    carShow () {
      if (this.allFoods.length > 0 && !this.carListShow) {
        this.carListShow = true
        this.shadowShow = true
        this.tier = 99
      } else {
        this.carListShow = false
        this.shadowShow = false
      }
    },

    ...mapMutations([
      'foodMenuDataSave'
    ])
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
  .fullScreenFade-enter, .fullScreenFade-leave-to {
    opacity: 0;
  }
  .fullScreenFade-enter-active, .fullScreenFade-leave-active {
    transition: opacity .2s ease-out;
  }
  .fullScreenFade-leave, .fullScreenFade-enter-to {
    opacity: 1;
  }
  
  .fullScreen {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .7);
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
      scroll-behavior: smooth;
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
        z-index: 102;
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
    background-color: #e0e0e0;
    border-top: 1px solid #949393;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 100;
    & > span {
      flex: auto;
      @extend %vc;
    }
    .foodNum {
      color: #277be9;
    }
    .totalPrices {
      color: #ee4d0d;
      font-weight: bold;
    }
    .pay {
      background-color: #d43e3e;
      height: 100%;
      color: #fff;
    }
  }
  .car {
    position: fixed;
    left: 0;
    width: 100%;
    background-color: #fff;
    z-index: 100;
    .cartViewTop {
      height: .4rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #d6d6d6;
      border-bottom: 1px solid #bbb;
      padding: 0 .1rem;
      .title {
        font-size: .16rem;
        color: #1251a3;
      }
      .carClear {
        font-size: .13rem;
        color: #ec3f3f;
        line-height: .4rem;
      }
    }
    .foodItems {
      max-height: 3.2rem;
      overflow-y: auto;
      .foodItem {
        display: flex;
        align-items: center;
        height: .4rem;
        padding: 0 .1rem;
        .foodTitle {
          display: flex;
          align-items: baseline;
          flex: 1 1 33%;
          .title {
            font-size: .18rem;
            font-weight: bold;
            color: #575757;
          }
          .spec {
            font-size: .12rem;
            color: #8a8a8a;
            margin-left: .05rem;
          }
        }
        .price {
          @extend %vc;
          flex: 1 0 33%;
          color: #ee4d0d;
          font-weight: bold;
          font-size: .14rem;
        }
        .foodNum {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          flex: 1 1 33%;
          .reduce {
            @extend %Reduce;
          }
          .num {
            @extend %Number;
          }
          .add {
            @extend %Add;
          }
        }
      }
    }
  }
</style>


<template>
  <div>
    <TopBack :title="$route.query.restaurantCategoryTitle" class="head" ref="head"></TopBack>
    <nav class="filterNav" ref="filterNav">
      <ul class="filterUl">
        <v-touch tag="li"
        v-for="(item, index) in guide"
        :key="index"
        :class="{foodSelected: filterMark === item.id}"
        class="filterLi"
        @tap="optionShow(item.id, index)">
          <h3 class="filterName">{{item.name}}</h3>
        </v-touch>
      </ul>
    </nav>
    <section class="filterOption">
      <transition name="fade">
        <section
          v-if="'filterCategory' === filterMark"
          key="filterCategory"
          class="filterCategory">
          <ul class="filterCategoryLeftUl">
            <v-touch tag="li"
              v-for="(categoryLeft, index) in foodCategoryData"
              :key="index"
              class="filterCategoryLeftLi"
              :class="{categoryLeftSelected: categoryLeft.categoryLeftSelected}"
              @tap="categoryLeftSelected(index)">
              <section class="filterCategoryLeftMenu">
                <img
                  v-if="categoryLeft.image_url"
                  :src="`${imgBaseUrl}${categoryLeft.image_url}.png`"
                  class="filterCategoryLeftIcon">
                <span class="filterCategoryLeftName">{{categoryLeft.name}}</span>
              </section>
              <span class="filterCategoryLeftCount">{{categoryLeft.sub_categories.length}}</span>
            </v-touch>
          </ul>
          <ul class="filterCategoryRightUl">
            <li
              v-for="(categoryLeft, indexLeft) in foodCategoryData"
              :key="indexLeft"
              class="filterCategoryRightLi">
              <ul
                v-if="indexSelected == indexLeft"
                class="filterCategoryRightItemUl">
                <v-touch
                  tag="li"
                  v-for="(categoryRight, indexRight) in categoryLeft.sub_categories"
                  :key="indexRight"
                  class="filterCategoryRightItemLi"
                  :class="{categoryRightSelected: categoryRight.categoryRightSelected}"
                  @tap="categoryRightSelected(indexLeft, indexRight, categoryRight.id, categoryRight.name)">
                  <section class="filterCategoryRightItemMenu">
                    <img
                      v-if="categoryRight.image_url"
                      :src="`${imgBaseUrl}${categoryRight.image_url}.png`"
                      class="filterCategoryRightItemIcon">
                    <span class="filterCategoryRightItemName">{{categoryRight.name}}</span>
                  </section>
                  <span class="filterCategoryRightItemCount">{{categoryRight.count}}</span>
                </v-touch>
              </ul>
            </li>
          </ul>
        </section>
        <section
          v-if="'filterSort' === filterMark"
          key="filterSort"
          class="filterSort">
          <ul class="filterSortUl">
            <v-touch
              tag="li"
              v-for="item in sortItems"
              :key="item.name"
              class="filterSortLi"
              @tap="foodSort(item.sortord)">
              <span class="filterSortName">{{item.name}}</span>
            </v-touch>
          </ul>
        </section>
        <section v-if="'filterMore' === filterMark" class="filterMore">
          <section class="deliveryMode">
            <h3 class="deliveryName">配送方式</h3>
            <ul class="deliveryModeUl">
              <v-touch
                v-for="mode in foodDeliveryData"
                :key="mode.id"
                tag="li"
                class="deliveryModeLi"
                :class="{deliverySeleted: mode.id === deliveryMode}"
                @tap="toggleDelivery(mode.id)">
                <span class="deliveryModeText">{{mode.text}}</span>
              </v-touch>
            </ul>
          </section>
          <section class="activity">
            <h3 class="activityName">商家属性（可以多选）</h3>
            <ul class="activityUl">
              <v-touch
                v-for="item in foodActivityData"
                :key="item.id"
                tag="li"
                class="activityLi"
                :class="{activitySelected: supportIds.includes(item.id)}"
                @tap="toggleActivity(item.id)">
                <span :style="{color: `#${item.icon_color}`, border: `1px solid #${item.icon_color}`}" class="activityIcon">{{item.icon_name}}</span>
                <span class="activityText">{{item.name}}</span>
              </v-touch>
            </ul>
          </section>
          <header class="activityOptionConfirm">
            <v-touch tag="input" type="button" value="清空" class="clear" @tap="clearMore" />
            <v-touch tag="input" type="button" :value="`确定${confirmValue}`" class="confirm" @tap="confirmMore" />
          </header>
        </section>
      </transition>
    </section>
    <scroll
      :click="true"
      :style="{height: scrollHeight, overflowY: 'auto'}"> <!-- 下拉加载先不写 -->
      <ShopList :shopListData="shopListData"></ShopList>
    </scroll>
    <transition name="fade">
      <v-touch
        v-if="blackScreenShow !== filterMark"
        tag="div"
        class="blackScreen"
        :style="{height: scrollHeight}"
        @tap="screenTap">
      </v-touch>
    </transition>
    <loading v-if="loading"></loading>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {shopList, foodCategory, foodDelivery, foodActivity} from '../service/getData'
import {imgBaseUrl} from '../config/url'
import TopBack from '../components/common/TopBack'

export default {
  name: 'foodCategory',

  components: {
    TopBack, // 因为要获取高度，所以采取同步写法
    ShopList: async () => import('../components/common/ShopList'),
    scroll: async () => import('../components/common/scroll'),
    loading: async () => import('../components/common/loading')
  },

  data () {
    return {
      shopListData: [],
      offset: 0,
      restaurantCategoryIds: '', // 具体餐种
      orderBy: '',
      deliveryMode: '', // 配送方式
      supportIds: [],
      guide: [
        {
          name: this.$route.query.restaurantCategoryTitle,
          id: 'filterCategory'
        },
        {
          name: '排序',
          id: 'filterSort'
        },
        {
          name: '筛选',
          id: 'filterMore'
        }
      ],
      categoryTitle: this.$route.query.restaurantCategoryTitle,
      foodCategoryData: [],
      foodDeliveryData: [],
      foodActivityData: [],
      filterMark: '', // 控制过滤选项的显示和消失
      imgBaseUrl,
      indexSelected: 0, // 具体餐种选项的选中序号
      blackScreenShow: '',
      scrollHeight: 'auto',
      sortItems: [
        {
          name: '智能排序',
          sortord: 'auto'
        },
        {
          name: '距离最近',
          sortord: 'distance'
        },
        {
          name: '销量最高',
          sortord: 'order'
        },
        {
          name: '起送价最低',
          sortord: 'minimumDeliveryAmount'
        },
        {
          name: '配送速度最快',
          sortord: 'duration'
        },
        {
          name: '评分最高',
          sortord: 'rating'
        }
      ],
      loading: false
    }
  },

  computed: {
    confirmValue () { // 确认按钮数字计算
      let supportIdsNum = this.supportIds.length
      if (this.deliveryMode === '') {
        if (supportIdsNum > 0) {
          return `(${supportIdsNum})`
        } else {
          return ''
        }
      } else {
        return `(${supportIdsNum + 1})`
      }
    },

    ...mapState([
      'latitude',
      'longitude',
      'clientHeight'
    ])
  },

  mounted () {
    this.shopListDataGet()
    this.foodCategoryDataGet()
    this.foodDeliveryDataGet()
    this.foodActivityDataGet()
    this.$nextTick(() => {
      // 获取scroll高度
      this.scrollHeight = `${this.clientHeight - this.$refs.filterNav.offsetHeight - this.$refs.head.$el.offsetHeight}px`
    })
  },

  methods: {
    async shopListDataGet () { // 商铺的列表
      try {
        this.loading = true
        let res = await shopList(
          this.latitude,
          this.longitude,
          this.offset,
          this.$route.query.restaurantCategoryId,
          this.restaurantCategoryIds,
          this.orderBy,
          this.deliveryMode,
          this.supportIds
        )
        this.shopListData = res
        this.loading = false
      } catch (e) {
        throw new Error(e)
      }
    },

    async foodCategoryDataGet () { // 分类信息列表
      try {
        let res = await foodCategory(this.latitude, this.longitude)
        for (let v of res) {
          v.categoryLeftSelected = false
          for (let sub of v.sub_categories) {
            sub.categoryRightSelected = false
          }
        }
        res[0].categoryLeftSelected = true
        this.foodCategoryData = res
      } catch (e) {
        throw new Error(e)
      }
    },

    async foodDeliveryDataGet () { // 配送方式
      try {
        let res = await foodDelivery(this.latitude, this.longitude)
        this.foodDeliveryData = res
      } catch (e) {
        throw new Error(e)
      }
    },

    async foodActivityDataGet () { // 活动数据
      try {
        let res = await foodActivity(this.latitude, this.longitude)
        this.foodActivityData = res
      } catch (e) {
        throw new Error(e)
      }
    },

    optionShow (id, index) {
      if (this.filterMark === id) { // 过滤方式的展开控制
        this.filterMark = ''
        if (index === 0) {
          this.guide[0].name = this.categoryTitle
        }
      } else {
        this.filterMark = id
        if (index === 0) {
          this.guide[0].name = '分类'
        }
      }
    },

    categoryLeftSelected (index) { // 具体餐种过滤右页面显示控制
      this.indexSelected = index
      this.foodCategoryData.forEach((v, ind) => {
        if (index === ind) {
          v.categoryLeftSelected = true
        } else {
          v.categoryLeftSelected = false
        }
      })
    },

    async categoryRightSelected (indexLeft, indexRight, id, name) {
      this.restaurantCategoryIds = id
      this.guide[0].name = name
      this.categoryTitle = name
      this.foodCategoryData.forEach((vLeft, indLeft) => {
        vLeft.sub_categories.forEach((vRight, indRight) => {
          if (indLeft === indexLeft && indRight === indexRight) {
            vRight.categoryRightSelected = true
          } else {
            vRight.categoryRightSelected = false
          }
        })
      })
      await this.shopListDataGet()
      this.filterMark = ''
    },

    screenTap () { // 点击遮罩
      this.filterMark = ''
    },

    foodSort (sortord) { // 排序
      switch (sortord) {
        case 'auto':
          // 不清楚智能排序的原则，先不管
          break
        case 'distance':
          this.shopListData.sort((a, b) => {
            let distanceA = parseFloat(a.distance)
            let distanceB = parseFloat(b.distance)
            if (distanceA >= distanceB) {
              return 1
            } else {
              return -1
            }
          })
          break
        case 'order':
          this.shopListData.sort((a, b) => {
            let orderA = a.recent_order_num
            let orderB = b.recent_order_num
            return orderB - orderA
          })
          break
        case 'minimumDeliveryAmount':
          this.shopListData.sort((a, b) => {
            let amoutA = a.float_minimum_order_amount
            let amoutB = b.float_minimum_order_amount
            return amoutB - amoutA
          })
          break
        case 'duration':
          this.shopListData.sort((a, b) => {
            let durationParse = function (duration) { // 将字符串时长转换为数字时长
              let durations = {}
              let durationArrayHour = duration.match(/\d+(?=小时)/)
              let durationArrayMinute = duration.match(/\d+(?=分钟)/)
              durationArrayHour ? durations.durationHour = durationArrayHour[0] : durations.durationHour = 0
              durationArrayMinute ? durations.durationMinute = durationArrayMinute[0] : durations.durationMinute = 0
              return durations.durationHour * 60 + durations.durationMinute
            }
            let durationA = durationParse(a.order_lead_time)
            let durationB = durationParse(b.order_lead_time)
            return durationA - durationB
          })
          break
        case 'rating':
          this.shopListData.sort((a, b) => {
            let ratingA = a.rating
            let ratingB = b.rating
            return ratingB - ratingA
          })
          break
      }
      this.filterMark = ''
    },

    toggleDelivery (id) { // 配送方式选择
      if (this.deliveryMode === id) {
        this.deliveryMode = ''
      } else {
        this.deliveryMode = id
      }
    },

    toggleActivity (id) { // more筛选
      if (this.supportIds.includes(id)) {
        let pos = this.supportIds.findIndex((value) => {
          return value === id
        })
        if (pos !== -1) {
          this.supportIds.splice(pos, 1)
        }
      } else {
        this.supportIds.push(id)
      }
    },

    clearMore () { // 清空筛选选项
      this.deliveryMode = ''
      this.supportIds.splice(0)
    },

    async confirmMore () { // 确认结果进行筛选
      await this.shopListDataGet()
      this.filterMark = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.blackScreen {
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.411);
}
.filterNav {
  .filterUl {
    display: flex;
    justify-content: space-between;
    .filterLi {
      height: .4rem;
      width: 30%;
      flex: auto;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: .15rem;
      color: #757575;
      background-color: #e9e9e9;
    }
    .foodSelected {
      color: #328fdb;
    }
  }
}
.filterOption {
  width: 100%;
  position: absolute;
  left: 0;
  top: .8rem;
  z-index: 1;
  .filterCategory {
    background-color: #fff;
    display: flex;
    height: 3rem;
    padding-bottom: .05rem;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    .filterCategoryLeftUl {
      overflow-y: auto;
      flex: auto 1 1;
      .filterCategoryLeftLi {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: .35rem;
        padding: 0 .15rem;
        .filterCategoryLeftMenu {
          display: flex;
          align-items: center;
          .filterCategoryLeftIcon {
            height: .2rem;
            width: auto;
          }
          .filterCategoryLeftName {
            font-size: .14rem;
            color: #727272;
            margin-left: .05rem;
          }
        }
        .filterCategoryLeftCount {
          color: #727272;
          font-size: .14rem;
        }
      }
    }
    .filterCategoryRightUl {
      flex: auto 3 1;
      overflow-y: auto;
      .filterCategoryRightLi {
        .filterCategoryRightItemUl {
          .filterCategoryRightItemLi {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: .35rem;
            padding: 0 .15rem;
            .filterCategoryRightItemMenu {
              display: flex;
              align-items: center;
              color: #727272;
              .filterCategoryRightItemIcon {
                height: .2rem;
                width: auto;
              }
              .filterCategoryRightItemName {
                font-size: .14rem;
                margin-left: .05rem;
              }
            }
            .filterCategoryRightItemCount {
              color: #727272;
              font-size: .14rem;
            }
          }
        }
      }
    }
  }
  .filterSort {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #fff;
    .filterSortUl {
      .filterSortLi {
        padding: 0 .1rem;
        height: .5rem;
        line-height: .5rem;
        border-bottom: 2px solid #e0e0e0;
        display: flex;
        justify-content: space-between;
        .filterSortName {
          font-size: .13rem;
          color: #646464;
        }
      }
    }
  }
  .filterMore {
    background-color: #fff;
    .deliveryMode {
      padding: 0 .1rem;
      .deliveryName {
        font-size: .13rem;
        color: #2b2b2b;
        height: .3rem;
        line-height: .3rem;
      }
      .deliveryModeUl {
        display: flex;
        padding: 0 .1rem;
        .deliveryModeLi {
          display: flex;
          flex: 30% 1 1;
          height: .4rem;
          align-items: center;
          .deliveryModeText {
            font-size: .14rem;
            color: #414141;
          }
        }
        .deliverySeleted {
          .deliveryModeText {
            color: #2ddada;
          }
        }
      }
    }
    .activity {
      padding: 0 .1rem;
      .activityName {
        font-size: .13rem;
        color: #2b2b2b;
        height: .3rem;
        line-height: .3rem;
      }
      .activityUl {
        display: flex;
        flex-wrap: wrap;
        padding: 0 .1rem;
        .activityLi {
          display: flex;
          flex: 30% 1 1;
          height: .4rem;
          align-items: center;
          .activityIcon {
            font-size: .13rem;
            margin-right: .05rem;
            border-radius: 3px;
            padding: 0 2px;
          }
          .activityText {
            font-size: .13rem;
            color: #414141;
          }
        }
        .activitySelected {
          .activityText {
            color: #2ddada;
          }
        }
      }
    }
    .activityOptionConfirm {
      display: flex;
      justify-content: space-between;
      background-color: #e2e2e2;
      padding: .05rem;
      .clear, .confirm {
        display: flex;
        flex: 50% 1 1;
        justify-content: center;
        height: .45rem;
        align-items: center;
        font-size: .17rem;
        border-radius: .05rem;
      }
      .clear {
        color: #5e5e5e;
        background-color: #fff;
      }
      .confirm {
        color: #fff;
        background-color: #30e24e;
        margin-left: .05rem;
      }
    }
  }
}
.categoryLeftSelected {
  position: relative;
  ::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: .03rem;
    background-color: #2e69d6;
  }
}
.categoryRightSelected {
  background-color: #dadada;
  .filterCategoryRightItemName {
    color:#2e69d6;
  }
}
</style>


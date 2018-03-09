<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name: 'scroll',

    props: {
      click: { // 是否响应点击事件
        type: Boolean,
        default: false
      },
      useTransition: {
        type: Boolean,
        default: true
      },
      probeType: {
        type: Number,
        default: 0
      },
      pullUpLoad: { // 上拉加载功能
        type: [Boolean, Object],
        default () {
          return false
        }
      },
      pullDownRefresh: { // 下拉刷新功能
        type: [Boolean, Object],
        default () {
          return false
        }
      },
      bounce: { // 回弹动画
        type: Boolean,
        default: true
      },

      scrollListen: { // 监听滚动
        type: Boolean,
        default: false
      },
      scrollEnd: { // 滚动结束
        type: Boolean,
        default: false
      },
      touchEnd: { // 手指离开
        type: Boolean,
        default: false
      },
      refreshDelay: { // 刷新延时
        type: Number,
        default: 0
      },
      watcherData: { // 所监听的数据变化
        type: Array,
        default () {
          return []
        }
      }
    },

    data () {
      return {
        scroll: ''
      }
    },

    watch: {
      watcherData (v) {
        setTimeout(() => {
          this.refresh()
        }, this.refreshDelay)
      }
    },

    mounted () {
      this.$nextTick(() => {
        this._initScroll()
      })
    },

    methods: {
      _initScroll () {
        if (!this.$refs.wrapper) return

        this.scroll = new BScroll(this.$refs.wrapper, {
          click: this.click,
          useTransition: this.useTransition,
          probeType: this.probeType,
          pullUpLoad: this.pullUpLoad,
          pullDownRefresh: this.pullDownRefresh,
          bounce: this.bounce
        })

        if (this.scrollListen) { // 页面滚动事件
          this.scroll.on('scroll', () => {
            this.$emit('scroll', this.scroll)
          })
        }

        if (this.scrollEnd) { // 滚动结束
          this.scroll.on('scrollEnd', pos => {
            this.$emit('scrollEnd', pos)
          })
        }

        if (this.touchEnd) { // 鼠标/手指离开
          this.scroll.on('touchEnd', pos => {
            this.$emit('touchEnd', pos)
          })
        }

        if (this.pullUpLoad) { // 上拉加载，需要开启上拉加载功能和在加载完成后运行finishPullUp()方法告诉BS数据加载完成
          this.scroll.on('pullingUp', () => {
            this.$emit('pullingUp', this.scroll)
          })
        }

        if (this.pullDownRefresh) { // 下拉刷新，需要开启下拉刷新功能和在加载完成后运行finishPullDown()方法告诉BS刷新完成
          this.scroll.on('pullingDown', () => {
            this.$emit('pullingDown', this.scroll)
          })
        }
      },

      refresh () {
        this.scroll && this.scroll.refresh()
      }
    }
  }
</script>

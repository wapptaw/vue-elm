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
        default: true
      },
      useTransition: {
        type: Boolean,
        default: true //
      },
      probeType: {
        type: Number,
        default: 0
      },
      pullUpLoad: {
        type: [Boolean, Object],
        default: false
      },

      pullup: { // 是否可上拉
        type: Boolean,
        default: false
      },
      pulldown: { // 是否可下拉
        type: Boolean,
        default: false
      },
      refreshDelay: { // 刷新延时
        type: Number,
        default: 20
      },
      scrollListen: {
        type: Boolean,
        default: false
      },
      watcherData: {
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
          pullUpLoad: this.pullUpLoad
        })

        if (this.pullup) { // 上拉，手指离开屏幕后
          this.scroll.on('scrollEnd', () => {
            if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
              this.$emit('scrollToEnd')
            }
          })
        }

        if (this.pulldown) { // 下拉，手指离开屏幕后
          this.scroll.on('touchEnd', pos => {
            if (pos.y > 50) {
              this.$emit('pulldown')
            }
          })
        }

        if (this.scrollListen) {
          this.scroll.on('scroll', val => {
            this.$emit('scroll', val)
          })
        }

        if (this.pullUpLoad) { // 上拉
          this.scroll.on('pullingUp', () => {
            this.$emit('pullingUp', this.scroll)
          })
        }
      },

      refresh () {
        this.scroll && this.scroll.refresh()
      }
    }
  }
</script>

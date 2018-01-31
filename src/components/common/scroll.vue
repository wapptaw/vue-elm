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
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      scrollX: {
        type: Boolean,
        default: false
      },
      scrollY: {
        type: Boolean,
        default: true
      },
      listenScroll: {
        type: Boolean,
        default: false
      },
      data: {
        type: Array,
        default: null
      },
      pullup: {
        type: Boolean,
        default: false
      },
      pulldown: {
        type: Boolean,
        default: false
      },
      beforeScroll: {
        type: Boolean,
        default: false
      },
      refreshDelay: {
        type: Number,
        default: 20
      },
      useTransition: {
        type: Boolean,
        default: false
      },
      pullUpLoad: {
        type: [Boolean, Object],
        default: false
      },
      pullingUp: {
        type: Boolean,
        default: false
      }
    },

    data () {
      return {
        scroll: ''
      }
    },

    computed: {
      posY () {
        if (this.scroll) {
          return this.scroll.y
        }
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
          probeType: this.probeType,
          click: this.click,
          scrollX: this.scrollX,
          scrollY: this.scrollY,
          useTransition: this.useTransition,
          pullUpLoad: this.pullUpLoad
        })

        if (this.listenScroll) {
          this.scroll.on('scroll', pos => {
            this.$emit('scroll', pos, this)
          })
        }

        if (this.pullup) { // 上拉
          this.scroll.on('scrollEnd', () => {
            if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
              this.$emit('scrollToEnd')
            }
          })
        }

        if (this.pullingUp) { // 上拉（只激活一次）
          this.scroll.on('pullingUp', () => {
            this.$emit('pullingUp')
          })
        }

        if (this.pulldown) { // 下拉
          this.scroll.on('touchEnd', pos => {
            if (pos.y > 50) {
              this.$emit('pulldown')
            }
          })
        }

        if (this.beforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScroll')
          })
        }
      },

      disable () {
        this.scroll && this.scroll.disable()
      },

      enable () {
        this.scroll && this.scroll.enable()
      },

      refresh () {
        this.scroll && this.scroll.refresh()
      },

      scrollTo () {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },

      scrollToElement () {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },

    watch: {
      data () {
        setTimeout(() => {
          this.refresh()
        }, this.refreshDelay)
      },

      posY (newPosY) {
        this.$emit('posChange', newPosY) // 监听y轴变化
      }
    }
  }
</script>


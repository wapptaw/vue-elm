<template>
  <div
    class="ball"
    :style="{left: posX + 'px', top: posY + 'px'}"></div>
</template>

<script>
export default {
  name: 'ballMove',

  props: {
    start: { // 开始坐标
      type: Object,
      default () {
        return {
          x: 0,
          y: 0
        }
      }
    },

    end: { // 结束坐标
      type: Object,
      default () {
        return {
          x: 0,
          y: 0
        }
      }
    }
  },

  data () {
    return {
      posX: null,
      posY: null,
      speed: -10 // 速率
    }
  },

  mounted () {
    this.pos()
  },

  methods: {
    pos () {
      let posYGet = this.posEquation(this.start, this.end)
      this.posX = this.start.x
      let timer = setInterval(() => {
        this.posX += this.speed
        if (this.posX <= this.end.x) {
          this.posX = this.end.x
          this.$emit('ballMoveFinish')
          clearInterval(timer)
        }
        this.posY = posYGet(this.posX)
      }, 20)
    },

    posEquation (start, end) { // 求抛物线函数（采用顶点式：y=a(x-h)^2+k (h是顶点坐标的x,k是顶点坐标的y)）
      let a = (end.y - start.y) / Math.pow((end.x - start.x), 2)
      return function (posX) {
        return a * Math.pow((posX - start.x), 2) + start.y // 根据x坐标求出y坐标
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .ball {
    position: fixed;
    width: .15rem;
    height: .15rem;
    background-color: #147da7;
    border-radius: .1rem;
  }
</style>


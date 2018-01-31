<template>
  <div class="back">
    <v-touch tag="a" class="btn" @tap="goBack">返回</v-touch>
    {{title}}
    <slot></slot>
  </div>
</template>

<script>
export default { // 返回栏
  name: 'TopBack',

  props: {
    title: {
      type: String,
      default: '我是标题'
    }
  },

  methods: {
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
  .back {
    width: 100%;
    height: .4rem;
    line-height: .4rem;
    font-size: .15rem;
    background-color: #0f96e4;
    text-align: center;
    position: relative;
    .btn {
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      height: .4rem;
      line-height: .4rem;
      width: .5rem;
      background-color: #056eac;
      color: #fff;
      text-align: center;
    }
  }
</style>


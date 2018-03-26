<template>
  <transition name="fade">
    <v-touch
      tag="div"
      class="matte"
      :style="{zIndex: zIndex}"
      @tap="tapScreen"></v-touch>
  </transition>
</template>

<script>
export default {
  name: 'MatteOpacity',

  props: {
    zIndex: {
      type: [String, Number],
      default: 'auto'
    }
  },

  methods: {
    tapScreen () {
      this.$emit('tapScreen')
    }
  }
}
</script>

<style lang="scss" scoped>
  .matte {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, .5);
  }
  .fade-enter-active {
    animation: fade .2s;
  }
  .fade-leave-active {
    animation: fade .2s reverse;
  }
  @keyframes fade {
    0% {
      opacity: 0;
    }
    100% {
      opacity: .5;
    }
  }
</style>


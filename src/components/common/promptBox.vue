<template>
  <div
    :style="{height: boxHeight, top: boxTop, bottom: boxBottom}"
    class="prompBox">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'promptBox',

  props: {
    boxHeight: {
      type: [String, Number],
      default: 0
    },
    boxTop: {
      type: [String, Number],
      default: 'auto'
    },
    boxBottom: {
      type: [String, Number],
      default: 'auto'
    }
  }
}
</script>

<style lang="scss" scoped>
.prompBox {
  width: 100%;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  overflow: hidden;
}
</style>

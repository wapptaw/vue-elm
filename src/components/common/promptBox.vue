<template>
  <div
    :style="boxStyle"
    class="prompBox">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'promptBox',

  props: {
    boxStyle: {
      type: Object,
      default () {
        return {
          height: 0,
          top: 'auto',
          bottom: 'auto'
        }
      }
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

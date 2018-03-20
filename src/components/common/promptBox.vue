<template>
  <div
    :style="boxStyle"
    class="promptBox">
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
.promptBox {
  width: 100%;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  overflow: hidden;
}
</style>

<template>
  <transition name="fade">
    <div class="loading">
      <div class="circleLeft"></div>
      <div class="circleRight"></div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'loading'
}
</script>

<style lang="scss" scoped>
  .loading {
    position: fixed;
    width: .4rem;
    height: .4rem;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    border-radius: 50%;
    overflow: hidden;
    mask: radial-gradient(transparent 55%, #000 55%);
    animation: rotate 1s linear infinite;
    .circleLeft {
      width: 50%;
      height: 100%;
      background: linear-gradient(rgb(2, 211, 248), rgba(2, 211, 248, .5));
    }
    .circleRight {
      width: 50%;
      height: 100%;
      background: linear-gradient(rgba(0, 0, 0, 0), rgba(2, 211, 248, .5));
    }
  }
  @keyframes rotate {
    0% {
      transform: translate(-50%, -50%) rotateZ(0);
    }
    100% {
      transform: translate(-50%, -50%) rotateZ(360deg);
    }
  }
</style>

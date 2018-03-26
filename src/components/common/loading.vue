<template>
  <div class="loading">
    <div class="circleLeft"></div>
    <div class="cicleRight"></div>
  </div>
</template>

<script>
export default {
  name: 'loading'
}
</script>

<style lang="scss" scoped>
  .loading {
    position: fixed;
    width: 1rem;
    height: 1rem;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    mask: radial-gradient(transparent 50%, #000 50%);
    background-color: #000;
  } // 还需要研究渐变和mask
</style>

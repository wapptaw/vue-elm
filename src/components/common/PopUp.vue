<template>
  <transition name="shake">
    <div class="popup">
      <p class="warnMessage">{{warnMessage}}</p>
      <v-touch
        tag="footer"
        class="popupConfirm"
        @tap="confirm">确定</v-touch>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'PopUp',

  props: {
    warnMessage: {
      type: String,
      default: ''
    }
  },

  methods: {
    confirm () {
      this.$emit('warnConfirm')
    }
  }
}
</script>

<style lang="scss" scoped>
  .popup {
    width: 80vw;
    height: 40vw;
    background-color: #ebebeb;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: scale(1) translate(-50%, -50%);
    padding: .05rem;
    box-sizing: border-box;
    border-radius: .05rem;
    .warnMessage {
      line-height: .25rem;
      font-size: .16rem;
      color: #5e5e5e;
      padding: .1rem;
    }
    .popupConfirm {
      width: 95%;
      height: 25%;
      border-radius: .05rem;
      background-color: #2996d4;
      color: #fff;
      font-size: .15rem;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      bottom: .1rem;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .shake-enter-active {
    animation: shake .4s;
  }
  @keyframes shake {
    0% {
      transform: translate(-50%, -50%) scale(1);
    }
    25% {
      transform: translate(-50%, -50%) scale(1.2);
    }
    50% {
      transform: translate(-50%, -50%) scale(1);
    }
    75% {
      transform: translate(-50%, -50%) scale(1.2);
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
    }
  }
</style>


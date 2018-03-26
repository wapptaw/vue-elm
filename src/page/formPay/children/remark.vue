<template>
  <div class="remark">
    <top-back title="备注"></top-back>
  </div>
</template>

<script>
import {getRemark} from '../../../service/getData'
import TopBack from '../../../components/common/TopBack'

export default {
  name: 'remark',

  components: {
    TopBack
  },

  data () {
    return {
      remarkData: ''
    }
  },

  mounted () {
    //
  },

  methods: {
    async remarkDataGet () {
      try {
        let res = getRemark() // 缺参数
        this.remarkData = res
      } catch (e) {
        throw new Error(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .remark {
    width: 100%;
    height: 100%;
    background-color: #fff;
    position: fixed;
    left: 0;
    top: 0;
  }
</style>


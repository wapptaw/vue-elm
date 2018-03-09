<template>
  <div class="search">
    <input type="text" class="searchVal" :placeholder="placeholder" v-model="inputVal" @input="input">
    <v-touch tag="input" type="button" class="searchBox" value="搜索" @tap="search"></v-touch>
    <ul class="searchList">
      <li></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SearchBox',

  props: {
    placeholder: {
      type: String,
      default: '请输入一些字符'
    },
    inputEventAble: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      inputVal: '',
      searchList: ''
    }
  },

  mounted () {
    this.heightGet()
  },

  methods: {
    search () {
      if (this.inputVal) {
        this.$emit('getSearchData', this.inputVal) // 输出事件
      }
    },

    input () {
      if (this.inputEventAble) {
        this.$emit('changeVal', this.inputVal)
      }
    },

    heightGet () {
      this.$emit('heightGet', 60)
    }
  }
}
</script>

<style lang="scss" scoped>
  .search {
    width: 100%;
    font-size: 0;
    box-sizing: border-box;
    padding: .1rem .05rem;
    display: flex;
    justify-content: space-between;
    .searchVal, .searchBox {
      height: .4rem;
      line-height: .4rem;
      font-size: .15rem;
      color: #1f1f1f;
      box-sizing: border-box;
      vertical-align: middle;
    }
    .searchVal {
      border: 1px solid #1f1f1f;
      text-indent: .1rem;
      width: 80%;
      border-radius: .05rem;
      background-color: #e9e9e9;
    }
    .searchBox {
      width: 18%;
      background-color: #025db3;
      border-radius: .05rem;
      color: #fff;
    }
  }
</style>


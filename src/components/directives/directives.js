import Vue from 'vue'

Vue.directive('scroll', {
  inserted (el, binding) {
    el.addEventListener('scroll', function () {
      let search = el.querySelector('.limit')
      let offsetTop = parseFloat(search.offsetTop - el.scrollTop)
      if (offsetTop <= 0) {
        binding.value.up()
      } else {
        binding.value.down()
      }
    })
  }
})

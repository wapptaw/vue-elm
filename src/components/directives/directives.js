import Vue from 'vue'

Vue.directive('touchMove', {
  inserted (el, binding) {
    let start, date, dateStart
    let scrollPrevious = 0 // 保存滚动条上次所在位置
    let moveSave = []
    let dateSave = []
    let timmer = null
    let scrollNow = 0 // 滚动当前所在位置
    
    el.addEventListener('touchstart', function (e) {
      clearInterval(timmer)
      moveSave = []
      dateSave = []
      scrollPrevious = el.scrollTop
      start = e.targetTouches[0].clientY // 手指开始接触屏幕时所在屏幕Y轴位置
      dateStart = new Date()
    })

    el.addEventListener('touchmove', function (e) {
      e.preventDefault()
      let move = e.targetTouches[0].clientY // 手指滑动时所在屏幕Y轴位置
      let distance = move - start // 每次滑动的距离
      let date = new Date()
       
      if (moveSave.length < 2) {
        moveSave.push(move)
        dateSave.push(date)
      } else {
        moveSave.shift()
        moveSave.push(move)
        dateSave.shift()
        dateSave.push(date)
      }
      el.scrollTop = -distance + scrollPrevious
    })

    el.addEventListener('touchend', function (e) {
      let speed = 0 // 滑动速度（单位ms）
      let elementHeight = el.scrollHeight - el.clientHeight // 滚动条最大值
      if (moveSave.length < 2) {
        speed = (moveSave[0] - start) / (dateSave[0] - dateStart)
      } else {
        speed = (moveSave[1] - moveSave[0]) / (dateSave[1] - dateSave[0])
      }
      if (speed > 5) { // 限制speed的最大值跟最小值
        speed = 5
      }
      if (speed < -5) {
        speed = -5
      }
      if (Math.abs(speed) > .5) {
        timmer = setInterval(function() {
          if (speed < 0) {
            speed = speed + 0.01
            if (speed >= 0) {
              speed = 0
            }
            scrollNow += -speed * 16
          } else if (speed > 0) {
            speed = speed - 0.01
            if (speed <= 0) {
              speed = 0
            }
            scrollNow -= speed * 16 
          }
          el.scrollTop = scrollNow
          if (speed === 0 || el.scrollTop === 0 || el.scrollTop === elementHeight) {
            clearInterval(timmer)
          }
        }, 16)
      }
    })
  }
}) // 加一些回调函数

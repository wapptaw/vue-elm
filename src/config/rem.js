export const switchRem = distance => { // 返回不带单位的rem值
  let html = document.getElementsByTagName('html')[0]
  let initSize = getComputedStyle(html).fontSize
  let constant = parseFloat(initSize)
  let param = parseFloat(distance)
  if (/px$/.test(distance)) {
    return param / constant
  }
  if (/rem$/.test(distance)) {
    return param
  }
}

export const switchPx = distance => { // 返回不带单位的px值
  let html = document.getElementsByTagName('html')[0]
  let initSize = getComputedStyle(html).fontSize
  let constant = parseFloat(initSize)
  let param = parseFloat(distance)
  if (/px$/.test(distance)) {
    return param
  }
  if (/rem$/.test(distance)) {
    return param * constant
  }
}

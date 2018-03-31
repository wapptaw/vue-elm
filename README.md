# 前言

一直想做个稍微复杂点的vue实战项目，逛论坛时看到有大牛做了个饿了么网站，就模仿了一个，所有的数据都是抓取他搭建的服务器上的，因为对webpack不太熟练，所以就用了vue-cli脚手架搭建项目。

## 技术栈

vue2 + vuex + vue-router + vue-resource + vue-cli + ES6/7 + sass + flex

## 项目运行

```
git clone https://github.com/wapptaw/vue-elm.git

cd vue-elm

npm install

npm run dev

```
## 功能
* 定位功能
* 选择城市
* 搜多地址
* 展示附近商家
* 搜索店铺
* 店铺分类展示
* 店铺分类选择、排序
* 店铺食品列表页
* 店铺评价页
* 商家详情页
* 购物车功能
* 登录、注册、改密码功能
* 个人中心
* 下单功能
* 订单列表
* 订单详情
* 添加收货地址
* 账户信息

# 总结

1、不知什么原因，获取的图片验证码总是过期的，所以实际上是登陆不上的，不过不影响，页面照写。

2、一些api失效了，所以有些地方不能使用，不过对于练手来说还是足够了。

# 部分截图

![1](https://github.com/wapptaw/vue-elm/blob/master/screen/20180331_144418.gif)
![2](https://github.com/wapptaw/vue-elm/blob/master/screen/20180331_144621.gif)
![3](https://github.com/wapptaw/vue-elm/blob/master/screen/20180331_145057.gif)
![4](https://github.com/wapptaw/vue-elm/blob/master/screen/20180331_145222.gif)
![5](https://github.com/wapptaw/vue-elm/blob/master/screen/20180331_145432.gif)
![6](https://github.com/wapptaw/vue-elm/blob/master/screen/20180331_145658.gif)
![7](https://github.com/wapptaw/vue-elm/blob/master/screen/20180331_145908.gif)
![8](https://github.com/wapptaw/vue-elm/blob/master/screen/20180331_150428.gif)

# 项目布局

```
.
├── build                                               // webpack配置文件
├── config                                              // webpack自行配置文件
├── screen                                              // 部分截图
├── src                                                 // 源码目录
│   ├── components                                      // 组件
│   │   └── common                                      // 公共组件
│   │       ├── ballMove.vue                            // 购物移动球组件
│   │       ├── BottomNav.vue                           // 底部导航组件
│   │       ├── loading.vue                             // 等待动画组件
│   │       ├── MatteOpacity.vue                        // 遮罩组件
│   │       ├── PopUp.vue                               // 弹窗组件
│   │       ├── promptBox.vue                           // 上拉下拉提示组件
│   │       ├── scroll.vue                              // better-scroll组件
│   │       ├── SearchBox.vue                           // 搜索窗组件
│   │       ├── ShopList.vue                            // 商品列表组件
│   │       └── TopBack.vue                             // 顶部标题栏组件
│   ├── config                                          // 基本配置
│   │   ├── fetch.js                                    // 数据获取函数
│   │   ├── rem.js                                      // px和rem互转函数
│   │   └── url.js                                      // url链接的开头
│   ├── page
│   │   ├── city
│   │   │   ├── AddressSearch.vue                       // 地址搜索和选择
│   │   │   └── CitySelect.vue                          // 城市搜索和选择
│   │   ├── deliveryAddress
│   │   │   ├── children
│   │   │   │   ├── addressAdd.vue                      // 增加收获地址
│   │   │   │   └── addressNearby.vue                   // 附近地址搜索
│   │   │   └── deliveryAddress.vue                     // 收获地址列表
│   │   ├── FoodPage
│   │   │   ├── children
│   │   │   │   ├── children
│   │   │   │   │   └── shopSafe.vue                    // 店铺安全展示
│   │   │   │   ├── evaluate.vue                        // 店铺评论
│   │   │   │   ├── merchant.vue                        // 店铺详情
│   │   │   │   └── order.vue                           // 店铺商品展示
│   │   │   └── FoodPage.vue                            // 店铺页
│   │   ├── forget
│   │   │   └── resetPassword.vue                       // 重置密码
│   │   ├── formPay
│   │   │   ├── children
│   │   │   │   ├── invoice.vue                         // 选择发票
│   │   │   │   ├── payPage.vue                         // 付款页
│   │   │   │   └── remark.vue                          // 预留信息
│   │   │   └── OrderConfirm.vue                        // 订单确认页
│   │   ├── Home
│   │   │   ├── children
│   │   │   │   ├── children
│   │   │   │   │   ├── orderFormDetail.vue             // 订单详情
│   │   │   │   │   └── userInfo.vue                    // 用户详情
│   │   │   │   ├── OrderForm.vue                       // 订单列表
│   │   │   │   ├── ShopSearch.vue                      // 店铺搜索
│   │   │   │   ├── TakeOut.vue                         // 首页导航
│   │   │   │   └── user.vue                            // 个人中心
│   │   │   └── home.vue                                // home页
│   │   ├── login
│   │   │   └── login.vue                               // 登录/注册
│   │   └── FoodCategory.vue                            // 店铺分类展示
│   ├── plugin
│   │   └── userInfo.js
│   ├── router
│   │   └── index.js                                    // 路由配置
│   ├── service
│   │   └── getData.js                                  // 数据获取
│   ├── store                                           // vuex配置
│   │   ├── actions.js
│   │   ├── getters.js
│   │   ├── index.js
│   │   └── mutations.js
│   ├── style
│   │   ├── animation.scss                              // 全局动画样式
│   │   └── init.scss                                   // 样式初始化
│   ├── App.vue                                         // 页面入口
│   └── main.js                                         // 程序入口
├── favicon.ico                                         // 图标
├── index.html                                          // 入口html
.
```
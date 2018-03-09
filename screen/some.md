### vue操纵dom
1. ref
2. 自定义插件
3. 一些确定位置和测量长度的方法
4. 使用fixed
5. js自定义事件
6. js防止点击过快
7. vue视图不能自动响应的地方
(1)对象属性的添加或者删除 (2) 未在data里声明的属性 (3) 使用数组序号修改数组值(修改里的对象的属性值有些可以响应，有些不可以，不知道为啥) (4) 修改数组长度
解决方法：使用set(Object, key, value)
8. css属性scroll-behavior,可以控制scrollTo、scrollIntoView、scrollTop、scrollLeft这些影响滚动的函数或属性的行为，接受两个值auto和smooth,默认值auto表示立刻到指定位置，smooth表示平滑的滚动到指定位置
9. display: flex属性下的img标签的宽高不能自动调节，需要手动设置为100%
10. vue组件选项的推荐顺序
> 副作用(触发组件外的影响)
* el
> 全局感知(要求组件以外的知识)
* name
* parent
> 组件类型 (更改组件的类型)
* functional
> 模板修改器 (改变模板的编译方式)
* delimiters
* comments
> 模板依赖 (模板内使用的资源)
* components
* directives
* filters
> 组合 (向选项里合并属性)
* extends
* mixins
> 接口 (组件的接口)
* inheritAttrs
* model
* props / propsData
> 本地状态 (本地的响应式属性)
* data
* computed
> 事件 (通过响应式事件触发的回调)
* watch
* 生命周期钩子(按照它们被调用的顺序)
> 非响应式的属性 (不依赖响应系统的实例属性)
* methods
> 渲染 (组件输出的声明式描述)
* template / render
* renderError

11. vue元素特性顺序推荐
> 定义 (提供组件的选项)
* is
> 列表渲染 (创建多个变化的相同元素)
* v-for
> 条件渲染 (元素是否渲染/显示)
* v-if
* v-else-if
* v-else
* v-show
* v-cloak
> 渲染方式 (改变元素的渲染方式)
* v-pre
* v-once
> 全局感知 (需要超越组件的知识)
* id
> 唯一的特性 (需要唯一值的特性)
* ref
* key
* slot
> 双向绑定 (把绑定和事件结合起来)
* v-model
> 其它特性 (所有普通的绑定或未绑定的特性)
> 事件 (组件事件监听器)
* v-on
> 内容 (复写元素的内容)
* v-html
* v-text
13. better-scroll写一些实例
14. fixed跟transform冲突
15. vue组件最外层元素最好不要设置class，因为可能造成class污染
16. js异步：js有两种运行机制，一种是同步，一种是异步，异步常见的有网络请求，io操作，定时器
    > 常用的异步操作方式有: 
    1. 回调函数：把函数作为异步函数的参数，异步操作完成后再来顶用此回调函数
    2. promise: 原理是发布/订阅，异步操作完成后就发出一个成功或者失败信号，然后被监听器捕获，告诉其它操作异步操作完成了
    3. generator: 可以保存一连串操作状态，然后手动取出状态，完成一个状态后就会暂停，需要手动取出下一个状态
17. better-scroll里的scrollEnd事件和touchEnd事件
    1. 相同点：触发时手指或鼠标都离开了屏幕
    2. 不同点：
        1. touchEnd只要手指离开就能触发而scrollEnd必须滚动屏幕后手指离开触发
        2. 当有滚动动画时，scrollEnd需要在滚动动画结束后触发，而touchEnd在手指离开后立即出发，无论是否有滚动动画
        3. 当有回弹动画时，scrollEnd需要在回弹动画结束后触发，而touchEnd不需要
18. vue组件的渲染完成的时机（使用ref获取组件计算高度时容易获取不到或则高度计算不准确，怀疑是组件渲染未完成，使用nextTick也不行啊)
    1. 当vue组件采取异步加载时无法通过ref获取组件属性，当采取同步加载时可以获取组件Vue属性,可以读取属性值，例如：this.$refs.test.$el.offsetHeight可以读取ref为test的组件的offsetHeight值
    2. 当组件内有通过异步获取的数据时，需要在数据加载完成后再获取css属性值

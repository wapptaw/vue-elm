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
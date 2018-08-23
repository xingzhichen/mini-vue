# vue
看完源码还是自己手撸一个简单的加深功力



![截图](http://olcuk3z9a.bkt.clouddn.com/8%E6%9C%88-24-2018%2001-27-11.gif)

## 已完成
- [x] 勾选 初始化
- [x] 数据劫持
- [x] watcher observe dep等
- [x]  ast
- [x] render函数
- [x] vdom
- [x] patch
第一版本完成

## 待完成(第二版本)
- [ ] 代码优化,,现在代码结构有点乱
- [ ] 支持组件



***
写完第一版感想：

其实写之前就知道最难的部分不是patch，不是数据劫持，而是字符串转token，再转ast，转render函数从而算出vdom。

1. 转token，真是考验正则功力！特别是对各种情况属性的匹配，对`<` 开头的各种处理等！
2. 转ast，稍微简单了点，只不过是吧杂乱的token整理规范化，注意的是以后我们本来整个render函数是当字符串运行，所以非表达式得 JSON.stringify下
3. 转render最头疼的就是调试问题，我们拼成render函数，在new Function运行，总会报错，各种缺少括号，乱七八糟
4. 转成功render生产vdom和patch就很简单了

所以说，到底基础得好到程度才能想出这么一套mvvm框架来，到底数据结构多牢固才能想出o(n)的diff算法来。我等菜鸡只能慢慢前进啊
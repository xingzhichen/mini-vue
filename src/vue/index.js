// 1.添加静态方法
// 2. 添加实例方法
// 3. 添加初始化函数
import initGlobal from './core/global'
import initInstance from './core/instance'
import initConstruction from './core/construction'

export default class Vue {
  constructor(options) {
    this.init(options)
  }
}
initGlobal(Vue);
initInstance(Vue);
initConstruction(Vue);



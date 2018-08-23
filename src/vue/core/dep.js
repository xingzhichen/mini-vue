let depId = 0

export default class Dep {
  constructor() {
    this.depId = ++depId;
    this.watchers = []
  }

  depend() {
    const watcher = Dep.target;
    const isDepend = !(this.watchers.filter(item => item.watcherId === watcher.watcherId).length > 0);
    if (isDepend) {
      this.watchers.push(watcher);
      watcher.appendDep(this);
    }
  }

  notify() {
    this.watchers.forEach(item => item.update());
  }

}
Dep.setTarget = function (watcher) {
  Dep.target = watcher
}
window.Dep = Dep

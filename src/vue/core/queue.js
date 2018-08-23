import {nextTick} from '../utils'

let isFlushing = false;
let queue = []
export default function (watcher) {

  if (!isFlushing) {
    queue.push(watcher)
  } else {
    let i = queue.length - 1
    while (i > 0 && queue[i].watcherId > watcher.watcherId) {
      i--
    }
    queue.splice(i + 1, 0, watcher)
  }
  nextTick(flush)
}

function flush() {
  isFlushing = true;
  queue.sort((a, b) => a.watcherId - b.watcherId);
  queue.forEach(item => {
    item.getValue()
  })
  isFlushing = false;
  queue = [];

}
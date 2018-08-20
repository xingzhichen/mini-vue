let executeFunc
let callBack = []
if (typeof Promise !== 'undefined') {
  executeFunc = () => {
    Promise.resolve().then(flushCallbacks)
  }
} else {
  executeFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}

function flushCallbacks() {
  callBack.forEach(item => item())
  callBack = []
}

export function nextTick(cb, ctx) {
  callBack.push(cb.bind(ctx))
  executeFunc()
}
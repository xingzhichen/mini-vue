let domPropsHandlerMap = {
  'value': function (ele, key, value) {
    ele.value = value || ''
  },
  'textContent': function (ele, key, value) {
    ele.innerText = value || '';
    return true
  },
  'innerHTML': function (ele, key, value) {
    ele.innerHTML = value || '';
    return true
  }
}

let traverseObj = obj => callback => {
  Object.keys(obj).forEach(key => {
    let value = obj[key]
    if (callback(obj, key, value)) {
      return
    }
  })
}


function isRealynode(ele) {
  return ele instanceof Node
}

function isExist(arg) {
  return arg != null
}

function $(arg) {
  return document.querySelector(arg)
}

function sameNode(oldVnode, newVnode) {
  if (!isExist(oldVnode.tag) && oldVnode.text) {
    return true
  }
  return oldVnode.tag === newVnode.tag &&
      oldVnode.key === newVnode.key &&
      isExist(oldVnode.data) && isExist(newVnode.data)
}

let parent = null
export default function patch(oldVnode, newVnode, vm) {
  //当oldVnode不存在时候  渲染整个页面
  if (!isExist(oldVnode)) {
    if (isExist(newVnode)) {
      // renderPage(newVnode, , vm)
      insertElement($(vm.$options.el), newVnode, null, vm)
      return
    }
  }
  if (!isExist(newVnode)) {
    removeDom(oldVnode)
    return
  }
  diff(oldVnode, newVnode, vm)
}


function diff(oldVnode, newVnode, vm) {
  newVnode.parent = oldVnode.parent
  newVnode.dom = oldVnode.dom
  if (oldVnode.text) {
    if (newVnode.children) {
      insertElement(oldVnode.parent.dom, newVnode, null, vm)
    }

  }
  if (newVnode.text) {
    if (oldVnode.children) {
      insertElement(oldVnode.parent.dom, newVnode, null, vm)
      return
    }
    if (oldVnode.text) {
      if (oldVnode.text !== newVnode.text) {
        oldVnode.dom.nodeValue = newVnode.text;
        return
      }
    }
    return
  }
  if (sameNode(oldVnode, newVnode)) {
    updateAttrs(oldVnode, newVnode, vm) //属性比较
    updateDomProps(oldVnode, newVnode, vm)
    if (oldVnode.children && newVnode.children) {
      if (!oldVnode.children.length && newVnode.children.length) {
        insertElement(oldVnode.parent.dom, newVnode, null, vm)
      }
      if (oldVnode.children.length && !newVnode.children.length) {
        removeDom(oldVnode.children)
      }
      if (oldVnode.children.length && newVnode.children.length) {
        updateChildren(oldVnode.children, newVnode.children, vm)
      }
    }

  } else {
    insertElement(oldVnode.parent.dom, newVnode, null, vm)
  }


}


function updateChildren(oldChildren, newChildren, vm) {
  let oldStart = 0,
      oldEnd = oldChildren.length - 1,
      newStart = 0,
      newEnd = newChildren.length - 1;
  while (oldStart <= oldEnd && newStart <= newEnd) {
    if (sameNode(oldChildren[oldStart], newChildren[newStart])) {
      diff(oldChildren[oldStart], newChildren[newStart], vm);
      oldStart++;
      newStart++;
      continue
    }
    if (sameNode(oldChildren[oldEnd], newChildren[newEnd])) {
      diff(oldChildren[oldEnd], newChildren[newEnd], vm);
      oldEnd--;
      newEnd--;
      continue
    }
    if (sameNode(oldChildren[oldStart], newChildren[newEnd])) {
      diff(oldChildren[oldStart], newChildren[newEnd], vm);
      insertElement(
          oldChildren[oldStart].parent.dom,
          newChildren[newEnd].dom,
          oldChildren[oldEnd].nextSibling,
          vm
      )
      oldStart++;
      newEnd--;
      continue;
    }
    if (sameNode(oldChildren[oldEnd], newChildren[newStart])) {
      diff(oldChildren[oldEnd], newChildren[newStart], vm);
      insertElement(
          oldChildren[oldStart].parent.dom,
          newChildren[newStart].dom,
          oldStart[oldEnd].dom,
          vm
      )
      oldStart--;
      newEnd++;
      continue
    }
    if (!isExist(oldChildren[oldStart])) {
      oldStart++;
      continue;
    }
    if (!isExist(oldChildren[oldEnd])) {
      oldEnd--;
      continue;
    }
    //比较有可能存在相同k值
    let keyObj = {}
    oldChildren.forEach((item, idx) => {
      keyObj.key && (keyObj[keyObj.key] = idx)
    })
    let index;
    if (index = keyObj[newChildren[newStart].key]) {
      diff(oldChildren[index], newChildren[newStart])
      insertElement(
          oldChildren[index].parent.dom,
          newChildren[newStart].dom,
          oldChildren[oldStart].dom,
          vm
      )
      oldChildren[index] = null;
    } else {
      debugger
      insertElement(
          oldChildren[oldStart].parent.dom,
          newChildren[newStart],
          oldChildren[oldStart].dom,
          vm
      )
    }

    newStart++;

  }
  if (oldStart <= oldEnd) {

    while (oldStart <= oldEnd) {
      removeDom(oldChildren[oldStart])
      oldStart++
    }

  }
  if (newStart <= newEnd) {
    while (newStart <= newEnd) {
      insertElement(
          oldChildren[oldEnd].dom,
          newChildren[newStart],
          oldChildren[oldEnd].dom.nextSibling,
          vm,
          true
      )
      newStart++
    }
  }

}

function updateDomProps(oldVnode, newVnode, vm) {
  let oldProps = (oldVnode && oldVnode.data && oldVnode.data.domProps) || {},
      newProps = (newVnode && newVnode.data && newVnode.data.domProps) || {};
  traverseObj(newProps)((obj, key, value) => {
    if (oldProps[key] !== value) {
      domPropsHandlerMap[key](oldVnode.dom, key, value)
    }
  })
}

function insertElement(parent, Vnode, beforeDom, vm, mustInsert) {
  debugger
  let dom = Vnode instanceof Node ? vnode : createElement(Vnode, vm)
  let _parent = parent.parentNode
  if (mustInsert || beforeDom) {
    parent.insertBefore(dom, beforeDom)
  }
  else {
    _parent.replaceChild(dom, parent)
  }

}

function removeDom(vnode) {
  if (vnode instanceof Array) {
    vnode.forEach(item => {
      item.dom && item.dom.parentNode.removeChild(item.dom);
    })
  } else {
    vnode.dom && vnode.dom.parentNode.removeChild(vnode.dom);
  }

}

function createElement(vnode, vm) {
  let ele;
  if (vnode.tag) {
    ele = document.createElement(vnode.tag);
  } else {
    ele = document.createTextNode(vnode.text);
  }
  let isReturn = setDomprops(vnode, ele)
  vnode.dom = ele;
  addAttrs(vnode)
  if (isReturn) return ele
  setEvent(vnode, ele, vm)
  if (vnode.text) {
    ele.innerText = vnode.text
  }
  if (vnode.html) {
    ele.innerHTML = vnode.html;
  }
  if (vnode.children && vnode.tag) {
    vnode.children.forEach(item => {
      item.parent = vnode
      ele.appendChild(createElement(item, vm))
    })
  }
  return ele

}


function setEvent(vnode, ele, vm) {
  let data = vnode.data || {};
  if (data.on) {
    Object.keys(data.on).forEach(key => {
      ele.addEventListener(key, (data.on[key]).bind(vm), false)
    })
  }
}

function updateAttrs(oldVnode, newVnode, vm) {
  let oldData = oldVnode.data || {};
  let newData = oldVnode.data || {};

  if (isExist(oldData.attrs) && !isExist(newData.attrs)) {
    removeAttrs(oldVnode)
    return
  }
  if (!isExist(oldData.attrs) && isExist(newData.attrs)) {
    addAttrs(oldVnode)
    return
  }
  if (isExist(oldData.attrs) && isExist(newData.attrs)) {
    Object.keys(newData.attrs).forEach(key => {
      if (oldData.attrs.key) {
        if (oldData.attrs.key !== newData.attrs[key]) {
          addAttrs(oldVnode, key, newData.attrs[key])
        }
      }
    })
    Object.keys(newData.attrs).forEach(key => {
      if (!newData.attrs.key) {
        removeAttrs(oldVnode, key)
      }
    })
  }
}

function addAttrs(vnode, key, value) {
  if (!key && !value) {
    if (vnode.data && vnode.data.attrs) {
      traverseObj(vnode.data.attrs)((obj, key, value) => vnode.dom.setAttribute(key, value))

    }
  } else {
    vnode.dom.setAttribute(key, value)
  }

}

function setDomprops(vnode, ele) {
  let data = vnode.data || {};
  if (data.domProps) {
    traverseObj(data.domProps)(function (obj, key, value) {
      domPropsHandlerMap[key](ele, key, value)
    })
  }
}

function removeAttrs(vnode, key) {
  if (!key) {
    if (vnode.data && vnode.data.attrs) {
      traverseObj(vnode.data.attrs)((obj, key, value) => vnode.dom.removeAttribute(key))
    }
  } else {
    vnode.dom.removeAttribute(key)
  }
}



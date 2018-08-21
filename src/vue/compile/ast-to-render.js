import {addProp} from './template-to-ast'

export function translateTorender(ast) {
  console.log(ast)
  let result = ast ? getRender(ast) : '_c("div")'
  result = `with(this){return ${result}}`;
  console.log(result)
  return new Function(result)

}

function getRender(ast) {
  let data = (getState(ast))
  if (ast.for && !ast.hasFor) {
    return processFor(ast)
  }
  if (ast.if && !ast.hasIf) {
    return processIf(ast)
  }
  let children = genChildren(ast)
  return `_c(${JSON.stringify(ast.tagName)},${data ? data : {}},${children})`
}


function genChildren(ast) {
  let children = ast.children;
  if (children) {
    children = children.map(item => {
      if (item.type === 1) {
        return getRender(item)
      } else {
        return genText(item)
      }
    }).join(',')
  }
  return`[${children}]`

}

function processFor(ast) {
  let forInfo = ast.for
  // if (forInfo = ast.for && !ast.hasFor) {
  ast.hasFor = true
  return `_f(${forInfo.for},(function(${forInfo.alias},${forInfo.iterator1},${forInfo.iterator2}){return${getRender(ast)}}))`
  // }

}

function processIf(ast) {
  ast.hasIf = true
  if (ast.ifJudge) {
    return genIf(ast.ifJudge.slice(0))
  }


}

function genIf(conditions) {
  if(!conditions.length){
    return
  }
  let condition = conditions.shift() || {};
  if(condition.exp){
    return `(${condition.exp })?${getRender(condition.block)}:${genIf(conditions)}`
  }else {
    return getRender(condition.block)
  }

}

function getState(element) {
  let data = '{'
  if (element.directives) {
    data += genDirectives(element, element.directives) + ','
  }
  if (element.key) {
    data += `key:${element.key},`
  }
  if (element.attrs) {
    data += `attrs:{${getAttr(element.attrs)}},`
  }
  if (element.prop) {
    data+= `domProps:{${getAttr(element.prop)}},`
  }
  if (element.events) {
    data += `on:${genHandler(element.events)}`
  }
  return data.replace(/,$/, '')+ '}'

}

function genText(item) {
  return `_s(${ !item.expression ? JSON.stringify(item.text) : item.expression})`
}

function genDirectives(element, directives) {
  let res = 'directives:['
  directives.forEach(item => {
    if (item.name === 'text') {
      addProp(element, 'textContent', `_s(${item.value})`)
    } else if (item.name === 'html') {
      addProp(element, 'innerHTML', `_h(${item.value})`)
    } else if (item.name === 'model') {
      addProp(element, 'value', `(${value})`)
      element.events.push({
        ['change']: `function($event){value=$event.target.value}`
      })

    } else {
      res += `{name:"${item.name}",value:${item.value}},`
    }
  })
  return res.slice(0) + ']'
}

function genHandler(events) {
  let obj = '{'
  Object.keys(events).forEach(key => {
    obj = obj + `${ key}:`+genFunction(events[key]) +','
  })
  return obj+'}'

}

function genFunction(handler) {
    return `function($event){${handler}($event)}`
}

function getAttr(arr) {
  let res='';

   arr.forEach(item => {
     let key = Object.keys(item)[0]
    res += `"${key}":${item[key]},`
  })
  return res
}

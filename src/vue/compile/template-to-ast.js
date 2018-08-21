import options from './options'


const startTagOpen = /^<([a-zA-Z_\-]+)/;
const startTagClose = /^\s*(\/?)>/;
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]*)))?/;
const endTag = /^<\/([a-zA-Z_\-]+)>/;
const tagRE = /{{((.)+?)}}/g;
const forRE = /([^]*?)\s+(?:in)\s+([^]*)/;
const onRe = /^@|^v-on/;
const bindRe = /^:|^v-bind:/;
const vRe = /^v-|^:|^@/

export function translateToAst(template) {
  let currentParent, root;
  let stack = []
  parseHTML(template, {
    isUnaryTag: options.isUnaryTag,
    start(tagName, attrs, unary, start, end) {

      let element = createASTElement(tagName, attrs, currentParent)
      if (!root) {
        root = element;
      }
      //解析 class
      //解析style
      processStaticNormal(element);
      //解析v-for
      processFor(element)
      //解析key
      processKey(element)

      //解析v-if
      processIf(element)
      //v-bind
      //v-on
      processAttrs(element)
      // v-text、v-html、v-show、、v-model这些在运行时处理
      //其他
      if (currentParent) {
        if (element.elseif || element.else) {
          const pre = currentParent.children[currentParent.children.length - 1]
          if (pre && pre.if) {
            pre.ifJudge.push({
              exp: element.elseif,
              block: element
            })
          }
        } else {
          currentParent.children.push(element)
          element.parent = currentParent

        }
      }
      if (!unary) {
        currentParent = element
        stack.push(element)
      }
    },
    end(tagName, start, end) {
      stack.pop();
      currentParent = stack[stack.length - 1];
    },
    chars(text) {
      text = text.trim();
      if (text !== '') {
        let parseResult = parseText(text)
        if (parseResult) {
          currentParent.children.push({
            type: 2,
            text: parseResult
          })
        } else {
          currentParent.children.push({
            type: 3,
            text
          })
        }
      }
    }
  })
  return root

}


function parseHTML(html, options) {
  let stack = [];//储存非一元标签
  let index = 0;
  let last, lastTag
  while (html) {
    last = html;
    let text;
    let leftArrow = html.indexOf('<');
    if (leftArrow > 0) {  //纯文本

      text = html.substring(0, leftArrow);
      advance(leftArrow)
      let lastMatch = stack[stack.length - 1]

    }
    if (leftArrow < 0) {
      text = html;
      html = ''
    }
    if (leftArrow === 0) {

      //省略处理注释  Doctype
      // End tag:
      const tagEnd = html.match(endTag)
      if (tagEnd) {
        const curIndex = index
        advance(tagEnd[0].length)
        options.end(tagEnd[1], curIndex, index)
        continue
      }

      //startTag
      const tagStart = html.match(startTagOpen);
      const match = {
        tagName: tagStart[1],
        attrs: [],
        start: index
      }
      advance(tagStart[0].length)
      let tagEndClose, attr
      while (!(tagEndClose = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length)
        match.attrs.push(attr)
      }
      if (tagEndClose) {
        match.unarySlash = tagEndClose[1]
        advance(tagEndClose[0].length)
        match.end = index
      }

      const unary = options.isUnaryTag(match.tagName) || !!match.unarySlash
      match.attrs = match.attrs.map(item => {
        return {
          name: item[1],
          value: item[2] || item[3] || item[4] || true
        }
      })
      if (!unary) {
        stack.push({tag: match.tagName, attrs: match.attrs})
        lastTag = match.tagName
      }
      if (options.start) {
        options.start(match.tagName, match.attrs, unary, match.start, match.end)
      }

    }
    if (text) {
      options.chars(text)
    }
  }


  function advance(idx) {
    index += idx
    html = html.slice(idx);
  }


}

function createASTElement(tagName, attrs, parent) {
  return {
    type: 1,
    tagName,
    attrsList: attrs,
    attrsMap: makeAttrsMap(attrs),
    parent,
    children: []
  }
}

function makeAttrsMap(attrs) {
  return attrs.reduce((obj, {name, value}) => {
    return {
      ...obj,
      [name]: value
    }
  }, {})

}

function parseText(text) {
  let tokens = [];
  let match, index, last;
  while (match = tagRE.exec(text)) {
    last = match.index;
    tokens.push(text.slice(index, last))
    let exp = match[1].trim();
    tokens.push(`_s(${exp})`)
    last = index = last + match[0].length
  }
  if (last < text.length) {
    tokens.push(text.slice(0, last))
  }
  return tokens.join('+')

}

function processStaticNormal(el) {
  ['class', 'style'].forEach(key => {
    const staticValue = getAndRemoveAttr(el, key);
    if (staticValue) {
      el[`static${key}`] = JSON.stringify(staticValue)
    }
  })
}

function processFor(el) {
  let exp = getAndRemoveAttr(el, 'v-for');
  if (exp) {
    const res = parseFor(exp)
    el.for = res;
  }
}

function parseFor(exp) {
  const match = exp.match(forRE)
  let result = {}
  result.for = match[2].trim();
  let args = match[1]
  let a = args.indexOf('(')
  if (args.indexOf('(') >= 0) {
    args = args.replace('(', '')
  }
  if (args.indexOf(')') >= 0) {
    args = args.replace(')', '')
  }
  if (args.indexOf(',')) {
    args = args.split(',')
    result.alias = args[0]
    if (args[1]) {
      result.iterator1 = args[1]
    }
    if (args[2]) {
      result.iterator2 = args[2]

    }
  } else {
    result.alias = args
  }
  return result

}

function processKey(element) {
  let exp = getBindingAttr(element, 'key')
  if (exp) {
    element.key = exp
  }

}

function processIf(element) {
  let ifExp = getAndRemoveAttr(element, 'v-if')
  if (ifExp) {
    element.if = ifExp;
    element.ifJudge = [{
      exp: ifExp,
      block: element
    }]
  }
  let elseIfExp = getAndRemoveAttr(element, 'v-else-if')
  if (elseIfExp) {
    element.elseIf = element
  }
  let elseExp = getAndRemoveAttr(element, 'v-else')
  if (elseExp) {
    element.else = true
  }
}

function processAttrs(element) {
  let attrLists = element.attrsList;
  attrLists.forEach(({name, value}) => {
    if (vRe.test(name)) {
      element.binding = true  //不纯
      if (bindRe.test(name)) {
        name = name.replace(bindRe, '');
        element.plain = false
        if (useProps(element.tagName, element.attrsMap.type, name)) {
          addProp(element, name, value)
        } else {
          addAttr(element, name, value)
        }
      } else if (onRe.test(name)) {
        element.plain = false
        name = name.replace(onRe, '')
        addHandler(element, name, value)
      } else {
        name = name.replace(vRe, '')
        addDirective(element, name, value)
      }
    } else {
      addAttr(element, name, JSON.stringify(value))
    }
  })

}

function getBindingAttr(el, name) {
  const dynamicValue =
      getAndRemoveAttr(el, ':' + name) ||
      getAndRemoveAttr(el, 'v-bind:' + name)
  if (dynamicValue != null) {
    return dynamicValue
  } else {
    const staticValue = getAndRemoveAttr(el, name)
    if (staticValue != null) {
      return JSON.stringify(staticValue)
    }
  }
}

function getAndRemoveAttr(el, name, removeFromMap) {
  let val
  if ((val = el.attrsMap[name]) != null) {
    const list = el.attrsList
    for (let i = 0, l = list.length; i < l; i++) {
      if (list[i].name === name) {
        list.splice(i, 1)
        break
      }
    }
  }
  if (removeFromMap) {
    delete el.attrsMap[name]
  }
  return val
}

function useProps(tag, type, name) {
  return (tag === 'input' || tag === 'textarea') && (name === 'value')
}

export function addProp(element, name, value) {
  (element.props || (element.prop = [])).push({
    [name]: value
  })
}

export function addAttr(element, name, value) {
  (element.attrs || (element.attrs = [])).push({
    [name]: value
  })
}

function addHandler(element, name, value) {
  let events = element.events || (element.events = {})
  if (!events[name]) {
    events[name] = []
  }
  events[name].push(value)
}

function addDirective(element, name, value) {
  let directives = element.directives || (element.directives = [])
  directives.push({
    name,
    value
  })
}

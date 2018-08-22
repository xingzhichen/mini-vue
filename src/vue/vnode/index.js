//简单的vnode  差不多这些可以了
export default class Vnode {
  constructor({tag, data, children, text, html, ele, context}) {
    this.tag = tag;
    this.data = data;
    this.children = children;
    this.text = text;
    this.html = html;
    this.ele = ele;
    this.context = context;
    this.key = data &&data.key
  }
}

export function createTextNode(text) {
  return new Vnode({text})
}

export function createHtmlNode(html) {
  return new Vnode({html})
}

export function createNormalNode(tag, data, children) {
  return new Vnode({tag, data, children})

}
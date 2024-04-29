import { createRenderer } from "../runtime-core";

function createElement(type) {

  return document.createElement(type);
}

function patchProp(el, key, val) {

  // 绑定事件
  const isOn = (key) => /^on[A-Z]/.test(key);
  if (isOn(key)) {
    const event = key.slice(2).toLowerCase();
    el.addEventListener(event, val);
  } else {
    //设置attribute
    el.setAttribute(key, val);
  }
}

function insert(el, parent) {

  parent.append(el);
}

const renderer: any = createRenderer({ createElement, patchProp, insert });

export function createApp(...args) {
  return renderer.createApp(...args);
}
export * from "../runtime-core"
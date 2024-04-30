import { createRenderer } from "../runtime-core";

function createElement(type) {

  return document.createElement(type);
}

function patchProp(el, key, prevVal,nextVal) {

  // 绑定事件
  const isOn = (key) => /^on[A-Z]/.test(key);
  if (isOn(key)) {
    const event = key.slice(2).toLowerCase();
    el.addEventListener(event, nextVal);
  } else {
    //设置attribute
    el.setAttribute(key, nextVal);
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
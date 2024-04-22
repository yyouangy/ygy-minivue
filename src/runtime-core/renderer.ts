import { isObject } from "../shared";
import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
  //
  patch(vnode, container);
}

function patch(vnode, container) {
  //判断是组件还是element
  console.log(vnode);
  if (typeof vnode.type === "string") {
    //处理element
    processElement(vnode, container);
  } else if (isObject(vnode.type)) {
    //处理组件
    processComponent(vnode, container);
  }
}
function processElement(vnode: any, container: any) {
  mountElement(vnode, container);
}
function mountElement(vnode: any, container: any) {
  console.log(container);

  const el = document.createElement(vnode.type);
  //设置textContent
  const { children } = vnode;

  //string array
  if (typeof children === "string") {
    el.textContent = children;
  } else if (Array.isArray(children)) {
    mountChildren(vnode, el);
  }
  //设置attribute
  const { props } = vnode;
  for (const key in props) {
    const val = props[key];
    el.setAttribute(key, val);
  }
  container.append(el);
}
function mountChildren(vnode, container) {
  vnode.children.forEach((v) => patch(v, container));
}
function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container);
}

function mountComponent(vnode: any, container) {
  const instance = createComponentInstance(vnode);

  setupComponent(instance);
  setupRenderEffect(instance, container);
}
function setupRenderEffect(instance: any, container) {
  const { proxy } = instance;

  const subTree = instance.render.call(proxy);

  //vnode —> element —> mountElement
  patch(subTree, container);
}

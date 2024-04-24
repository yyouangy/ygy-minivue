import { isObject } from "../shared";
import { createComponentInstance, setupComponent } from "./component";
import { shapeFlags } from "./ShapeFlags";

export function render(vnode, container) {
  //
  patch(vnode, container);
}

function patch(vnode, container) {
  //使用shapeFlags判断是组件还是element
  const { shapeFlag } = vnode;
  if (shapeFlag & shapeFlags.ELEMENT) {
    //处理element
    processElement(vnode, container);
  } else if (shapeFlag & shapeFlags.STATEFUL_COMPONENT) {
    //处理组件
    processComponent(vnode, container);
  }
}
function processElement(vnode: any, container: any) {
  mountElement(vnode, container);
}
function mountElement(vnode: any, container: any) {
  const el = document.createElement(vnode.type);
  //vnode引用真实dom
  vnode.el = el;
  //设置textContent
  const { children, shapeFlag } = vnode;

  //string array
  if (shapeFlag & shapeFlags.TEXT_CHILDREN) {
    el.textContent = children;
  } else if (shapeFlag & shapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, el);
  }
  //设置attribute
  const { props } = vnode;
  for (const key in props) {
    const val = props[key];

    //绑定事件
    const isOn = (key) => /^on[A-Z]/.test(key);
    if (isOn(key)) {
      const event = key.slice(2).toLowerCase();
      el.addEventListener(event, val);
    } else {
      el.setAttribute(key, val);
    }
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
  setupRenderEffect(vnode, instance, container);
}
function setupRenderEffect(vnode, instance: any, container) {
  const { proxy } = instance;

  const subTree = instance.render.call(proxy);

  //vnode —> element —> mountElement
  patch(subTree, container);

  //将根组件vnode的$el指向subTree的el，用户可以通过this.$el拿到根dom元素
  vnode.el = subTree.el;
}

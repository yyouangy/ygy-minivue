import { createComponentInstance, setupComponent } from "./component";
import { shapeFlags } from "./ShapeFlags";
import { Fragment, Text } from "./vnode";

export function render(vnode, container) {
  patch(vnode, container, null);
}

function patch(vnode, container, parentComponent) {
  //使用shapeFlags判断是组件还是element
  const { type, shapeFlag } = vnode;
  switch (type) {
    case Fragment:
      processFragment(vnode, container, parentComponent);
      break;
    case Text:
      processText(vnode, container);
      break;
    default:
      if (shapeFlag & shapeFlags.ELEMENT) {
        //处理element
        processElement(vnode, container, parentComponent);
      } else if (shapeFlag & shapeFlags.STATEFUL_COMPONENT) {
        //处理组件
        processComponent(vnode, container, parentComponent);
      }
      break;
  }
}

function processText(vnode, container) {
  const { children } = vnode;
  const textNode = (vnode.el = document.createTextNode(children));
  container.append(textNode);
}
function processFragment(vnode, container, parentComponent) {
  mountChildren(vnode, container, parentComponent);
}
function processElement(vnode: any, container: any, parentComponent) {
  mountElement(vnode, container, parentComponent);
}
function mountElement(vnode: any, container: any, parentComponent) {
  const el = document.createElement(vnode.type);
  //vnode引用真实dom
  vnode.el = el;
  //设置textContent
  const { children, shapeFlag } = vnode;

  //string array
  if (shapeFlag & shapeFlags.TEXT_CHILDREN) {
    el.textContent = children;
  } else if (shapeFlag & shapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, el, parentComponent);
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
function mountChildren(vnode, container, parentComponent) {
  vnode.children.forEach((v) => patch(v, container, parentComponent));
}
function processComponent(vnode: any, container: any, parentComponent) {
  mountComponent(vnode, container, parentComponent);
}

function mountComponent(initialVNode: any, container, parentComponent) {
  const instance = createComponentInstance(initialVNode, parentComponent);

  setupComponent(instance);
  setupRenderEffect(initialVNode, instance, container);
}
function setupRenderEffect(vnode, instance: any, container) {
  const { proxy } = instance;

  const subTree = instance.render.call(proxy);

  //vnode —> element —> mountElement
  patch(subTree, container, instance);

  //将根组件vnode的$el指向subTree的el，用户可以通过this.$el拿到根dom元素
  vnode.el = subTree.el;
}

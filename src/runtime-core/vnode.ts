import { isObject } from "../shared";
import { shapeFlags } from "./ShapeFlags";

export const Fragment = Symbol("Fragment");
export const Text = Symbol("Text");
export function createVNode(type, props?, children?) {
  const vnode = {
    type,
    props,
    key: props && props.key,
    children,
    el: null,
    shapeFlag: getShapeFlag(type),
  };
  if (typeof children === "string") {
    vnode.shapeFlag |= shapeFlags.TEXT_CHILDREN;
  } else if (Array.isArray(children)) {
    vnode.shapeFlag |= shapeFlags.ARRAY_CHILDREN;
  }

  //vnode是组件类型且children是object才会处理Slots
  if (vnode.shapeFlag & shapeFlags.STATEFUL_COMPONENT) {
    if (typeof children === "object") {
      // normalizeObjectSlots(children, instance.slots);
      vnode.shapeFlag |= shapeFlags.SLOT_CHILDREN;
    }
  }

  return vnode;
}

//初始化vnode的类型
function getShapeFlag(type) {
  if (typeof type === "string") {
    return shapeFlags.ELEMENT;
  } else if (isObject(type)) {
    //0010
    return shapeFlags.STATEFUL_COMPONENT;
  }
}
export function createTextVNode(text: string) {
  return createVNode(Text, {}, text);
}

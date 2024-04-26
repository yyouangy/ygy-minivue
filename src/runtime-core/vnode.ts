import { isObject } from "../shared";
import { shapeFlags } from "./ShapeFlags";

export function createVNode(type, props?, children?) {
  const vnode = {
    type,
    props,
    children,
    el: null,
    shapeFlag: getShapeFlag(type),
  };
  if (typeof children === "string") {
    vnode.shapeFlag |= shapeFlags.TEXT_CHILDREN;
  } else if (Array.isArray(children)) {
    vnode.shapeFlag |= shapeFlags.ARRAY_CHILDREN;
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

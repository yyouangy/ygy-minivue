import { shapeFlags } from "./ShapeFlags";

export function initSlots(instance, children) {
  // console.log("初始化Slots");

  const { vnode } = instance;
  if (vnode.shapeFlag & shapeFlags.SLOT_CHILDREN) {
    normalizeObjectSlots(children, instance.slots);
  }
}
function normalizeObjectSlots(children, slots) {
  for (const key in children) {
    const value = children[key];
    
    // if (typeof value === "function") {
      //将用户传入的函数存到instance.slots上，后续在renderSlots中调用
      // TODO 这里没有对 value 做 normalize，
      // 默认 slots 返回的就是一个 vnode 对象
      slots[key] = (params) => normalizeSlotsValue(value(params));
    // }
  }
}
function normalizeSlotsValue(value) {
  //将function value(){} 的返回值转换为array，这样Slots就可以支持多个元素了
  return Array.isArray(value) ? value : [value];
}

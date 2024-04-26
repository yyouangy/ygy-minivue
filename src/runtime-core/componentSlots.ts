export function initSlots(instance, children) {
  //将children统一转换成数组再处理
  instance.slots = Array.isArray(children) ? children : [children];
}

import { getCurrentInstance } from "./component";

export function provide(key, val) {
  const currentInstance = getCurrentInstance();
  if (currentInstance) {
    let { provides } = currentInstance;
    const parentProvides = currentInstance.parent.provides;

    //判断是否为初始化组件
    if (provides === parentProvides) {
      //将父组件实例的provides作为子组件provides的原型，然后再对它进行赋值操作
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = val;
  }
}
export function inject(key, defaultValue) {
  const currentInstance = getCurrentInstance();
  if (currentInstance) {
    const parentProvides = currentInstance.parent.provides;

    if (key in parentProvides) {
      return parentProvides[key];
    } else if (defaultValue) {
      if (typeof defaultValue === "function") {
        return defaultValue();
      }
      return defaultValue;
    }
  }
}

import { getCurrentInstance } from "./component";

export function provide(key, val) {
  const currentInstance = getCurrentInstance();
  //   console.log(currentInstance);
  if (currentInstance) {
    const { provides } = currentInstance;
    provides[key] = val;
  }
}
export function inject(key) {
  const currentInstance = getCurrentInstance();
  //   console.log(currentInstance);
  if (currentInstance) {
    const parentProvides = currentInstance.parent.provides;
    return parentProvides[key];
  }
}

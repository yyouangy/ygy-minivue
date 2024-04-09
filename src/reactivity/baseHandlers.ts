import { track, trigger } from "./effect";

export function createGetter(isReadonly = false) {
  return function get(target, key) {
    const res = Reflect.get(target, key);
    if (!isReadonly) {
      track(target, key);
    }
    return res;
  };
}
export function createSetter() {
  return function set(target, key, val) {
    const res = Reflect.set(target, key, val);
    trigger(target, key);
    return res;
  };
}

export const mutableHandler = {
  get: createGetter(),
  set: createSetter(),
};

export const readonlyHandler = {
  get: createGetter(true),
  set(target, key, val) {
    console.warn(`key:${key},set失败，因为target:${target}是readonly`);
    return true;
  },
};

import { track, trigger } from "./effect";
import { ReactiveFlags, readonly, reactive } from "./reactive";
import { isObject, extend } from "../shared";
const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
export function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    }
    const res = Reflect.get(target, key);
    if (shallow) {
      return res;
    }
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }

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
  get,
  set,
};

export const readonlyHandler = {
  get: readonlyGet,
  set(target, key, val) {
    console.warn(`key:${key},set失败，因为target:${target}是readonly`);
    return true;
  },
};

export const shallowReadonlyHandler = extend({}, readonlyHandler, {
  get: shallowReadonlyGet,
});

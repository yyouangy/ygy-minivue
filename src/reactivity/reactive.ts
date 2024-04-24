import {
  mutableHandler,
  readonlyHandler,
  shallowReadonlyHandler,
} from "./baseHandlers";
export const enum ReactiveFlags {
  IS_REACTIVE = "_v_isReactive",
  IS_READONLY = "_v_isReadonly",
}

//重构为传入源对象和对应的Hander
export function reactive(raw) {
  return createReactiveObject(raw, mutableHandler);
}

export function readonly(raw) {
  return createReactiveObject(raw, readonlyHandler);
}
export function shallowReadonly(raw) {
  return createReactiveObject(raw, shallowReadonlyHandler);
}

export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE];
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY];
}

export function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}
function createReactiveObject(raw, Handler) {
  return new Proxy(raw, Handler);
}

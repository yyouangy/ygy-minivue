import { mutableHandler, readonlyHandler } from "./baseHandlers";

export function reactive(raw) {
  return createReactiveObject(raw, mutableHandler);
}

export function readonly(raw) {
  return createReactiveObject(raw, readonlyHandler);
}

export function isReactive(raw) {
  //TODO
}

function createReactiveObject(raw, Handler) {
  return new Proxy(raw, Handler);
}

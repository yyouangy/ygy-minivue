import { mutableHandler, readonlyHandler } from "./baseHandlers";
export function reactive(raw) {
  return new Proxy(raw, mutableHandler);
}

export function readonly(raw) {
  return new Proxy(raw, readonlyHandler);
}

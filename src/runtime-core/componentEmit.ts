import { camelize, toHanderKey } from "../shared";

export function emit(instance, event, ...args) {
  const { props } = instance;

  //emit发送的事件名 需要做如下转换
  //add -> onAdd
  //child-plus -> onChildPlus
 
  const handlerName = toHanderKey(camelize(event));
  const handler = props[handlerName];
  handler && handler(...args);
}

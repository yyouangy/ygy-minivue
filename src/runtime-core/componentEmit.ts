export function emit(instance, event, ...args) {
  console.log(instance);

  const { props } = instance;

  //emit发送的事件名 需要做如下转换
  //add -> onAdd
  //child-plus -> onChildPlus
  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const toHanderKey = (str: string) => {
    return str ? "on" + capitalize(str) : "";
  };

  const camelize = (str: string) => {
    return str.replace(/-(\w)/g, (_, c: string) => {
      return c ? c.toUpperCase() : "";
    });
  };
  const handlerName = toHanderKey(camelize(event));
  const handler = props[handlerName];
  handler && handler(...args);
}

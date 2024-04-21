export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      //先把component转换为vnode，再基于vnode去处理
      const vnode = createVNode(rootComponent);
    },
  };
}

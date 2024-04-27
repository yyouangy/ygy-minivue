import { render } from "./renderer";
import { createVNode } from "./vnode";

export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      //先把component转换为vnode，所有的逻辑会基于vnode去处理
      const vnode = createVNode(rootComponent);

      render(vnode, rootContainer,);
    },
  };
}


import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
  //
  patch(vnode, container);
}

function patch(vnode, container) {
  //判断是组件还是element
  //处理组件
  processComponent(vnode, container);
}
function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container);
}

function mountComponent(vnode: any, container) {
  const instance = createComponentInstance(vnode);

  setupComponent(instance);
  setupRenderEffect(instance, container);
}
function setupRenderEffect(instance: any, container) {
  const subTree = instance.render();

  //vnode —> element —> mountElement
  patch(subTree, container);
}

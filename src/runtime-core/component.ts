import { initProps } from "./componentProps";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";

export function createComponentInstance(vnode: any) {
  const component = { vnode, type: vnode.type, setupState: {} };

  return component;
}

export function setupComponent(instance) {
  //TODO
  //initProps
  initProps(instance, instance.vnode.props);

  //initSlots
  setupStatefulComponent(instance);
}

export function setupStatefulComponent(instance: any) {
  const Component = instance.type;
  //ctx
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
  const { setup } = Component;
  if (setup) {
    //setupResult可以是function或object
    const setupResult = setup(instance.props);
    handleSetupResult(instance, setupResult);
  }
}
function handleSetupResult(instance, setupResult: any) {
  //TODO function
  if (typeof setupResult === "object") {
    instance.setupState = setupResult;
  }

  finishComponentSetup(instance);
}
//保证render有返回值
function finishComponentSetup(instance: any) {
  const Component = instance.type;
  // if (Component.render) {
  instance.render = Component.render;
  // }
}

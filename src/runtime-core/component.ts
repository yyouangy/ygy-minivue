import { emit } from "./componentEmit";
import { initProps } from "./componentProps";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";
import { initSlots } from "./componentSlots";

let currentInstance = null;
export function createComponentInstance(vnode: any, parent) {
  console.log('currentParentInstance',parent);
  
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    slots: {},
    provides: {},
    parent,
    emit: () => {},
  };

  //挂载emit,预先传入instance,这样使用emit时,只需传入event
  component.emit = emit.bind(null, component) as any;
  return component;
}

export function setupComponent(instance) {
  //initProps
  initProps(instance, instance.vnode.props);

  //initSlots
  initSlots(instance, instance.vnode.children);
  setupStatefulComponent(instance);
}

export function setupStatefulComponent(instance: any) {
  const Component = instance.type;
  //ctx
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
  const { setup } = Component;
  if (setup) {
    //setupResult可以是function或object
    setCurrentInstance(instance);
    const setupResult = setup(instance.props, { emit: instance.emit });

    setCurrentInstance(null);

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

export function getCurrentInstance() {
  return currentInstance;
}
function setCurrentInstance(instance) {
  currentInstance = instance;
}

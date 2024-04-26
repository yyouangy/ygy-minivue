import { emit } from "./componentEmit";
import { initProps } from "./componentProps";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";
<<<<<<< HEAD
import { initSlots } from "./componentSlots";
=======
import { initSlots } from "./componentsSlots";
>>>>>>> 7ffb2bec2eea0a8d00b6ff4bc316acd5543e6634

export function createComponentInstance(vnode: any) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
<<<<<<< HEAD
    props:{},
    slots:{},
=======
    props: {},
    slots: {},
>>>>>>> 7ffb2bec2eea0a8d00b6ff4bc316acd5543e6634
    emit: () => {},
  };

  //挂载emit,预先传入instance,这样使用emit时,只需传入event
  component.emit = emit.bind(null, component) as any;
  return component;
}

export function setupComponent(instance) {
  //TODO
  //initProps
  initProps(instance, instance.vnode.props);

  //initSlots
<<<<<<< HEAD
  initSlots(instance,instance.vnode.children)
=======
  initSlots(instance, instance.vnode.children);
>>>>>>> 7ffb2bec2eea0a8d00b6ff4bc316acd5543e6634
  setupStatefulComponent(instance);
}

export function setupStatefulComponent(instance: any) {
  const Component = instance.type;
  //ctx
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
  const { setup } = Component;
  if (setup) {
    //setupResult可以是function或object
    const setupResult = setup(instance.props, { emit: instance.emit });
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

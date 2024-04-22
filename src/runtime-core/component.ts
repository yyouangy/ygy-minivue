export function createComponentInstance(vnode: any) {
  const component = { vnode, type: vnode.type, setupState: {} };

  return component;
}

export function setupComponent(instance) {
  //TODO
  //initProps initSlots
  setupStatefulComponent(instance);
}

export function setupStatefulComponent(instance: any) {
  const Component = instance.type;
  console.log(instance);
  //ctx
  instance.proxy = new Proxy(
    {},
    {
      get(target, key) {
        const { setupState } = instance;
        console.log("-----", setupState, key);

        if (key in setupState) {
          return setupState[key];
        }
      },
    }
  );
  const { setup } = Component;
  if (setup) {
    //setupResult可以是function或object
    const setupResult = setup();
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

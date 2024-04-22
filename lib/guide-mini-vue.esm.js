function createComponentInstance(vnode) {
    var component = { vnode: vnode, type: vnode.type };
    return component;
}

function setupComponent(instance) {
    //TODO
    //initProps initSlots
    setupStatefulComponent(instance);
}

function setupStatefulComponent(instance) {
    var Component = instance.type;
    var setup = Component.setup;
    if (setup) {
        //setupResult可以是function或object
        var setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}

function handleSetupResult(instance, setupResult) {
    //TODO function
    if (typeof setupResult === "object") {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
//保证render有返回值
function finishComponentSetup(instance) {
    var Component = instance.type;
    if (Component.render) {
        instance.render = Component.render;
    }
}

function render(vnode, container) {
    //
    patch(vnode);
}

function patch(vnode, container) {
    //判断是组件还是element
    //处理组件
    debugger

    processComponent(vnode);
}

function processComponent(vnode, container) {
    mountComponent(vnode);
}

function mountComponent(vnode, container) {
    var instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance);
}

function setupRenderEffect(instance, container) {
    var subTree = instance.render();
    //vnode —> element —> mountElement
    patch(subTree);
}

function createVNode(type, props, children) {
    var vnode = { type: type, props: props, children: children };
    return vnode;
}

function createApp(rootComponent) {
    return {
        mount: function(rootContainer) {
            //先把component转换为vnode，所有的逻辑会基于vnode去处理
            var vnode = createVNode(rootComponent);
            render(vnode);
        },
    };
}

function h(type, props, children) {
    var vnode = createVNode(type, props, children);
    return vnode;
}

export { createApp, h };
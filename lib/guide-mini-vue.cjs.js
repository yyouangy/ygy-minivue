'use strict';

function isObject(val) {
    return val !== null && typeof val === "object";
}

function createComponentInstance(vnode) {
    var component = { vnode: vnode, type: vnode.type, setupState: {} };
    return component;
}
function setupComponent(instance) {
    //TODO
    //initProps initSlots
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    var Component = instance.type;
    console.log(instance);
    instance.proxy = new Proxy({}, {
        get: function (target, key) {
            var setupState = instance.setupState;
            console.log("-----", setupState, key);
            if (key in setupState) {
                return setupState[key];
            }
        },
    });
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
    // if (Component.render) {
    instance.render = Component.render;
    // }
}

function render(vnode, container) {
    //
    patch(vnode, container);
}
function patch(vnode, container) {
    //判断是组件还是element
    console.log(vnode);
    if (typeof vnode.type === "string") {
        //处理element
        processElement(vnode, container);
    }
    else if (isObject(vnode.type)) {
        //处理组件
        processComponent(vnode, container);
    }
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    console.log(container);
    var el = document.createElement(vnode.type);
    //设置textContent
    var children = vnode.children;
    //string array
    if (typeof children === "string") {
        el.textContent = children;
    }
    else if (Array.isArray(children)) {
        mountChildren(vnode, el);
    }
    //设置attribute
    var props = vnode.props;
    for (var key in props) {
        var val = props[key];
        el.setAttribute(key, val);
    }
    container.append(el);
}
function mountChildren(vnode, container) {
    vnode.children.forEach(function (v) { return patch(v, container); });
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(vnode, container) {
    var instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance, container);
}
function setupRenderEffect(instance, container) {
    var proxy = instance.proxy;
    var subTree = instance.render.call(proxy);
    //vnode —> element —> mountElement
    patch(subTree, container);
}

function createVNode(type, props, children) {
    var vnode = { type: type, props: props, children: children };
    return vnode;
}

function createApp(rootComponent) {
    return {
        mount: function (rootContainer) {
            //先把component转换为vnode，所有的逻辑会基于vnode去处理
            var vnode = createVNode(rootComponent);
            render(vnode, rootContainer);
        },
    };
}
function h(type, props, children) {
    var vnode = createVNode(type, props, children);
    return vnode;
}

exports.createApp = createApp;
exports.h = h;

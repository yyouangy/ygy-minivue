'use strict';

function emit(instance, event) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    var props = instance.props;
    //emit发送的事件名 需要做如下转换
    //add -> onAdd
    //child-plus -> onChildPlus
    var capitalize = function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };
    var toHanderKey = function (str) {
        return str ? "on" + capitalize(str) : "";
    };
    var camelize = function (str) {
        return str.replace(/-(\w)/g, function (_, c) {
            return c ? c.toUpperCase() : "";
        });
    };
    var handlerName = toHanderKey(camelize(event));
    var handler = props[handlerName];
    handler && handler.apply(void 0, args);
}

function initProps(instance, rawProps) {
    instance.props = rawProps || {};
}

var publicPropertiesMap = {
    $el: function (i) { return i.vnode.el; },
    $slots: function (i) { return i.slots; },
};
var PublicInstanceProxyHandlers = {
    get: function (_a, key) {
        var instance = _a._;
        var setupState = instance.setupState, props = instance.props;
        var hasOwn = function (val, key) { return Object.prototype.hasOwnProperty.call(val, key); };
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            return props[key];
        }
        var publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    },
};

function initSlots(instance, children) {
    //将children统一转换成数组再处理
    instance.slots = Array.isArray(children) ? children : [children];
}

function createComponentInstance(vnode) {
    var component = {
        vnode: vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots: {},
        emit: function () { },
    };
    //挂载emit,预先传入instance,这样使用emit时,只需传入event
    component.emit = emit.bind(null, component);
    return component;
}
function setupComponent(instance) {
    //TODO
    //initProps
    initProps(instance, instance.vnode.props);
    //initSlots
    initSlots(instance, instance.vnode.children);
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    var Component = instance.type;
    //ctx
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
    var setup = Component.setup;
    if (setup) {
        //setupResult可以是function或object
        var setupResult = setup(instance.props, { emit: instance.emit });
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
    //使用shapeFlags判断是组件还是element
    var shapeFlag = vnode.shapeFlag;
    if (shapeFlag & 1 /* shapeFlags.ELEMENT */) {
        //处理element
        processElement(vnode, container);
    }
    else if (shapeFlag & 2 /* shapeFlags.STATEFUL_COMPONENT */) {
        //处理组件
        processComponent(vnode, container);
    }
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    var el = document.createElement(vnode.type);
    //vnode引用真实dom
    vnode.el = el;
    //设置textContent
    var children = vnode.children, shapeFlag = vnode.shapeFlag;
    //string array
    if (shapeFlag & 4 /* shapeFlags.TEXT_CHILDREN */) {
        el.textContent = children;
    }
    else if (shapeFlag & 8 /* shapeFlags.ARRAY_CHILDREN */) {
        mountChildren(vnode, el);
    }
    //设置attribute
    var props = vnode.props;
    for (var key in props) {
        var val = props[key];
        //绑定事件
        var isOn = function (key) { return /^on[A-Z]/.test(key); };
        if (isOn(key)) {
            var event_1 = key.slice(2).toLowerCase();
            el.addEventListener(event_1, val);
        }
        else {
            el.setAttribute(key, val);
        }
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
    setupRenderEffect(vnode, instance, container);
}
function setupRenderEffect(vnode, instance, container) {
    var proxy = instance.proxy;
    var subTree = instance.render.call(proxy);
    //vnode —> element —> mountElement
    patch(subTree, container);
    //将根组件vnode的$el指向subTree的el，用户可以通过this.$el拿到根dom元素
    vnode.el = subTree.el;
}

function isObject(val) {
    return val !== null && typeof val === "object";
}

function createVNode(type, props, children) {
    var vnode = {
        type: type,
        props: props,
        children: children,
        el: null,
        shapeFlag: getShapeFlag(type),
    };
    if (typeof children === "string") {
        vnode.shapeFlag |= 4 /* shapeFlags.TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlag |= 8 /* shapeFlags.ARRAY_CHILDREN */;
    }
    return vnode;
}
//初始化vnode的类型
function getShapeFlag(type) {
    if (typeof type === "string") {
        return 1 /* shapeFlags.ELEMENT */;
    }
    else if (isObject(type)) {
        //0010
        return 2 /* shapeFlags.STATEFUL_COMPONENT */;
    }
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

function renderSlots(slots) {
    console.log(slots);
    return createVNode("div", {}, slots);
}

exports.createApp = createApp;
exports.h = h;
exports.renderSlots = renderSlots;

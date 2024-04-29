function isObject(val) {
    return val !== null && typeof val === "object";
}
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

var Fragment = Symbol("Fragment");
var Text = Symbol("Text");
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
    //vnode是组件类型且children是object才会处理Slots
    if (vnode.shapeFlag & 2 /* shapeFlags.STATEFUL_COMPONENT */) {
        if (typeof children === "object") {
            // normalizeObjectSlots(children, instance.slots);
            vnode.shapeFlag |= 16 /* shapeFlags.SLOT_CHILDREN */;
        }
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
function createTextVNode(text) {
    return createVNode(Text, {}, text);
}

function h(type, props, children) {
    var vnode = createVNode(type, props, children);
    return vnode;
}

function renderSlots(slots, slotName, params) {
    var slot = slots[slotName];
    console.log("\u6E32\u67D3\u63D2\u69FD slot -> ".concat(slotName));
    if (slot) {
        if (typeof slot === "function") {
            return createVNode(Fragment, {}, slot(params));
        }
    }
}

function emit(instance, event) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    var props = instance.props;
    //emit发送的事件名 需要做如下转换
    //add -> onAdd
    //child-plus -> onChildPlus
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
    // console.log("初始化Slots");
    var vnode = instance.vnode;
    if (vnode.shapeFlag & 16 /* shapeFlags.SLOT_CHILDREN */) {
        normalizeObjectSlots(children, instance.slots);
    }
}
function normalizeObjectSlots(children, slots) {
    var _loop_1 = function (key) {
        var value = children[key];
        // if (typeof value === "function") {
        //将用户传入的函数存到instance.slots上，后续在renderSlots中调用
        // TODO 这里没有对 value 做 normalize，
        // 默认 slots 返回的就是一个 vnode 对象
        slots[key] = function (params) { return normalizeSlotsValue(value(params)); };
    };
    for (var key in children) {
        _loop_1(key);
    }
}
function normalizeSlotsValue(value) {
    //将function value(){} 的返回值转换为array，这样Slots就可以支持多个元素了
    return Array.isArray(value) ? value : [value];
}

var currentInstance = null;
function createComponentInstance(vnode, parent) {
    console.log("currentParentInstance", parent);
    var component = {
        vnode: vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots: {},
        //首次创建组件实例，parent为null(此种写法会导致父子组件的provides指向同一地址，这是错误的)
        provides: parent ? parent.provides : {},
        parent: parent,
        emit: function () { },
    };
    //挂载emit,预先传入instance,这样使用emit时,只需传入event
    component.emit = emit.bind(null, component);
    return component;
}
function setupComponent(instance) {
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
        setCurrentInstance(instance);
        var setupResult = setup(instance.props, { emit: instance.emit });
        setCurrentInstance(null);
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
function getCurrentInstance() {
    return currentInstance;
}
function setCurrentInstance(instance) {
    currentInstance = instance;
}

function provide(key, val) {
    var currentInstance = getCurrentInstance();
    if (currentInstance) {
        var provides = currentInstance.provides;
        var parentProvides = currentInstance.parent.provides;
        //判断是否为初始化组件
        if (provides === parentProvides) {
            //将父组件实例的provides作为子组件provides的原型，然后再对它进行赋值操作
            provides = currentInstance.provides = Object.create(parentProvides);
        }
        provides[key] = val;
    }
}
function inject(key, defaultValue) {
    var currentInstance = getCurrentInstance();
    if (currentInstance) {
        var parentProvides = currentInstance.parent.provides;
        if (key in parentProvides) {
            return parentProvides[key];
        }
        else if (defaultValue) {
            if (typeof defaultValue === "function") {
                return defaultValue();
            }
            return defaultValue;
        }
    }
}

// import { render } from "./renderer";
function createAppApi(render) {
    return function createApp(rootComponent) {
        return {
            mount: function (rootContainer) {
                //先把component转换为vnode，所有的逻辑会基于vnode去处理
                var vnode = createVNode(rootComponent);
                render(vnode, rootContainer);
            },
        };
    };
}

function createRenderer(options) {
    var createElement = options.createElement, patchProp = options.patchProp, insert = options.insert;
    function render(vnode, container) {
        patch(vnode, container, null);
    }
    function patch(vnode, container, parentComponent) {
        //使用shapeFlags判断是组件还是element
        var type = vnode.type, shapeFlag = vnode.shapeFlag;
        switch (type) {
            case Fragment:
                processFragment(vnode, container, parentComponent);
                break;
            case Text:
                processText(vnode, container);
                break;
            default:
                if (shapeFlag & 1 /* shapeFlags.ELEMENT */) {
                    //处理element
                    processElement(vnode, container, parentComponent);
                }
                else if (shapeFlag & 2 /* shapeFlags.STATEFUL_COMPONENT */) {
                    //处理组件
                    processComponent(vnode, container, parentComponent);
                }
                break;
        }
    }
    function processText(vnode, container) {
        var children = vnode.children;
        var textNode = (vnode.el = document.createTextNode(children));
        container.append(textNode);
    }
    function processFragment(vnode, container, parentComponent) {
        mountChildren(vnode, container, parentComponent);
    }
    function processElement(vnode, container, parentComponent) {
        mountElement(vnode, container, parentComponent);
    }
    function mountElement(vnode, container, parentComponent) {
        // const el = document.createElement(vnode.type);
        var el = createElement(vnode.type);
        //vnode引用真实dom
        vnode.el = el;
        //设置textContent
        var children = vnode.children, shapeFlag = vnode.shapeFlag;
        //string array
        if (shapeFlag & 4 /* shapeFlags.TEXT_CHILDREN */) {
            el.textContent = children;
        }
        else if (shapeFlag & 8 /* shapeFlags.ARRAY_CHILDREN */) {
            mountChildren(vnode, el, parentComponent);
        }
        var props = vnode.props;
        for (var key in props) {
            var val = props[key];
            patchProp(el, key, val);
        }
        // container.append(el);
        insert(el, container);
    }
    function mountChildren(vnode, container, parentComponent) {
        vnode.children.forEach(function (v) { return patch(v, container, parentComponent); });
    }
    function processComponent(vnode, container, parentComponent) {
        mountComponent(vnode, container, parentComponent);
    }
    function mountComponent(initialVNode, container, parentComponent) {
        var instance = createComponentInstance(initialVNode, parentComponent);
        setupComponent(instance);
        setupRenderEffect(initialVNode, instance, container);
    }
    function setupRenderEffect(vnode, instance, container) {
        var proxy = instance.proxy;
        var subTree = instance.render.call(proxy);
        //vnode —> element —> mountElement
        patch(subTree, container, instance);
        //将根组件vnode的$el指向subTree的el，用户可以通过this.$el拿到根dom元素
        vnode.el = subTree.el;
    }
    return {
        createApp: createAppApi(render),
    };
}

function createElement(type) {
    console.log("createElement-----------------");
    return document.createElement(type);
}
function patchProp(el, key, val) {
    console.log("patchProp--------------------");
    // 绑定事件
    var isOn = function (key) { return /^on[A-Z]/.test(key); };
    if (isOn(key)) {
        var event_1 = key.slice(2).toLowerCase();
        el.addEventListener(event_1, val);
    }
    else {
        //设置attribute
        el.setAttribute(key, val);
    }
}
function insert(el, parent) {
    console.log("insert------------------");
    parent.append(el);
}
var renderer = createRenderer({ createElement: createElement, patchProp: patchProp, insert: insert });
function createApp() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return renderer.createApp.apply(renderer, args);
}

export { createApp, createRenderer, createTextVNode, getCurrentInstance, h, inject, provide, renderSlots };

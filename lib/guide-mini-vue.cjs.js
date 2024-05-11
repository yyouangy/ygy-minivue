'use strict';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var extend = Object.assign;
function isObject(val) {
    return val !== null && typeof val === "object";
}
function hasChanged(value, newValue) {
    return !Object.is(value, newValue);
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
        key: props && props.key,
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
    handler && handler.apply(void 0, __spreadArray([], __read(args), false));
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

var bucket = new WeakMap();
var activeEffect;
var shouldTrack = false;
var ReactiveEffect = /** @class */ (function () {
    function ReactiveEffect(fn, scheduler) {
        this.deps = [];
        this.active = true;
        this._fn = fn;
        this.scheduler = scheduler;
    }
    ReactiveEffect.prototype.run = function () {
        //如果调用了stop方法，直接返回_fn的调用结果
        if (!this.active) {
            return this._fn();
        }
        //
        shouldTrack = true;
        activeEffect = this;
        var res = this._fn();
        //重置
        shouldTrack = false;
        return res;
    };
    ReactiveEffect.prototype.stop = function () {
        //stop之后，activeEffect.deps清空了，之后当触发trigger时，不会再去调用run，实现了停止响应式的功能
        if (this.active) {
            cleanUp(this);
            if (this.onStop) {
                this.onStop();
            }
            this.active = false;
        }
    };
    return ReactiveEffect;
}());
function cleanUp(effect) {
    effect.deps.forEach(function (dep) { return dep.delete(effect); });
    effect.deps.length = 0;
}
function effect(fn, options) {
    if (options === void 0) { options = {}; }
    var _effect = new ReactiveEffect(fn, options.scheduler);
    //合并用户传入的options到_effect实例上
    extend(_effect, options);
    //执行fn
    _effect.run();
    var runner = _effect.run.bind(_effect);
    //将_effect实例挂载到runner上，为了在stop函数中调用实例的stop方法
    runner._effect = _effect;
    return runner;
}
//收集依赖
function track(target, key) {
    if (!isTracking())
        return;
    //weakMap->Map->Set
    //1.先基于weakMap({target:depMap})的 键target 找到对应的 值depMap
    var depMap = bucket.get(target);
    //2.没有depMap时，初始化depMap
    if (!depMap) {
        bucket.set(target, (depMap = new Map()));
    }
    //3.基于depMap({key:dep})的 键key 找到对应的 值dep
    var dep = depMap.get(key);
    //4.没有dep时，初始化dep
    if (!dep) {
        depMap.set(key, (dep = new Set()));
    }
    trackEffects(dep);
}
function trackEffects(dep) {
    if (dep.has(activeEffect))
        return;
    //5.将当前副作用函数activeEffect添加到dep中
    dep.add(activeEffect);
    //6.将dep挂载到activeEffect的deps属性上(使用全局变量activeEffect反向收集dep,是为了cleanUp中清除dep依赖)
    activeEffect.deps.push(dep);
}
//触发依赖
function trigger(target, key) {
    var depMap = bucket.get(target);
    var dep = depMap.get(key);
    triggerEffects(dep);
}
function triggerEffects(dep) {
    var e_1, _a;
    try {
        for (var dep_1 = __values(dep), dep_1_1 = dep_1.next(); !dep_1_1.done; dep_1_1 = dep_1.next()) {
            var effect_1 = dep_1_1.value;
            //判断effect是否有scheduler，如果有，执行scheduler，如果没有，照常执行run
            if (effect_1.scheduler) {
                effect_1.scheduler();
            }
            else {
                effect_1.run();
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (dep_1_1 && !dep_1_1.done && (_a = dep_1.return)) _a.call(dep_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
}
function isTracking() {
    return shouldTrack && activeEffect !== undefined;
}

var get = createGetter();
var set = createSetter();
var readonlyGet = createGetter(true);
var shallowReadonlyGet = createGetter(true, true);
function createGetter(isReadonly, shallow) {
    if (isReadonly === void 0) { isReadonly = false; }
    if (shallow === void 0) { shallow = false; }
    return function get(target, key) {
        if (key === "_v_isReactive" /* ReactiveFlags.IS_REACTIVE */) {
            return !isReadonly;
        }
        else if (key === "_v_isReadonly" /* ReactiveFlags.IS_READONLY */) {
            return isReadonly;
        }
        var res = Reflect.get(target, key);
        if (shallow) {
            return res;
        }
        //如果res是对象，递归处理
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        //不是readonly，才收集依赖
        if (!isReadonly) {
            track(target, key);
        }
        return res;
    };
}
function createSetter() {
    return function set(target, key, val) {
        var res = Reflect.set(target, key, val);
        trigger(target, key);
        return res;
    };
}
var mutableHandler = {
    get: get,
    set: set,
};
var readonlyHandler = {
    get: readonlyGet,
    set: function (target, key, val) {
        console.warn("key:".concat(key, ",set\u5931\u8D25,\u56E0\u4E3Atarget:").concat(target, "\u662Freadonly"));
        return true;
    },
};
extend({}, readonlyHandler, {
    get: shallowReadonlyGet,
});

//重构为传入源对象和对应的Hander
function reactive(raw) {
    return createReactiveObject(raw, mutableHandler);
}
function readonly(raw) {
    return createReactiveObject(raw, readonlyHandler);
}
function createReactiveObject(raw, Handler) {
    return new Proxy(raw, Handler);
}

var RefImpl = /** @class */ (function () {
    function RefImpl(value) {
        this._v_isRef = true;
        this._rawValue = value;
        this._value = convert(value);
        this.dep = new Set();
    }
    Object.defineProperty(RefImpl.prototype, "value", {
        get: function () {
            trackRefValue(this);
            return this._value;
        },
        set: function (newValue) {
            if (hasChanged(this._rawValue, newValue)) {
                this._value = convert(newValue);
                this._rawValue = newValue;
                triggerEffects(this.dep);
            }
        },
        enumerable: false,
        configurable: true
    });
    return RefImpl;
}());
function ref(value) {
    return new RefImpl(value);
}
function isRef(ref) {
    return !!ref["_v_isRef"];
}
function unref(ref) {
    return isRef(ref) ? ref.value : ref;
}
function proxyRefs(objectWithRefs) {
    return new Proxy(objectWithRefs, {
        get: function (target, key) {
            return unref(Reflect.get(target, key));
        },
        set: function (target, key, value) {
            if (isRef(target[key]) && !isRef(value)) {
                return (target[key].value = value);
            }
            else {
                return Reflect.set(target, key, value);
            }
        },
    });
}
function trackRefValue(ref) {
    if (isTracking()) {
        trackEffects(ref.dep);
    }
}
//对象->reactive包裹转换为响应式对象
//原始类型->直接return
function convert(value) {
    return isObject(value) ? reactive(value) : value;
}

var currentInstance = null;
function createComponentInstance(vnode, parent) {
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
        isMounted: false
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
        instance.setupState = proxyRefs(setupResult);
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
    var hostCreateElement = options.createElement, hostPatchProp = options.patchProp, hostInsert = options.insert, hostRemove = options.remove, hostSetElementText = options.setElementText;
    function render(vnode, container) {
        patch(null, vnode, container, null, null);
    }
    function patch(n1, n2, container, parentComponent, anchor) {
        //使用shapeFlags判断是组件还是element
        var type = n2.type, shapeFlag = n2.shapeFlag;
        switch (type) {
            case Fragment:
                processFragment(n1, n2, container, parentComponent);
                break;
            case Text:
                processText(n1, n2, container);
                break;
            default:
                if (shapeFlag & 1 /* shapeFlags.ELEMENT */) {
                    //处理element
                    processElement(n1, n2, container, parentComponent, anchor);
                }
                else if (shapeFlag & 2 /* shapeFlags.STATEFUL_COMPONENT */) {
                    //处理组件
                    processComponent(n1, n2, container, parentComponent);
                }
                break;
        }
    }
    function processText(n1, n2, container) {
        var children = n2.children;
        var textNode = (n2.el = document.createTextNode(children));
        container.append(textNode);
    }
    function processFragment(n1, n2, container, parentComponent) {
        mountChildren(n2.children, container, parentComponent);
    }
    function processElement(n1, n2, container, parentComponent, anchor) {
        if (!n1) {
            mountElement(n2, container, parentComponent, anchor);
        }
        else {
            patchElement(n1, n2, container, parentComponent);
        }
    }
    function patchElement(n1, n2, container, parentComponent) {
        console.log("patchElement");
        var oldProps = n1.props;
        var newProps = n2.props;
        var el = (n2.el = n1.el);
        patchChildren(n1, n2, el, parentComponent);
        patchProps(el, oldProps, newProps);
    }
    function patchChildren(n1, n2, container, parentComponent) {
        console.log(n1);
        console.log(n2);
        //根据n1,n2的shapeFlag判断新旧VNode的children类型
        var oldShapeFlag = n1.shapeFlag;
        var c1 = n1.children;
        var c2 = n2.children;
        var shapeFlag = n2.shapeFlag;
        //处理新节点的children是Text类型
        if (shapeFlag & 4 /* shapeFlags.TEXT_CHILDREN */) {
            //Array->Text
            if (oldShapeFlag & 8 /* shapeFlags.ARRAY_CHILDREN */) {
                console.log("Array=>Text");
                //1.清空老节点的children
                unmountChildren(c1);
            }
            //Array->Text c1≠c2恒成立
            //Text->Text  c2≠c2时设置Text
            if (c1 !== c2) {
                //2.设置Text
                hostSetElementText(container, c2);
            }
        }
        else {
            //处理新节点的children是Array类型
            //Text->Array
            if (oldShapeFlag & 4 /* shapeFlags.TEXT_CHILDREN */) {
                hostSetElementText(container, "");
                mountChildren(c2, container, parentComponent);
            }
            //Array->Array diff
            else {
                console.log("Array->Array");
                patchKeyedChildren(c1, c2, container, parentComponent);
            }
        }
    }
    function patchKeyedChildren(c1, c2, container, parentComponent) {
        //判断节点是否相同
        function isSameVNodeType(n1, n2) {
            return n1.type === n2.type && n1.key === n2.key;
        }
        //预处理前置节点
        var i = 0;
        var l2 = c2.length;
        var e1 = c1.length - 1;
        var e2 = c2.length - 1;
        while (i <= e1 && i <= e2) {
            var n1 = c1[i];
            var n2 = c2[i];
            if (isSameVNodeType(n1, n2)) {
                //如果n1,n2是相同的，递归调用patch比较
                patch(n1, n2, container, parentComponent, null);
            }
            else {
                break;
            }
            i++;
        }
        //预处理后置节点
        while (i <= e1 && i <= e2) {
            var n1 = c1[e1];
            var n2 = c2[e2];
            if (isSameVNodeType(n1, n2)) {
                //如果n1,n2是相同的，递归调用patch比较
                patch(n1, n2, container, parentComponent, null);
            }
            else {
                break;
            }
            e1--;
            e2--;
        }
        console.log(i, e1, e2);
        //新的比旧的多(需要新增节点)
        if (i > e1) {
            //新节点还有元素未遍历完
            if (i <= e2) {
                var nextPos = e2 + 1;
                console.log(c2, nextPos);
                var anchor = nextPos < l2 ? c2[nextPos].el : null;
                // 遍历剩余的新子节点(i到e2之间)，依次插入到锚点之前
                while (i <= e2) {
                    patch(null, c2[i], container, parentComponent, anchor);
                    i++;
                }
            }
        }
        //新的比旧的少(需要卸载节点)
        if (i > e2) {
            //旧节点还有元素未遍历完
            if (i <= e1) {
                console.log("新<旧");
                // 遍历剩余的旧子节点(i到e1之间)，依次卸载
                while (i <= e1) {
                    hostRemove(c1[i].el);
                    i++;
                }
            }
        }
    }
    function unmountChildren(children) {
        for (var i = 0; i < children.length; i++) {
            var el = children[i];
            hostRemove(el);
        }
    }
    function patchProps(el, oldProps, newProps) {
        for (var key in newProps) {
            var prevProp = oldProps[key];
            var nextProp = newProps[key];
            if (prevProp !== nextProp) {
                //props发生了更新
                hostPatchProp(el, key, prevProp, nextProp);
            }
        }
    }
    function mountElement(vnode, container, parentComponent, anchor) {
        // const el = document.createElement(vnode.type);
        var el = hostCreateElement(vnode.type);
        //vnode引用真实dom
        vnode.el = el;
        //设置textContent
        var children = vnode.children, shapeFlag = vnode.shapeFlag;
        //string array
        if (shapeFlag & 4 /* shapeFlags.TEXT_CHILDREN */) {
            el.textContent = children;
        }
        else if (shapeFlag & 8 /* shapeFlags.ARRAY_CHILDREN */) {
            mountChildren(children, el, parentComponent);
        }
        var props = vnode.props;
        for (var key in props) {
            var val = props[key];
            hostPatchProp(el, key, null, val);
        }
        // container.append(el);
        hostInsert(el, container, anchor);
    }
    function mountChildren(children, container, parentComponent) {
        children.forEach(function (v) { return patch(null, v, container, parentComponent); });
    }
    function processComponent(n1, n2, container, parentComponent) {
        mountComponent(n1, n2, container, parentComponent);
    }
    function mountComponent(n1, n2, container, parentComponent) {
        var instance = createComponentInstance(n2, parentComponent);
        setupComponent(instance);
        setupRenderEffect(n2, instance, container);
    }
    function setupRenderEffect(vnode, instance, container) {
        effect(function () {
            if (!instance.isMounted) {
                console.log("init");
                var proxy = instance.proxy;
                var subTree = instance.render.call(proxy);
                //存一下init时的subTree
                instance.subTree = subTree;
                //vnode —> element —> mountElement
                patch(null, subTree, container, instance);
                //将根组件vnode的$el指向subTree的el，用户可以通过this.$el拿到根dom元素
                vnode.el = subTree.el;
                instance.isMounted = true;
            }
            else {
                console.log("update");
                var proxy = instance.proxy;
                var subTree = instance.render.call(proxy);
                var prevSubTree = instance.subTree;
                var nextSubTree = subTree;
                instance.subTree = subTree;
                patch(prevSubTree, nextSubTree, container, instance);
            }
        });
    }
    return {
        createApp: createAppApi(render),
    };
}

function createElement(type) {
    return document.createElement(type);
}
function patchProp(el, key, prevVal, nextVal) {
    // 绑定事件
    var isOn = function (key) { return /^on[A-Z]/.test(key); };
    if (isOn(key)) {
        var event_1 = key.slice(2).toLowerCase();
        el.addEventListener(event_1, nextVal);
    }
    else {
        //设置attribute
        el.setAttribute(key, nextVal);
    }
}
function insert(child, parent, anchor) {
    // parent.append(el);
    parent.insertBefore(child, anchor);
}
function remove(child) {
    var parent = child.parentNode;
    if (parent) {
        parent.removeChild(child);
    }
}
function setElementText(el, text) {
    el.textContent = text;
}
var renderer = createRenderer({
    createElement: createElement,
    patchProp: patchProp,
    insert: insert,
    remove: remove,
    setElementText: setElementText,
});
function createApp() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return renderer.createApp.apply(renderer, __spreadArray([], __read(args), false));
}

exports.createApp = createApp;
exports.createRenderer = createRenderer;
exports.createTextVNode = createTextVNode;
exports.effect = effect;
exports.getCurrentInstance = getCurrentInstance;
exports.h = h;
exports.inject = inject;
exports.provide = provide;
exports.ref = ref;
exports.renderSlots = renderSlots;

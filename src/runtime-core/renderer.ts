import { effect } from "../reactivity";
import { createComponentInstance, setupComponent } from "./component";
import { createAppApi } from "./createApp";
import { shapeFlags } from "./ShapeFlags";
import { Fragment, Text } from "./vnode";

export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText,
  } = options;

  function render(vnode, container) {
    patch(null, vnode, container, null);
  }

  function patch(n1, n2, container, parentComponent) {
    //使用shapeFlags判断是组件还是element
    const { type, shapeFlag } = n2;
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent);
        break;
      case Text:
        processText(n1, n2, container);
        break;
      default:
        if (shapeFlag & shapeFlags.ELEMENT) {
          //处理element
          processElement(n1, n2, container, parentComponent);
        } else if (shapeFlag & shapeFlags.STATEFUL_COMPONENT) {
          //处理组件
          processComponent(n1, n2, container, parentComponent);
        }
        break;
    }
  }

  function processText(n1, n2, container) {
    const { children } = n2;
    const textNode = (n2.el = document.createTextNode(children));
    container.append(textNode);
  }
  function processFragment(n1, n2, container, parentComponent) {
    mountChildren(n2.children, container, parentComponent);
  }
  function processElement(n1, n2, container: any, parentComponent) {
    if (!n1) {
      mountElement(n2, container, parentComponent);
    } else {
      patchElement(n1, n2, container, parentComponent);
    }
  }

  function patchElement(n1, n2, container, parentComponent) {
    console.log("patchElement");
    const { props: oldProps } = n1;
    const { props: newProps } = n2;
    const el = (n2.el = n1.el);

    patchChildren(n1, n2, el, parentComponent);
    patchProps(el, oldProps, newProps);
  }
  function patchChildren(n1, n2, container, parentComponent) {
    console.log(n1);
    console.log(n2);
    //根据n1,n2的shapeFlag判断新旧VNode的children类型
    const { shapeFlag: oldShapeFlag } = n1;
    const { children: c1 } = n1;
    const { children: c2 } = n2;
    const { shapeFlag } = n2;
    //处理新节点的children是Text类型
    if (shapeFlag & shapeFlags.TEXT_CHILDREN) {
      //Array->Text
      if (oldShapeFlag & shapeFlags.ARRAY_CHILDREN) {
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
    } else {
      //处理新节点的children是Array类型

      //Text->Array
      if (oldShapeFlag & shapeFlags.TEXT_CHILDREN) {
        hostSetElementText(container, "");
        mountChildren(c2, container, parentComponent);
      }
      //Array->Array diff
      else {
        console.log("Array->Array");
        patchKeyedChildren(c1, c2);
      }
    }
  }

  function patchKeyedChildren(c1,c2){
    
  }
  function unmountChildren(children) {
    for (let i = 0; i < children.length; i++) {
      const el = children[i];
      hostRemove(el);
    }
  }
  function patchProps(el, oldProps, newProps) {
    for (const key in newProps) {
      const prevProp = oldProps[key];
      const nextProp = newProps[key];
      if (prevProp !== nextProp) {
        //props发生了更新
        hostPatchProp(el, key, prevProp, nextProp);
      }
    }
  }
  function mountElement(vnode, container: any, parentComponent) {
    // const el = document.createElement(vnode.type);
    const el = hostCreateElement(vnode.type);
    //vnode引用真实dom
    vnode.el = el;
    //设置textContent
    const { children, shapeFlag } = vnode;
    //string array
    if (shapeFlag & shapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlag & shapeFlags.ARRAY_CHILDREN) {
      mountChildren(children, el, parentComponent);
    }
    const { props } = vnode;
    for (const key in props) {
      const val = props[key];
      hostPatchProp(el, key, null, val);
    }
    // container.append(el);
    hostInsert(el, container);
  }
  function mountChildren(children, container, parentComponent) {
    children.forEach((v) => patch(null, v, container, parentComponent));
  }
  function processComponent(n1, n2, container: any, parentComponent) {
    mountComponent(n1, n2, container, parentComponent);
  }

  function mountComponent(n1, n2, container, parentComponent) {
    const instance = createComponentInstance(n2, parentComponent);

    setupComponent(instance);
    setupRenderEffect(n2, instance, container);
  }
  function setupRenderEffect(vnode, instance: any, container) {
    effect(() => {
      if (!instance.isMounted) {
        console.log("init");
        const { proxy } = instance;
        const subTree = instance.render.call(proxy);
        //存一下init时的subTree
        instance.subTree = subTree;
        //vnode —> element —> mountElement
        patch(null, subTree, container, instance);
        //将根组件vnode的$el指向subTree的el，用户可以通过this.$el拿到根dom元素
        vnode.el = subTree.el;

        instance.isMounted = true;
      } else {
        console.log("update");
        const { proxy } = instance;
        const subTree = instance.render.call(proxy);
        const prevSubTree = instance.subTree;
        const nextSubTree = subTree;
        instance.subTree = subTree;

        patch(prevSubTree, nextSubTree, container, instance);
      }
    });
  }

  return {
    createApp: createAppApi(render),
  };
}

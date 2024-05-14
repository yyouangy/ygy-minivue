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
    patch(null, vnode, container, null, null);
  }

  function patch(n1, n2, container, parentComponent, anchor) {
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
          processElement(n1, n2, container, parentComponent, anchor);
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
  function processElement(n1, n2, container: any, parentComponent, anchor) {
    if (!n1) {
      mountElement(n2, container, parentComponent, anchor);
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
    //根据n1,n2的shapeFlag判断新旧VNode的children类型
    const { shapeFlag: oldShapeFlag } = n1;
    //c1:旧子节点
    const { children: c1 } = n1;
    //c2:新子节点
    const { children: c2 } = n2;
    const { shapeFlag } = n2;
    //处理新节点的children是Text类型
    if (shapeFlag & shapeFlags.TEXT_CHILDREN) {
      //Array->Text
      if (oldShapeFlag & shapeFlags.ARRAY_CHILDREN) {
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
    let i = 0;
    let l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = c2.length - 1;
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i];
      if (isSameVNodeType(n1, n2)) {
        //如果n1,n2是相同的，递归调用patch比较
        patch(n1, n2, container, parentComponent, null);
      } else {
        break;
      }
      i++;
    }

    //预处理后置节点
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2];
      if (isSameVNodeType(n1, n2)) {
        //如果n1,n2是相同的，递归调用patch比较
        patch(n1, n2, container, parentComponent, null);
      } else {
        break;
      }
      e1--;
      e2--;
    }

    //新的比旧的多(需要新增节点)
    if (i > e1) {
      //新节点还有元素未遍历完
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : null;
        // 遍历剩余的新子节点(i到e2之间)，依次插入到锚点之前
        while (i <= e2) {
          patch(null, c2[i], container, parentComponent, anchor);
          i++;
        }
      }
    }

    //新的比旧的少(需要卸载节点)
    else if (i > e2) {
      // 遍历剩余的旧子节点(i到e1之间)，依次卸载
      while (i <= e1) {
        hostRemove(c1[i].el);
        i++;
      }
    } else {
      //中间对比
      //旧：A B C D F G
      //新：A B E C F G
      let s1 = i;
      let s2 = i;
      //c2中需要patch的节点个数
      let toBePatched = e2 - s2 + 1;
      //c2中已经patch过的节点
      let patched = 0;
      let moved = false;
      let maxNewIndexSoFar = 0;
      //创建新旧节点对应的有映射关系,使用定长数组，性能更好
      const newIndexToOldIndexMap = new Array(toBePatched);
      for (let i = 0; i < toBePatched; i++) {
        newIndexToOldIndexMap[i] = 0;
      }

      //创建映射表，用于通过节点的key查找该节点在c2中的位置
      const keyToNewIndexMap = new Map();
      for (let i = s2; i <= e2; i++) {
        const nextChild = c2[i];
        //key ≠ null undefined
        // if (nextChild.key !== null) {
        //   //如果映射表中有相同的key需要报错
        //   if (keyToNewIndexMap.has(nextChild.key)) {
        //     console.warn(
        //       `Duplicate keys found during update:`,
        //       JSON.stringify(nextChild.key),
        //       `Make sure keys are unique.`
        //     );
        //   }
        //将key作为键，c2中这个节点的索引作为值
        keyToNewIndexMap.set(nextChild.key, i);
        // }
      }
      console.log(keyToNewIndexMap); //Map(2) {'E' => 2, 'C' => 3, 'D' => 4}

      //遍历c1，确认每个节点在c2中是否存在
      for (let i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        if (patched >= toBePatched) {
          hostRemove(prevChild);
          continue;
        }

        let newIndex;
        if (prevChild.key !== null) {
          newIndex = keyToNewIndexMap.get(prevChild.key);
        } else {
          //props中未传入key时，遍历c2查找
          for (let j = s2; j <= e2; j++) {
            if (isSameVNodeType(prevChild, c2[j])) {
              newIndex = j;
              break;
            }
          }
        }
        //c1[newIndex]在c2中不存在
        if (newIndex === undefined) {
          hostRemove(prevChild.el);
        } else {
          //建立同一个元素在c1和c2中位置的关系
          newIndexToOldIndexMap[newIndex - s2] = i + 1;
          //判断是否需要移动
          //maxNewIndexSoFar用来记录上一次的newIndex,如果newIndex小于上一次的newIndex，说明在c1中，当前节点在上一个节点的后面
          //而在c2中，当前节点在上一个节点的前面，说明当前节点需要移动
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          patch(prevChild, c2[newIndex], container, parentComponent, null);
          patched++;
        }
      }

      const increasingNewIndexSequence = moved
        ? getSequence(newIndexToOldIndexMap)
        : [];
      let j = increasingNewIndexSequence.length - 1;
      //倒循环可以确保锚点是一个确定的节点(不会移动)
      for (let i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i;
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : null;
        if (newIndexToOldIndexMap[i] === 0) {
          patch(null, nextChild, container, parentComponent, anchor);
        } else if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            console.log(i, j, "移动逻辑");
            hostInsert(nextChild.el, container, anchor);
          } else {
            j--;
          }
        }
      }
    }
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
  function mountElement(vnode, container: any, parentComponent, anchor) {
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
    hostInsert(el, container, anchor);
  }
  function mountChildren(children, container, parentComponent) {
    children.forEach((v) => patch(null, v, container, parentComponent, null));
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
        patch(null, subTree, container, instance, null);
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

        patch(prevSubTree, nextSubTree, container, instance, null);
      }
    });
  }

  return {
    createApp: createAppApi(render),
  };
}

// 最长的递增子序列
function getSequence(arr) {
  const len = arr.length;
  const min_arr = [0]; // 存储最小的索引，以索引0为基准
  const prev_arr = arr.slice(); // 储存前面的索引，slice为浅复制一个新的数组
  let last_index;
  let start;
  let end;
  let middle;
  for (let i = 0; i < len; i++) {
    let arrI = arr[i];
    if (arrI !== 0) {
      // vue中为0，表示直接创建
      // 1. 如果当前n比min_arr最后一项大
      last_index = min_arr[min_arr.length - 1];
      if (arr[last_index] < arrI) {
        min_arr.push(i);
        prev_arr[i] = last_index; // 前面的索引
        continue;
      }
      // 2. 如果当前n比min_arr最后一项小（二分类查找）
      start = 0;
      end = min_arr.length - 1;
      while (start < end) {
        middle = (start + end) >> 1; // 相当于Math.floor((start + end)/2)
        if (arr[min_arr[middle]] < arrI) {
          start = middle + 1;
        } else {
          end = middle;
        }
      }
      if (arr[min_arr[end]] > arrI) {
        min_arr[end] = i;
        if (end > 0) {
          prev_arr[i] = min_arr[end - 1]; // 前面的索引
        }
      }
    }
  }

  // 从最后一项往前查找
  let result = [];
  let i = min_arr.length;
  let last = min_arr[i - 1];
  while (i-- > 0) {
    result[i] = last;
    last = prev_arr[last];
  }

  return result;
}

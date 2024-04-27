import { createVNode ,Fragment} from "../vnode";
export function renderSlots(slots, slotName: string, params) {
  const slot = slots[slotName];
  console.log(`渲染插槽 slot -> ${slotName}`);
  if (slot) {
    if (typeof slot === "function") {
      return createVNode(Fragment, {}, slot(params));
    }
  }
}

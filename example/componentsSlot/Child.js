import { h, renderSlots } from "../../lib/guide-mini-vue.esm.js";
export const Child = {
    setup() {
        return {};
    },
    render() {
        const child = h("div", {}, "child");
        return h("div", {}, [
            renderSlots(this.$slots, "header", { age: 18 }),
            child,
            renderSlots(this.$slots, "footer"),
        ]);
    },
};
import { h, renderSlots } from "../../lib/guide-mini-vue.esm.js";
export const Child = {
    setup() {
        return {};
    },
    render() {
        const child = h("div", {}, "child");
        return h("div", {}, [child, renderSlots(this.$slots)]);
    },
};
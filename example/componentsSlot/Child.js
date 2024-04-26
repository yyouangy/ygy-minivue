<<<<<<< HEAD
import { h, renderSlots } from "../../lib/guide-mini-vue.esm.js";
export const Child = {
    setup() {
        return {};
    },
    render() {
        const child = h("div", {}, "child");
        return h("div", {}, [child, renderSlots(this.$slots)]);
    },
=======
import { h } from "../../lib/guide-mini-vue.esm.js";

export const Child = {
    setup() {},
    render() {
        const child = h("h2", {}, "child");
        //Child.vnode.children       
        console.log(this.$slots);
        return h("div", {}, [child, h('div', {}, this.$slots)]);
    },
>>>>>>> 7ffb2bec2eea0a8d00b6ff4bc316acd5543e6634
};
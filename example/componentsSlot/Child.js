import { h } from "../../lib/guide-mini-vue.esm.js";

export const Child = {
    setup() {},
    render() {
        const child = h("h2", {}, "child");
        //Child.vnode.children       
        console.log(this.$slots);
        return h("div", {}, [child, h('div', {}, this.$slots)]);
    },
};
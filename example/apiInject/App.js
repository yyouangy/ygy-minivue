import { h, provide, inject } from "../../lib/guide-mini-vue.esm.js";
const Parent = {
    name: "Parent",
    setup() {
        provide("parentData1", 50);
        provide("parentData2", "hhh");
    },
    render() {
        return h("div", {}, [h("h1", {}, "Parent"), h(Child)]);
    },
};

const Child = {
    name: "Child",
    setup() {
        const a = inject("parentData1");
        const b = inject("parentData2");
        return { a, b };
    },
    render() {
        return h("div", {}, `Child:${this.a}${this.b}`);
    },
};

export default {
    name: "App",
    setup() {},
    render() {
        return h("div", {}, [h("div", {}, ["apiInject", h(Parent)])]);
    },
};
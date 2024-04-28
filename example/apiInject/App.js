import { h, provide, inject } from "../../lib/guide-mini-vue.esm.js";
const Parent = {
    name: "Parent",
    setup() {
        provide("parentData1", 50);
        provide("parentData2", "hhh");
    },
    render() {
        return h("div", {}, [h("h2", {}, "Parent"), h(Child)]);
    },
};

const Child = {
    name: "Child",
    setup() {
        provide("parentData1", "childMsg1");
        provide("parentData2", "childMsg2");
        //
        //当自身和父组件有同名的provide，会获取自身的provide，这是错误的，需要优化
        const a = inject("parentData1");
        const b = inject("parentData2");
        return { a, b };
    },
    render() {
        return h("div", {}, [
            h("h3", {}, `Child:${this.a}—${this.b}`),
            h(GrandChild),
        ]);
    },
};
const GrandChild = {
    name: "GrandChild",
    setup() {
        //期望获取Parent组件的provide
        const a = inject("parentData1");
        const b = inject("parentData2");
        //inject扩展
        const c = inject("msg", "defaultMsg");
        const d = inject("msg", () => "defaultFn");

        return { a, b, c, d };
    },
    render() {
        return h("h4", {}, `GrandChild:${this.a}—${this.b}-${this.c}-${this.d}`);
    },
};
export default {
    name: "App",
    setup() {},
    render() {
        return h("div", {}, [h("div", {}, [h("h1", {}, "apiInject"), h(Parent)])]);
    },
};
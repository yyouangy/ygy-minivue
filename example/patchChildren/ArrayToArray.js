import { ref, h } from "../../lib/guide-mini-vue.esm.js";

//老的是Array 新的是Array
const prevChildren = [
    h("p", { key: "A" }, "A"),
    h("p", { key: "B" }, "B"),
    h("p", { key: "C" }, "C"),
];
const nextChildren = [
    h("p", { key: "A" }, "A"),
    h("p", { key: "B" }, "B"),
    h("p", { key: "D" }, "D"),
    h("p", { key: "E" }, "E"),
];

export default {
    name: "ArrayToText",
    setup() {
        const isChange = ref(false);
        window.isChange = isChange;
        return { isChange };
    },
    render() {
        const self = this;
        return self.isChange ?
            h("div", {}, nextChildren) :
            h("div", {}, prevChildren);
    },
};
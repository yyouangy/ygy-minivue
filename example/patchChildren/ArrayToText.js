import { ref, h } from "../../lib/guide-mini-vue.esm.js";

//老的是Array 新的是Text
const nextChildren = "newChildren";
const prevChildren = [h("div", {}, "A"), h("div", {}, "B")];

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
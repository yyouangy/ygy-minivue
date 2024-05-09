import { ref, h } from "../../lib/guide-mini-vue.esm.js";

//老的是Text 新的是Array
const nextChildren = [h("div", {}, "A"), h("div", {}, "B")];
const prevChildren = "oldChildren";

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
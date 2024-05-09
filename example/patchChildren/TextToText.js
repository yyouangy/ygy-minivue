import { ref, h } from "../../lib/guide-mini-vue.esm.js";

//老的是Text 新的是Text
const nextChildren = "newChildren";
const prevChildren = "oldChildren";

export default {
    name: "TextToText",
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
import { h, getCurrentInstance } from "../../lib/guide-mini-vue.esm.js";
export const Child = {
    name: 'Child',
    setup() {
        const currentInstance = getCurrentInstance();
        console.log(`Child:`, currentInstance);
        return {};
    },
    render() {
        const child = h("div", {}, "child");
        return h("div", {}, [child]);
    },
};
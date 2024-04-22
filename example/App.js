import { h } from "../lib/guide-mini-vue.esm.js";

export const App = {
    //core 不实现处理.vue的逻辑
    render() {
        //ui
        return h("div", { id: "root", class: "wraper" }, [
            h("p", { class: "red" }, "I am"),
            h("p", { class: "blue" }, this.msg),
        ]);
    },
    setup() {
        return {
            msg: "YGY",
        };
    },
};
import { h } from "../../lib/guide-mini-vue.esm.js";
import { Foo } from "./Foo.js";

// window.self = null;
export const App = {
    //core 不实现处理.vue的逻辑
    render() {
        // window.self = this;
        //ui
        return h(
            "div", {
                id: "root",
                class: "wraper",
                onClick() {
                    console.log("click");
                },
                onContextmenu() {
                    console.log("contextmenu");
                },
            }, [h(Foo, { count: 1 })]
            // [h("p", { class: "red" }, "I am"), h("p", { class: "blue" }, this.msg)]
        );
    },
    setup() {
        return {
            msg: "YGY",
        };
    },
};
import { h } from "../lib/guide-mini-vue.esm.js"


export const App = {
    //core 不实现处理.vue的逻辑
    render() {
        //ui
        return h("div", "hello," + this.msg);
    },
    setup() {
        return {
            msg: "minivue",
        };
    },
};
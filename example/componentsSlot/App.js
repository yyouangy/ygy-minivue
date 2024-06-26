import { h, createTextVNode } from "../../lib/guide-mini-vue.esm.js";
import { Child } from "./Child.js";
export const App = {
    name: "App",
    setup() {
        return {};
    },
    render() {
        const app = h("div", {}, "app");

        //1.支持children的两种格式(不处理)
        //children是单个vnode
        // const child = h(Child, {}, h("h1", {}, "app->child"));
        //children是vnode数组
        // const child = h(Child, {}, [
        //     h("h1", {}, "app->child-1"),
        //     h("h1", {}, "app->child-2"),
        // ]);

        //2.具名插槽
        // const child = h(
        //     Child, {}, {
        //         header: h("h1", {}, "header"),
        //         footer: h("h1", {}, "footer"),
        //     }
        // );

        //3.作用域插槽
        const child = h(
            Child, {}, {
                header: (age) => [
                    h("h1", {}, "header" + age),
                    createTextVNode("我是header"),
                ],
                footer: () => h("h1", {}, "footer"),
            }
        );
        return h("div", {}, [app, child]);
    },
};
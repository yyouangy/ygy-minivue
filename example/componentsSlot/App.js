<<<<<<< HEAD
import { h } from "../../lib/guide-mini-vue.esm.js";
import { Child } from "./Child.js";
export const App = {
    name: "App",
    setup() {
        return {};
    },
    render() {
        const app = h("div", {}, "app");

        //1.支持children的两种格式
        //children是单个vnode
        // const child = h(Child, {}, h("h1", {}, "app->child"));
        //children是vnode数组
        // const child = h(Child, {},  [
        // h("h1", {}, "app->child-1"),
        // h("h1", {}, "app->child-2"),
        // ]);

        //2.具名插槽
        const child = h(Child, {}, [
            { header: h("h1", {}, "header") },
            { footer: h("h1", {}, "footer") },
        ]);
        return h("div", {}, [app, child]);
    },
=======
import { h } from "../../lib/guide-mini-vue.esm.js";
import { Child } from "./Child.js";
export const App = {
    setup() {
        return {};
    },
    render() {
        const app = h('h1', {}, 'app');

        //期望 h2标签可以渲染到Child的slots中
        //1.支持单元素
        // const child = h(Child, {}, h('h2', {}, 'app->child'))
        //2.支持数组 [vnode,vnode]转换为vnode
        const child = h(Child, {}, [h('h2', {}, 'app->child-1'), h('h2', {}, 'app->child-2')])
        return h("div", {}, [
            app, child
        ]);
    },
>>>>>>> 7ffb2bec2eea0a8d00b6ff4bc316acd5543e6634
};
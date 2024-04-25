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
};
import { h, getCurrentInstance } from "../../lib/guide-mini-vue.esm.js";
import { Child } from "./Child.js";
export const App = {
    name: "App",
    setup() {
        const currentInstance = getCurrentInstance();
        console.log(`App:`, currentInstance);
        return {};
    },
    render() {
        const app = h("div", {}, "app");
        const child = h(Child, {}, [h("div", {}, "hi")]);
        return h("div", {}, [app, child]);
    },
};
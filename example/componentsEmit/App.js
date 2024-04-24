import { h } from "../../lib/guide-mini-vue.esm.js";
import { Child } from "./child.js";
export const App = {
    setup() {
        return {};
    },
    render() {
        return h("div", {}, [
            h("h1", {}, "App"),
            h(Child, {
                onAdd(a, b) {
                    console.log("receive add", a, b);
                },
                onChildPlus() {
                    console.log("receive child-plus");
                },
            }),
        ]);
    },
};
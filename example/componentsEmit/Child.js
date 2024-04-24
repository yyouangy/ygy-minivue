import { h } from "../../lib/guide-mini-vue.esm.js";

export const Child = {
    setup(props, { emit }) {
        const emitAdd = () => {
            console.log("emitAdd run");
            emit("add", 1, 2);
        };

        const emitChildPlus = () => {
            console.log("emitChildPlus run");
            emit("child-plus");
        };
        return { emitAdd, emitChildPlus };
    },
    render() {
        const child = h("span", {}, "child");
        const btn1 = h("button", { onClick: this.emitAdd }, "add");
        const btn2 = h("button", { onClick: this.emitChildPlus }, "child-plus");

        return h("div", {}, [child, btn1, btn2]);
    },
};
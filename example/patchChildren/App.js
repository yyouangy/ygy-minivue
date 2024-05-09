import { h } from "../../lib/guide-mini-vue.esm.js";

// import ArrayToText from "./ArrayToText.js";
import ArrayToArray from "./ArrayToArray.js";
// import TextToArray from "./TextToArray.js";
// import TextToText from "./TextToText.js";

export const App = {
    name: "App",

    setup() {
        return {};
    },
    render() {
        return h(
            "div", {
                tId: 1,
            }, [
                h("p", {}, "主页"),
                //老的是Array 新的是Text
                // h(ArrayToText),
                //老的是Text) 新的是Text
                // h(TextToText),
                //老的是Text 新的是Array
                // h(TextToArray),
                //老的是Array 新的是Array
                h(ArrayToArray),
            ]
        );
    },
};
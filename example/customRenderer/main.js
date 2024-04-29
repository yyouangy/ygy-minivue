import { createRenderer } from "../../lib/guide-mini-vue.esm.js";
import { App } from "./App.js";

const game = new PIXI.Application();
await game.init({
    width: 500,
    height: 500,
});
document.body.append(game.canvas);
const renderer = createRenderer({
    createElement(type) {
        if (type === "rect") {
            const rect = new PIXI.Graphics();
            rect.beginFill(0xff0000);
            rect.drawRect(10, 10, 100, 100);
            rect.endFill();
            console.log(rect);
            return rect;
        }
    },
    patchProp(el, key, val) {
        el[key] = val;
    },
    insert(el, parent) {
        parent.addChild(el);
    },
});

renderer.createApp(App).mount(game.stage);
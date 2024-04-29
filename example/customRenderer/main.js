import { createRenderer } from "../../lib/guide-mini-vue.esm.js";
import { App } from "./App.js";

console.log(PIXI);
const game = new PIXI.Application();
console.log(game);
await game.init({
    width: 500,
    height: 500
})
console.log(game.canvas);
document.body.append(game.canvas)
const renderer = createRenderer({
    createElement(type) {

    },
    patchProp(el, key, val) {

    },
    insert(el, parent) {

    }
})

const rootContainer = document.querySelector('#app');
renderer.createApp(App).mount(rootContainer)
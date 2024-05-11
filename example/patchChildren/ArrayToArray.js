import { ref, h } from "../../lib/guide-mini-vue.esm.js";

//老的是Array 新的是Array

//1.左侧 预处理前置节点
//(A B) C
//(A B) D E
// const prevChildren = [
//     h("p", { key: "A" }, "A"),
//     h("p", { key: "B" }, "B"),
//     h("p", { key: "C" }, "C"),
// ];
// const nextChildren = [
//     h("p", { key: "A" }, "A"),
//     h("p", { key: "B" }, "B"),
//     h("p", { key: "D" }, "D"),
//     h("p", { key: "E" }, "E"),
// ];
//2.右侧 预处理后置节点
//  A (B C)
//D E (B C)
// const prevChildren = [
//     h("p", { key: "A" }, "A"),
//     h("p", { key: "B" }, "B"),
//     h("p", { key: "C" }, "C"),
// ];
// const nextChildren = [
//     h("p", { key: "D" }, "D"),
//     h("p", { key: "E" }, "E"),
//     h("p", { key: "B" }, "B"),
//     h("p", { key: "C" }, "C"),
// ];

//3.新的比旧的多(需要新增节点)

//左侧
//旧：A B
//新：C A B
// const prevChildren = [h("p", { key: "A" }, "A"), h("p", { key: "B" }, "B")];
// const nextChildren = [
//     h("p", { key: "E" }, "E"),
//     h("p", { key: "D" }, "D"),
//     h("p", { key: "C" }, "C"),
//     h("p", { key: "A" }, "A"),
//     h("p", { key: "B" }, "B"),
// ];

//右侧
//旧：A B
//新：A B C
// const prevChildren = [h("p", { key: "A" }, "A"), h("p", { key: "B" }, "B")];
// const nextChildren = [
//     h("p", { key: "A" }, "A"),
//     h("p", { key: "B" }, "B"),
//     h("p", { key: "C" }, "C"),
//     h("p", { key: "D" }, "D"),
//     h("p", { key: "E" }, "E"),
// ];

//4.新的比旧的少(需要卸载节点)

//左侧
//旧：C D E A B
//新：A B
const prevChildren = [
    h("p", { key: "C" }, "C"),
    h("p", { key: "D" }, "D"),
    h("p", { key: "E" }, "E"),
    h("p", { key: "A" }, "A"),
    h("p", { key: "B" }, "B"),
];

const nextChildren = [h("p", { key: "A" }, "A"), h("p", { key: "B" }, "B")];

//右侧
//旧：A B C D E
//新：A B
// const prevChildren = [
//     h("p", { key: "A" }, "A"),
//     h("p", { key: "B" }, "B"),
//     h("p", { key: "C" }, "C"),
//     h("p", { key: "D" }, "D"),
//     h("p", { key: "E" }, "E"),
// ];

// const nextChildren = [h("p", { key: "A" }, "A"), h("p", { key: "B" }, "B")];
export default {
    name: "ArrayToText",
    setup() {
        const isChange = ref(false);
        window.isChange = isChange;
        return { isChange };
    },
    render() {
        const self = this;
        return self.isChange ?
            h("div", {}, nextChildren) :
            h("div", {}, prevChildren);
    },
};
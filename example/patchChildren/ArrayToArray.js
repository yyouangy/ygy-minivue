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
// const prevChildren = [
//     h("p", { key: "C" }, "C"),
//     h("p", { key: "D" }, "D"),
//     h("p", { key: "E" }, "E"),
//     h("p", { key: "A" }, "A"),
//     h("p", { key: "B" }, "B"),
// ];
// const nextChildren = [h("p", { key: "A" }, "A"), h("p", { key: "B" }, "B")];

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

//5.中间对比

//旧：A B C D F G
//新：A B E C F G
//(1)实现删除旧节点中的D,同时修改C的props
// const prevChildren = [
//     h("p", { key: "A" }, "A"),
//     h("p", { key: "B" }, "B"),
//     h("p", { key: "C", id: "C-prev" }, "C"),
//     h("p", { key: "D" }, "D"),
//     h("p", { key: "F" }, "F"),
//     h("p", { key: "G" }, "G"),
// ];
// const nextChildren = [
//     h("p", { key: "A" }, "A"),
//     h("p", { key: "B" }, "B"),
//     h("p", { key: "E" }, "E"),
//     h("p", { key: "C", id: "C-next" }, "C"),
//     h("p", { key: "F" }, "F"),
//     h("p", { key: "G" }, "G"),
// ];

//旧：A B C E D F G
//新：A B E C F G
//(2)当对比完C E之后，可以直接删除D
const prevChildren = [
    h("p", { key: "A" }, "A"),
    h("p", { key: "B" }, "B"),
    h("p", { key: "C", id: "C-prev" }, "C"),
    h("p", { key: "E" }, "E"),
    h("p", { key: "D" }, "D"),
    h("p", { key: "F" }, "F"),
    h("p", { key: "G" }, "G"),
];
const nextChildren = [
    h("p", { key: "A" }, "A"),
    h("p", { key: "B" }, "B"),
    h("p", { key: "E" }, "E"),
    h("p", { key: "C", id: "C-next" }, "C"),
    h("p", { key: "F" }, "F"),
    h("p", { key: "G" }, "G"),
];

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
import { h, ref } from "../../lib/guide-mini-vue.esm.js";
export const App = {
    setup() {
        const count = ref(0);
        const onClick = () => {
            count.value++;
        };

        const props = ref({
            foo: 'foo',
            bar: 'bar'

        })
        const onChangeProp1 = () => {
            props.value.foo = 'new-foo'
        }
        const onChangeProp2 = () => {
            props.value.foo = undefined
        }
        const onChangeProp3 = () => {
            props.value = {
                bar: 'bar'
            }
        }
        return {
            count,
            onClick,
            props,
            onChangeProp1,
            onChangeProp2,
            onChangeProp3
        };
    },
    render() {
        return h(
            "div", {
                id: "root",
                ...this.props
            }, [
                h("div", {}, "count: " + this.count), //依赖收集
                h("button", { onClick: this.onClick }, "click"),
                h("button", { onClick: this.onChangeProp1 }, "修改foo为new-foo"),
                h("button", { onClick: this.onChangeProp2 }, "修改foo为undefined"),
                h("button", { onClick: this.onChangeProp3 }, "删除foo"),
            ]
        );
    },
};
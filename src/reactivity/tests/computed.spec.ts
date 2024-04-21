import { computed } from "../computed";
import { reactive } from "../reactive";

describe("computed", () => {
  it("happy path", () => {
    //ref .value  缓存
    const value = reactive({
      foo: 1,
    });

    const getter = computed(() => {
      return value.foo;
    });

    expect(getter.value).toBe(1);
  });

  it("should compute lazily", () => {
    const value = reactive({
      foo: 1,
    });
    const getter = jest.fn(() => {
      return value.foo;
    });

    const cValue = computed(getter);
    // lazy 懒执行  如果没有访问cValue.value，那么getter不会执行
    expect(getter).not.toHaveBeenCalled();

    //访问cValue.value，getter执行1次
    expect(cValue.value).toBe(1);
    expect(getter).toHaveBeenCalledTimes(1);

    // // should not compute again  测试缓存功能
    const a = cValue.value;
    expect(getter).toHaveBeenCalledTimes(1);

    // should not compute until needed  依赖的数据发生变化，应该重新compute
    value.foo = 2;
    expect(getter).toHaveBeenCalledTimes(1);

    // now it should compute
    expect(cValue.value).toBe(2);
    expect(getter).toHaveBeenCalledTimes(2);

    // should not compute again
    cValue.value;
    expect(getter).toHaveBeenCalledTimes(2);
  });
});

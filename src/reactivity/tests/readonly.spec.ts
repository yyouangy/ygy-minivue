import { readonly, reactive, isReadonly ,isProxy} from "../reactive";

describe("readonly", () => {
  it("happy path", () => {
    const origin = { name: "ygy", hobby: { a: "piano" } };
    const observer = readonly(origin);
    //origin≠observer
    expect(origin).not.toBe(observer);
    //可读取
    expect(observer.hobby.a).toBe("piano");
    //嵌套的readonly
    expect(isReadonly(observer.hobby)).toBe(true);
    expect(isReadonly(origin.hobby)).toBe(false);
  });

  it("warn when set", () => {
    console.warn = jest.fn();
    const user = readonly({ age: 10 });
    user.age = 11;
    //set无效
    expect(user.age).toBe(10);
    //set抛出警告
    expect(console.warn).toHaveBeenCalled();
  });

  it("isReadonly", () => {
    const raw = { age: 10 };
    const user = reactive(raw);
    const _user = readonly(raw);

    expect(isReadonly(raw)).toBe(false);
    expect(isReadonly(user)).toBe(false);
    expect(isReadonly(_user)).toBe(true);
  });

  it("isProxy", () => {
    const raw = { age: 10 };
    const user = reactive(raw);
    const _user = readonly(raw);
    expect(isProxy(raw)).toBe(false);
    expect(isProxy(user)).toBe(true);
    expect(isProxy(_user)).toBe(true);
  });
});

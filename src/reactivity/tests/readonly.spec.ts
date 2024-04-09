import { readonly } from "../reactive";

describe("readonly", () => {
  it("happy path", () => {
    const origin = { name: "ygy", hobby: { a: "piano" } };
    const observer = readonly(origin);
    //origin≠observer
    expect(origin).not.toBe(observer);
    //可读取
    expect(observer.hobby.a).toBe("piano");
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
});

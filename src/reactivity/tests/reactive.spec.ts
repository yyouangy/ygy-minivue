import { reactive, isReactive } from "../reactive";

describe("reactive", () => {
  it("happy path", () => {
    const origin = { name: "ygy" };

    const observer = reactive(origin);

    expect(origin).not.toBe(observer);

    expect(observer.name).toBe("ygy");

    //isReactive
    expect(isReactive(origin)).toBe(false);
    expect(isReactive(observer)).toBe(true);
  });
});

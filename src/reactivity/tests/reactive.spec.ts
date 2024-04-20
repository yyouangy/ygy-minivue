import { reactive, isReactive } from "../reactive";

describe("reactive", () => {
  it("happy path", () => {
    const origin = { name: "ygy" };

    const observer = reactive(origin);

    expect(origin).not.toBe(observer);

    expect(observer.name).toBe("ygy");
    
    //isReactive
    expect(isReactive(observer)).toBe(true);
    expect(isReactive(origin)).toBe(false);

    

  });


  test("nested reactives", () => {
    const original = {
      nested: {
        foo: 1,
      },
      array: [{ bar: 2 }],
    };
    const observed = reactive(original);
    expect(isReactive(observed.nested)).toBe(true);
    expect(isReactive(observed.array)).toBe(true);
    expect(isReactive(observed.array[0])).toBe(true);
  });
});

import { effect, stop } from "../effect";
import { reactive } from "../reactive";

describe("effect", () => {
  it("happy path", () => {
    const user = reactive({ age: 10 });
    let nextAge;
    effect(() => {
      nextAge = user.age + 1;
    });
    expect(nextAge).toBe(11);

    //update
    user.age++;
    expect(nextAge).toBe(12);
  });

  it("should return runner when call effect", () => {
    let foo = 1;
    const runner = effect(() => {
      foo++;
      return "foo";
    });
    expect(foo).toBe(2);
    const r = runner();
    expect(foo).toBe(3);
    expect(r).toBe("foo");
  });

  it("scheduler", () => {
    //1.指定effect接受第二个参数，是一个scheduler调度器函数
    //2.当effect第一次执行时，还是会执行传入的fn
    //3.当触发响应式数据set时，调用scheduler
    //4.当正常调用runner(effect返回的函数)时，会再次执行传入的fn
    let dummy;
    let run;
    const scheduler = jest.fn(() => {
      run = runner;
    });
    const obj = reactive({ foo: 1 });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { scheduler }
    );

    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    //should be called on first trigger
    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(1);
    //should not run yet
    expect(dummy).toBe(1);
    //run
    run();
    //should have run
    expect(dummy).toBe(2);
  });

  it("stop", () => {
    let dummy;
    const obj = reactive({ prop: 1 });
    const runner = effect(() => {
      dummy = obj.prop;
    });
    obj.prop = 2;
    expect(dummy).toBe(2);
    stop(runner);
    obj.prop = 3;
    expect(dummy).toBe(2);

    // stopped effect should still be manually callable
    runner();
    expect(dummy).toBe(3);
  });
});

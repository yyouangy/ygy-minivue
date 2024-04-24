import { ReactiveEffect } from "./effect";

class ComputedRefImpl {
  private _getter;
  private _dirty = true;
  private _value;
  private _effect: any;
  //接受一个getter
  constructor(getter) {
    this._getter = getter;
    //将getter转换为一个副作用函数挂载到实例上
    this._effect = new ReactiveEffect(getter, () => {
      //传入scheduler调度器,当computed依赖的响应式数据发生变化,会触发trigger
      //trigger中会执行scheduler，将_dirty置为true,下次读取computed.value时，重新执行run
      if (!this._dirty) {
        this._dirty = true;
      }
    });
  }
  get value() {
    //首次读取computed.value,将_dirty置为false,执行run
    if (this._dirty) {
      this._dirty = false;
      this._value = this._effect.run();
    }
    //再次读取时,直接返回上一次run返回的值(缓存机制)
    return this._value;
  }
}

export function computed(getter) {
  return new ComputedRefImpl(getter);
}

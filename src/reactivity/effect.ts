class ReactiveEffect {
  private _fn;
  constructor(fn) {
    this._fn = fn;
  }
  run() {
    this._fn();
  }
}

export function effect(fn) {
  const _effect = new ReactiveEffect(fn);
  //执行fn
  _effect.run(fn);
}
export function track(target, key) {}
export function trigger(target, key) {}

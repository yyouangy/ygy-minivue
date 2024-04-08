class ReactiveEffect {
  private _fn;
  deps = [];
  constructor(fn, public scheduler?) {
    this._fn = fn;
  }
  run() {
    activeEffect = this;
    return this._fn();
  }

  stop() {
    cleanUp(this);
  }
}

function cleanUp(effect) {
  effect.deps.forEach((dep) => dep.delete(effect));
}
export function effect(fn, options = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler);

  //执行fn
  _effect.run();

  const runner = _effect.run.bind(_effect);

  //将_effect实例挂载到runner上，为了在stop函数中调用实例的stop方法
  runner._effect = _effect;

  return runner;
}

const bucket = new WeakMap();
let activeEffect;
export function track(target, key) {
  let depMap = bucket.get(target);
  if (!depMap) {
    bucket.set(target, (depMap = new Map()));
  }
  let dep = depMap.get(key);
  if (!dep) {
    depMap.set(key, (dep = new Set()));
  }
  if (activeEffect) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
  }
}
export function trigger(target, key) {
  const depMap = bucket.get(target);
  const dep = depMap.get(key);
  for (const effect of dep) {
    //判断effect是否有scheduler，如果有，执行scheduler，如果没有，照常执行run
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}

export function stop(runner) {
  runner._effect.stop();
}

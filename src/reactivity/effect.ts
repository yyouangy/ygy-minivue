import { mount } from "../shared";

class ReactiveEffect {
  private _fn;
  deps = [];
  active = true;
  scheduler: Function | undefined;
  onStop?: () => void;
  constructor(fn, scheduler?: Function) {
    this._fn = fn;
    this.scheduler = scheduler;
  }
  run() {
    activeEffect = this;
    return this._fn();
  }

  stop() {
    if (this.active) {
      cleanUp(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}

function cleanUp(effect) {
  effect.deps.forEach((dep) => dep.delete(effect));
}
export function effect(fn, options = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler);

  //挂载options
  mount(_effect, options);
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
  //weakMap->Map->Set
  //1.先基于weakMap({target:depMap})的 键target 找到对应的 值depMap
  let depMap = bucket.get(target);
  //2.没有depMap时，初始化depMap
  if (!depMap) {
    bucket.set(target, (depMap = new Map()));
  }
  //3.基于depMap({key:dep})的 键key 找到对应的 值dep
  let dep = depMap.get(key);
  //4.没有dep时，初始化dep
  if (!dep) {
    depMap.set(key, (dep = new Set()));
  }
  
  if (!activeEffect) return;
  //5.将当前副作用函数activeEffect添加到dep中
  dep.add(activeEffect);
  //6.将dep挂载到activeEffect的deps属性上，
  activeEffect.deps.push(dep);
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

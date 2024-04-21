import { extend } from "../shared";

const bucket = new WeakMap();
let activeEffect;
let shouldTrack = false;

export class ReactiveEffect {
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
    //如果调用了stop方法，直接返回_fn的调用结果
    if (!this.active) {
      return this._fn();
    }

    //
    shouldTrack = true;
    activeEffect = this;
    const res = this._fn();
    //重置
    shouldTrack = false;
    return res;
  }

  stop() {
    //stop之后，activeEffect.deps清空了，之后当触发trigger时，不会再去调用run，实现了停止响应式的功能
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
  effect.deps.length = 0;
}
export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler);

  //合并用户传入的options到_effect实例上
  extend(_effect, options);
  //执行fn
  _effect.run();

  const runner = _effect.run.bind(_effect);

  //将_effect实例挂载到runner上，为了在stop函数中调用实例的stop方法
  runner._effect = _effect;

  return runner;
}

export function track(target, key) {
  if (!isTracking()) return;
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
  trackEffects(dep);
}
export function trackEffects(dep) {
  if (dep.has(activeEffect)) return;
  //5.将当前副作用函数activeEffect添加到dep中
  dep.add(activeEffect);
  //6.将dep挂载到activeEffect的deps属性上
  activeEffect.deps.push(dep);
}
export function trigger(target, key) {
  const depMap = bucket.get(target);
  const dep = depMap.get(key);
  triggerEffects(dep);
}

export function triggerEffects(dep) {
  for (const effect of dep) {
    //判断effect是否有scheduler，如果有，执行scheduler，如果没有，照常执行run
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}

export function isTracking() {
  return shouldTrack && activeEffect !== undefined;
}

export function stop(runner) {
  runner._effect.stop();
}

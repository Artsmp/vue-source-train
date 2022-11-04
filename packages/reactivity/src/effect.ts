import { extend } from '@vue/shared';

type Dep = Set<ReactiveEffect>;
type KeyToDepMap = Map<any, Dep>;
const targetMap = new WeakMap<any, KeyToDepMap>();
export type EffectSchedular = (...args: any[]) => any;
export interface ReactiveEffectOptions {
  lazy?: boolean;
  schedular?: EffectSchedular;
  onStop?: () => void;
}

export interface ReactiveEffectRunner<T = any> {
  (): T;
  effect: ReactiveEffect;
}

export let activeEffect: ReactiveEffect | undefined;
export let shouldTrack = false;

export class ReactiveEffect<T = any> {
  deps: Dep[] = [];
  active = true;
  onStop?: () => void;
  constructor(
    public fn: () => T,
    public schedular: EffectSchedular | null = null
  ) {}

  run() {
    if (!this.active) {
      return this.fn();
    }
    shouldTrack = true;
    activeEffect = this;
    const res = this.fn();
    shouldTrack = false;
    return res;
  }

  stop() {
    if (this.active) {
      cleanup(this);
      this.active = false;
      if (this.onStop) {
        this.onStop();
      }
    }
  }
}

function cleanup(effect: ReactiveEffect) {
  const { deps } = effect;
  if (!deps.length) return;
  for (let i = 0; i < deps.length; i++) {
    deps[i].delete(effect);
  }
  deps.length = 0;
}

export function effect<T = any>(fn: () => T, options?: ReactiveEffectOptions) {
  const _effect = new ReactiveEffect(fn);
  if (options) {
    extend(_effect, options);
  }
  if (!options || !options.lazy) {
    _effect.run();
  }
  const runner = _effect.run.bind(_effect) as ReactiveEffectRunner;
  runner.effect = _effect;
  return runner;
}

export function stop(runner: ReactiveEffectRunner) {
  runner.effect.stop();
}

export function isTracking() {
  return activeEffect && shouldTrack;
}

export function track(target, key) {
  if (!isTracking()) return;
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  trackEffect(dep);
}

export function trackEffect(dep: Dep) {
  dep.add(activeEffect);
  activeEffect.deps.push(dep);
}

export function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  const deps = depsMap.get(key);
  if (!deps) return;
  triggerEffects(deps);
}

export function triggerEffects(deps) {
  deps.forEach((effect) => {
    if (effect.schedular) {
      effect.schedular();
    } else {
      effect.run();
    }
  });
}

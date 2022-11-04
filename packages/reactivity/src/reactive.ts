import { isObject } from '@vue/shared';
import { ReactiveEffect, track, trigger } from './effect';

export function reactive(target) {
  return new Proxy(target, {
    get(target, p, receiver) {
      track(target, p);
      const res = Reflect.get(target, p, receiver);
      if (isObject(res)) {
        return reactive(res);
      }
      return res;
    },
    set(target, p, newValue, receiver) {
      const res = Reflect.set(target, p, newValue, receiver);
      trigger(target, p);
      return res;
    },
  });
}

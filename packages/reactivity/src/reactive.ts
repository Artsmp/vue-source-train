export function reactive(raw) {
  return new Proxy(raw, {
    get(target, p, receiver) {
      return Reflect.get(target, p, receiver);
    },
    set(target, p, newValue, receiver) {
      return Reflect.set(target, p, newValue, receiver);
    },
  });
}

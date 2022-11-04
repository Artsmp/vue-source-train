import { reactive } from '../src/reactive';

describe('reactivity/reactive', () => {
  test('Object', () => {
    const original = { foo: 1 };
    const observed = reactive(original);
    // expect(original).not.toBe(observed);
    expect(observed.foo).toBe(1);
  });
});

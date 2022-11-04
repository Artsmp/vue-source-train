import { reactive } from '../src/reactive';

describe('reactive', () => {
  it('happy path', () => {
    const foo = { bar: 1 };
    const obj = reactive(foo);
    expect(obj.bar).toBe(foo.bar);
  });
});

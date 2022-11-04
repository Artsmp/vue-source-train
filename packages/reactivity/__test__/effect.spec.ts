import { reactive } from '../src/reactive';
import { effect, stop } from '../src/effect';

describe('reactivity/effect', () => {
  it('should run the passed function once (wrapped by a effect)', () => {
    const fnSpy = jest.fn(() => {});
    effect(fnSpy);
    expect(fnSpy).toHaveBeenCalledTimes(1);
  });

  it('should observe basic properties', () => {
    let dummy;
    const counter = reactive({ num: 0 });
    effect(() => (dummy = counter.num));

    expect(dummy).toBe(0);
    counter.num = 7;
    expect(dummy).toBe(7);
  });

  it('should observe multiple properties', () => {
    let dummy;
    const counter = reactive({ num1: 0, num2: 0 });
    effect(() => (dummy = counter.num1 + counter.num1 + counter.num2));

    expect(dummy).toBe(0);
    counter.num1 = counter.num2 = 7;
    expect(dummy).toBe(21);
  });

  it('should handle multiple effects', () => {
    let dummy1, dummy2;
    const counter = reactive({ num: 0 });
    effect(() => (dummy1 = counter.num));
    effect(() => (dummy2 = counter.num));

    expect(dummy1).toBe(0);
    expect(dummy2).toBe(0);
    counter.num++;
    expect(dummy1).toBe(1);
    expect(dummy2).toBe(1);
  });

  it('should observe nested properties', () => {
    let dummy;
    const counter = reactive({ nested: { num: 0 } });
    effect(() => (dummy = counter.nested.num));

    expect(dummy).toBe(0);
    counter.nested.num = 8;
    expect(dummy).toBe(8);
  });

  it('should return runner when call effect', () => {
    let foo = 10;
    const runner = effect(() => {
      foo++;
      return 'foo';
    });
    expect(foo).toBe(11);
    const r = runner();
    expect(foo).toBe(12);
    expect(r).toBe('foo');
  });

  it('schedular', () => {
    let dummy: any;
    let run: any;
    const schedular = jest.fn(() => {
      run = runner;
    });
    const obj = reactive({ foo: 1 });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { schedular }
    );
    // 期望 schedular 未被调用
    expect(schedular).not.toHaveBeenCalled();
    obj.foo++;
    // 期望它被调用1次
    expect(schedular).toHaveBeenCalledTimes(1);
    // 期望effect副作用函数还没被调用
    expect(dummy).toBe(1);
    run();
    // 期望run调用后dummy值更新
    expect(dummy).toBe(2);
  });

  it('stop', () => {
    let dummy: any;
    const obj = reactive({ foo: 1 });
    const runner = effect(() => {
      dummy = obj.foo;
    });
    obj.foo = 2;
    expect(dummy).toBe(2);
    stop(runner);
    obj.foo = 3;
    expect(dummy).toBe(2);

    runner();
    expect(dummy).toBe(3);
  });

  it('stop', () => {
    let dummy: any;
    const obj = reactive({ foo: 1 });
    const onStop = jest.fn(() => {
      console.log('ddddd');
    });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { onStop }
    );
    expect(onStop).not.toHaveBeenCalled();
    stop(runner);
    expect(onStop).toHaveBeenCalledTimes(1);
  });
});

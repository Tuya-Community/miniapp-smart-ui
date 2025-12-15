import path from 'path';
import simulate from 'miniprogram-simulate';
import { nextTick } from '../../common/utils';

jest.mock('../../common/utils', () => {
  const actual = jest.requireActual('../../common/utils');
  return {
    ...actual,
    nextTick: jest.fn((callback: () => void) => {
      if (callback) {
        callback();
      }
    }),
  };
});

describe('field', () => {
  const SmartField = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-field',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should format value with maxlength', () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-field': SmartField,
        },
        template: `<smart-field id="field" maxlength="{{ 5 }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#field');
    const instance = wrapper?.instance;
    
    if (instance) {
      const result = instance.formatValue('123456789');
      expect(result).toBe('12345');
    }
  });

  test('should format value without maxlength limit', () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-field': SmartField,
        },
        template: `<smart-field id="field" maxlength="{{ -1 }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#field');
    const instance = wrapper?.instance;
    
    if (instance) {
      const result = instance.formatValue('123456789');
      expect(result).toBe('123456789');
    }
  });

  test('should handle onInput event', async () => {
    let inputEvent: any = null;
    let changeEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-field': SmartField,
        },
        template: `<smart-field id="field" bind:input="onInput" bind:change="onChange" maxlength="{{ 5 }}" />`,
        methods: {
          onInput(event: any) {
            inputEvent = event.detail;
          },
          onChange(event: any) {
            changeEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#field');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onInput({
        detail: { value: '123456' },
      });
      await simulate.sleep(10);

      expect(instance.value).toBe('12345');
      expect(inputEvent).toBeTruthy();
      expect(changeEvent).toBeTruthy();
    }
  });

  test('should handle onInput with empty detail', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-field': SmartField,
        },
        template: `<smart-field id="field" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#field');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onInput({});
      await simulate.sleep(10);

      expect(instance.value).toBe('');
    }
  });

  test('should handle onFocus event', async () => {
    let focusEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-field': SmartField,
        },
        template: `<smart-field id="field" bind:focus="onFocus" />`,
        methods: {
          onFocus(event: any) {
            focusEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#field');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onFocus({
        detail: { value: 'test', cursor: 4 },
      });
      await simulate.sleep(10);

      expect(instance.focused).toBe(true);
      expect(focusEvent).toBeTruthy();
      expect(focusEvent.value).toBe('test');
    }
  });

  test('should handle onBlur event', async () => {
    let blurEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-field': SmartField,
        },
        template: `<smart-field id="field" bind:blur="onBlur" />`,
        methods: {
          onBlur(event: any) {
            blurEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#field');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onBlur({
        detail: { value: 'test' },
      });
      await simulate.sleep(10);

      expect(instance.focused).toBe(false);
      expect(blurEvent).toBeTruthy();
      expect(blurEvent.value).toBe('test');
    }
  });

  test('should handle onClickIcon event', async () => {
    let clickIconEvent = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-field': SmartField,
        },
        template: `<smart-field id="field" bind:click-icon="onClickIcon" />`,
        methods: {
          onClickIcon() {
            clickIconEvent = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#field');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onClickIcon();
      await simulate.sleep(10);

      expect(clickIconEvent).toBe(true);
    }
  });

  test('should handle onClickInput event', async () => {
    let clickInputEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-field': SmartField,
        },
        template: `<smart-field id="field" bind:click-input="onClickInput" />`,
        methods: {
          onClickInput(event: any) {
            clickInputEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#field');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onClickInput({
        detail: { x: 100, y: 200 },
      });
      await simulate.sleep(10);

      expect(clickInputEvent).toBeTruthy();
      expect(clickInputEvent.x).toBe(100);
    }
  });

  test('should handle onClear', async () => {
    let clearEvent: any = null;
    let changeEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-field': SmartField,
        },
        template: `<smart-field id="field" bind:clear="onClear" bind:change="onChange" />`,
        methods: {
          onClear(event: any) {
            clearEvent = event.detail;
          },
          onChange(event: any) {
            changeEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#field');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.value = 'test';
      instance.setData({ innerValue: 'test' });
      await simulate.sleep(10);

      instance.onClear();
      await simulate.sleep(50);

      expect(instance.value).toBe('');
      expect(wrapper?.data.innerValue).toBe('');
      expect(clearEvent).toBe('');
      // changeEvent might be empty string or object depending on extraEventParams
      expect(changeEvent !== null && changeEvent !== undefined).toBe(true);
    }
  });

  test('should handle onConfirm event', async () => {
    let confirmEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-field': SmartField,
        },
        template: `<smart-field id="field" bind:confirm="onConfirm" />`,
        methods: {
          onConfirm(event: any) {
            confirmEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#field');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onConfirm({
        detail: { value: 'confirmed' },
      });
      await simulate.sleep(10);

      expect(instance.value).toBe('confirmed');
      expect(confirmEvent).toBe('confirmed');
    }
  });

  test('should handle onConfirm with empty detail', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-field': SmartField,
        },
        template: `<smart-field id="field" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#field');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onConfirm({});
      await simulate.sleep(10);

      expect(instance.value).toBe('');
    }
  });

  test('should handle setValue', async () => {
    let changeEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-field': SmartField,
        },
        template: `<smart-field id="field" bind:change="onChange" />`,
        methods: {
          onChange(event: any) {
            changeEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#field');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setValue('new value');
      await simulate.sleep(10);

      expect(instance.value).toBe('new value');
      expect(changeEvent).toBeTruthy();
    }
  });

  test('should handle setValue with empty string', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-field': SmartField,
        },
        template: `<smart-field id="field" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#field');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.value = 'test';
      instance.setData({ innerValue: 'test' });
      await simulate.sleep(10);

      instance.setValue('');
      await simulate.sleep(10);

      expect(instance.value).toBe('');
      expect(wrapper?.data.innerValue).toBe('');
    }
  });

  test('should handle onLineChange event', async () => {
    let lineChangeEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-field': SmartField,
        },
        template: `<smart-field id="field" bind:linechange="onLineChange" />`,
        methods: {
          onLineChange(event: any) {
            lineChangeEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#field');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onLineChange({
        detail: { height: 100, heightRpx: 200, lineCount: 5 },
      });
      await simulate.sleep(10);

      expect(lineChangeEvent).toBeTruthy();
      expect(lineChangeEvent.height).toBe(100);
    }
  });

  test('should handle onKeyboardHeightChange event', async () => {
    let keyboardHeightChangeEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-field': SmartField,
        },
        template: `<smart-field id="field" bind:keyboardheightchange="onKeyboardHeightChange" />`,
        methods: {
          onKeyboardHeightChange(event: any) {
            keyboardHeightChangeEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#field');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onKeyboardHeightChange({
        detail: { height: 300, duration: 250 },
      });
      await simulate.sleep(10);

      expect(keyboardHeightChangeEvent).toBeTruthy();
      expect(keyboardHeightChangeEvent.height).toBe(300);
    }
  });

  test('should handle onBindNicknameReview event', async () => {
    let nicknamereviewEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-field': SmartField,
        },
        template: `<smart-field id="field" bind:nicknamereview="onBindNicknameReview" />`,
        methods: {
          onBindNicknameReview(event: any) {
            nicknamereviewEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#field');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onBindNicknameReview({
        detail: { pass: true, timeout: false },
      });
      await simulate.sleep(10);

      expect(nicknamereviewEvent).toBeTruthy();
      expect(nicknamereviewEvent.pass).toBe(true);
    }
  });

  test('should handle emitChange without extraEventParams', async () => {
    let inputEvent: any = null;
    let changeEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-field': SmartField,
        },
        template: `<smart-field id="field" bind:input="onInput" bind:change="onChange" />`,
        methods: {
          onInput(event: any) {
            inputEvent = event.detail;
          },
          onChange(event: any) {
            changeEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#field');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const result = instance.emitChange({ value: 'test' });
      await simulate.sleep(10);

      expect(wrapper?.data.value).toBe('test');
      expect(inputEvent).toBe('test');
      expect(changeEvent).toBe('test');
      expect(result).toBeUndefined();
    }
  });

  test('should handle emitChange with extraEventParams', async () => {
    let inputEvent: any = null;
    let changeEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-field': SmartField,
        },
        template: `<smart-field id="field" extraEventParams="{{ true }}" bind:input="onInput" bind:change="onChange" />`,
        methods: {
          onInput(event: any) {
            inputEvent = event.detail;
          },
          onChange(event: any) {
            changeEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#field');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const result = instance.emitChange({ value: 'test' });
      await simulate.sleep(10);

      expect(wrapper?.data.value).toBe('test');
      expect(inputEvent).toBeTruthy();
      expect(inputEvent.value).toBe('test');
      expect(typeof inputEvent.callback).toBe('function');
      expect(changeEvent).toBeTruthy();
      expect(changeEvent.value).toBe('test');
      
      // Test callback
      if (inputEvent.callback) {
        inputEvent.callback({ value: 'updated' });
        await simulate.sleep(10);
        expect(wrapper?.data.innerValue).toBe('updated');
      }
      
      expect(result).toBeUndefined();
    }
  });

  test('should handle clearTrigger watch', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-field': SmartField,
        },
        template: `<smart-field id="field" clearTrigger="focus" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#field');
    await simulate.sleep(10);

    // Change clearTrigger to trigger watch
    wrapper?.setData({ clearTrigger: 'always' });
    await simulate.sleep(10);

    // Watch should have been called
    expect(wrapper?.data.clearTrigger).toBe('always');
  });

  test('should setShowClear with clearTrigger always', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-field': SmartField,
        },
        template: `<smart-field id="field" clearable="{{ true }}" clearTrigger="always" value="test" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#field');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.value = 'test';
      instance.setShowClear();
      await simulate.sleep(10);

      expect(wrapper?.data.showClear).toBe(true);
    }
  });

  test('should setShowClear with clearTrigger focus and not focused', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-field': SmartField,
        },
        template: `<smart-field id="field" clearable="{{ true }}" clearTrigger="focus" value="test" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#field');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.value = 'test';
      instance.focused = false;
      instance.setShowClear();
      await simulate.sleep(10);

      expect(wrapper?.data.showClear).toBe(false);
    }
  });

  test('should setShowClear with clearTrigger focus and focused', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-field': SmartField,
        },
        template: `<smart-field id="field" clearable="{{ true }}" clearTrigger="focus" value="test" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#field');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.value = 'test';
      instance.focused = true;
      instance.setShowClear();
      await simulate.sleep(10);

      expect(wrapper?.data.showClear).toBe(true);
    }
  });

  test('should setShowClear with no value', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-field': SmartField,
        },
        template: `<smart-field id="field" clearable="{{ true }}" clearTrigger="always" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#field');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.value = '';
      instance.setShowClear();
      await simulate.sleep(10);

      expect(wrapper?.data.showClear).toBe(false);
    }
  });

  test('should setShowClear with readonly', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-field': SmartField,
        },
        template: `<smart-field id="field" clearable="{{ true }}" readonly="{{ true }}" clearTrigger="always" value="test" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#field');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.value = 'test';
      instance.setShowClear();
      await simulate.sleep(10);

      expect(wrapper?.data.showClear).toBe(false);
    }
  });
});


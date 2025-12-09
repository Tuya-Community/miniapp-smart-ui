import path from 'path';
import simulate from 'miniprogram-simulate';
import ty from '../../common/ty';

// Mock ty module
jest.mock('../../common/ty', () => ({
  __esModule: true,
  default: {
    vibrateShort: jest.fn(),
    selectionVibrate: jest.fn(),
    nativeDisabled: jest.fn(),
    getThemeInfo: jest.fn(),
    isWX: jest.fn(() => false),
  },
}));

describe('stepper', () => {
  const SmartStepper = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-stepper',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render with default props', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-stepper': SmartStepper,
        },
        template: `<smart-stepper id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.currentValue).toBeDefined();
  });

  test('should format value on created', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-stepper': SmartStepper,
        },
        template: `<smart-stepper id="wrapper" value="{{ 5.5 }}" />`,
        data: {
          value: 5.5,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    // currentValue might be number or string depending on format
    expect(wrapper?.data.currentValue).toBeDefined();
    expect(String(wrapper?.data.currentValue)).toBe('5.5');
  });

  test('should observe value change', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-stepper': SmartStepper,
        },
        template: `<smart-stepper id="wrapper" value="{{ value }}" />`,
        data: {
          value: 1,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ isInit: true, focus: false });
      instance.setData({ value: 10 });
      await simulate.sleep(10);

      // currentValue might be number or string
      expect(String(wrapper?.data.currentValue)).toBe('10');
    }
  });

  test('should not observe value when focus is true', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-stepper': SmartStepper,
        },
        template: `<smart-stepper id="wrapper" value="{{ value }}" />`,
        data: {
          value: 1,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ isInit: true, focus: true, currentValue: '5' });
      instance.setData({ value: 10 });
      await simulate.sleep(10);

      expect(wrapper?.data.currentValue).toBe('5');
    }
  });

  test('should format value when observeValue is called', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-stepper': SmartStepper,
        },
        template: `<smart-stepper id="wrapper" value="{{ value }}" min="5" max="10" />`,
        data: {
          value: 1,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ isInit: true, focus: false, currentValue: '1', min: 5, max: 10 });
      instance.setData({ value: 15 });
      await simulate.sleep(10);

      expect(String(wrapper?.data.currentValue)).toBe('10');
    }
  });

  test('should check and format value when integer prop changes', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-stepper': SmartStepper,
        },
        template: `<smart-stepper id="wrapper" value="{{ 5.5 }}" integer="{{ integer }}" />`,
        data: {
          integer: false,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ currentValue: '5.5', integer: false });
      instance.setData({ integer: true });
      await simulate.sleep(10);

      expect(String(wrapper?.data.currentValue)).toBe('5');
    }
  });

  test('should check and format value when decimalLength prop changes', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-stepper': SmartStepper,
        },
        template: `<smart-stepper id="wrapper" value="{{ 5.5 }}" decimal-length="{{ decimalLength }}" />`,
        data: {
          decimalLength: null,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ currentValue: '5.5' });
      instance.setData({ decimalLength: 2 });
      await simulate.sleep(10);

      expect(wrapper?.data.currentValue).toBe('5.50');
    }
  });

  test('should check and format value when min prop changes', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-stepper': SmartStepper,
        },
        template: `<smart-stepper id="wrapper" value="{{ 1 }}" min="{{ min }}" />`,
        data: {
          min: 1,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ currentValue: '1', min: 1 });
      instance.setData({ min: 5 });
      await simulate.sleep(10);

      expect(String(wrapper?.data.currentValue)).toBe('5');
    }
  });

  test('should check and format value when max prop changes', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-stepper': SmartStepper,
        },
        template: `<smart-stepper id="wrapper" value="{{ 10 }}" max="{{ max }}" />`,
        data: {
          max: 10,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ currentValue: '10', max: 10 });
      instance.setData({ max: 5 });
      await simulate.sleep(10);

      expect(String(wrapper?.data.currentValue)).toBe('5');
    }
  });

  test('should check if plus button is disabled', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-stepper': SmartStepper,
        },
        template: `<smart-stepper id="wrapper" value="{{ 10 }}" max="10" />`,
        data: {
          value: 10,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ currentValue: '10', max: 10 });
      const isDisabled = instance.isDisabled('plus');
      expect(isDisabled).toBe(true);
    }
  });

  test('should check if minus button is disabled', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-stepper': SmartStepper,
        },
        template: `<smart-stepper id="wrapper" value="{{ 1 }}" min="1" />`,
        data: {
          value: 1,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ currentValue: '1', min: 1 });
      const isDisabled = instance.isDisabled('minus');
      expect(isDisabled).toBe(true);
    }
  });

  test('should check if plus button is disabled when disablePlus is true', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-stepper': SmartStepper,
        },
        template: `<smart-stepper id="wrapper" value="{{ 5 }}" disable-plus="{{ true }}" />`,
        data: {
          value: 5,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ disablePlus: true, currentValue: '5' });
      const isDisabled = instance.isDisabled('plus');
      expect(isDisabled).toBe(true);
    }
  });

  test('should check if minus button is disabled when disableMinus is true', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-stepper': SmartStepper,
        },
        template: `<smart-stepper id="wrapper" value="{{ 5 }}" disable-minus="{{ true }}" />`,
        data: {
          value: 5,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ disableMinus: true, currentValue: '5' });
      const isDisabled = instance.isDisabled('minus');
      expect(isDisabled).toBe(true);
    }
  });

  test('should check if button is disabled when disabled is true', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-stepper': SmartStepper,
        },
        template: `<smart-stepper id="wrapper" value="{{ 5 }}" disabled="{{ true }}" />`,
        data: {
          value: 5,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ disabled: true, currentValue: '5' });
      const isDisabledPlus = instance.isDisabled('plus');
      const isDisabledMinus = instance.isDisabled('minus');
      expect(isDisabledPlus).toBe(true);
      expect(isDisabledMinus).toBe(true);
    }
  });

  test('should emit focus event', async () => {
    let focusEmitted = false;
    let focusDetail: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-stepper': SmartStepper,
        },
        template: `<smart-stepper id="wrapper" bind:focus="onFocus" />`,
        methods: {
          onFocus(event: any) {
            focusEmitted = true;
            focusDetail = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const mockEvent = {
        detail: { value: '5' },
      } as any;
      instance.onFocus(mockEvent);
      await simulate.sleep(10);

      expect(focusEmitted).toBe(true);
      expect(wrapper?.data.focus).toBe(true);
    }
  });

  test('should format value on blur', async () => {
    let blurEmitted = false;
    let blurDetail: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-stepper': SmartStepper,
        },
        template: `<smart-stepper id="wrapper" value="{{ 5 }}" min="1" max="10" step="2" bind:blur="onBlur" />`,
        data: {
          value: 5,
        },
        methods: {
          onBlur(event: any) {
            blurEmitted = true;
            blurDetail = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ min: 1, max: 10, step: 2 });
      const mockEvent = {
        detail: { value: '6.5' },
      } as any;
      instance.onBlur(mockEvent);
      await simulate.sleep(10);

      expect(wrapper?.data.focus).toBe(false);
      expect(blurEmitted).toBe(true);
    }
  });

  test('should format value with decimalLength on blur', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-stepper': SmartStepper,
        },
        template: `<smart-stepper id="wrapper" value="{{ 5 }}" decimal-length="{{ 2 }}" step="0.5" />`,
        data: {
          value: 5,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ decimalLength: 2, min: 0, max: 10, step: 0.5 });
      const mockEvent = {
        detail: { value: '5.5' },
      } as any;
      instance.onBlur(mockEvent);
      await simulate.sleep(10);

      // The value should be formatted with 2 decimal places
      const currentValue = wrapper?.data.currentValue;
      expect(String(currentValue)).toBe('5.50');
    }
  });

  test('should format integer value', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-stepper': SmartStepper,
        },
        template: `<smart-stepper id="wrapper" value="{{ 5 }}" integer="{{ true }}" />`,
        data: {
          value: 5,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ integer: true });
      const formatted = instance.format('5.5', false);
      expect(formatted).toBe('5');
    }
  });

  test('should format value with multiple dots', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-stepper': SmartStepper,
        },
        template: `<smart-stepper id="wrapper" value="{{ 5 }}" />`,
        data: {
          value: 5,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const formatted = instance.format('5.5.5', false);
      expect(formatted).toBe('5.55');
    }
  });

  test('should format value with range limits', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-stepper': SmartStepper,
        },
        template: `<smart-stepper id="wrapper" value="{{ 5 }}" min="1" max="10" />`,
        data: {
          value: 5,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ min: 1, max: 10 });
      const formatted = instance.format('15', true);
      expect(String(formatted)).toBe('10');
      
      const formatted2 = instance.format('0', true);
      expect(String(formatted2)).toBe('1');
    }
  });

  test('should format empty value to 0', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-stepper': SmartStepper,
        },
        template: `<smart-stepper id="wrapper" value="{{ 5 }}" />`,
        data: {
          value: 5,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ min: 0, max: 100 });
      const formatted = instance.format('', true);
      expect(String(formatted)).toBe('0');
    }
  });

  test('should format value with decimalLength', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-stepper': SmartStepper,
        },
        template: `<smart-stepper id="wrapper" value="{{ 5 }}" decimal-length="{{ 2 }}" />`,
        data: {
          value: 5,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ decimalLength: 2 });
      const formatted = instance.format('5.5', true);
      expect(formatted).toBe('5.50');
    }
  });

  test('should handle input event', async () => {
    let changeEmitted = false;
    let changeValue: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-stepper': SmartStepper,
        },
        template: `<smart-stepper id="wrapper" bind:change="onChange" />`,
        methods: {
          onChange(event: any) {
            changeEmitted = true;
            changeValue = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const mockEvent = {
        detail: { value: '5.5' },
      } as any;
      instance.onInput(mockEvent);
      await simulate.sleep(10);

      expect(changeEmitted).toBe(true);
      expect(changeValue).toBe('5.5');
    }
  });

  test('should not emit change when input is empty', async () => {
    let changeCount = 0;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-stepper': SmartStepper,
        },
        template: `<smart-stepper id="wrapper" value="{{ 5 }}" bind:change="onChange" />`,
        data: {
          value: 5,
        },
        methods: {
          onChange() {
            changeCount++;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Wait for initial change event from created
      await simulate.sleep(10);
      const initialChangeCount = changeCount;
      const originalCurrentValue = wrapper?.data.currentValue;
      
      // Mock emitChange to track if it's called
      const emitChangeSpy = jest.spyOn(instance, 'emitChange');
      const mockEvent = {
        detail: { value: '' },
      } as any;
      instance.onInput(mockEvent);
      await simulate.sleep(10);

      // onInput should return early when value is empty, so emitChange should not be called
      expect(emitChangeSpy).not.toHaveBeenCalled();
      expect(changeCount).toBe(initialChangeCount);
      expect(wrapper?.data.currentValue).toBe(originalCurrentValue);
    }
  });

  test('should emit change with asyncChange', async () => {
    let changeEmitted = false;
    let changeValue: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-stepper': SmartStepper,
        },
        template: `<smart-stepper id="wrapper" async-change bind:change="onChange" />`,
        methods: {
          onChange(event: any) {
            changeEmitted = true;
            changeValue = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ asyncChange: true, currentValue: '5' });
      instance.emitChange('10');
      await simulate.sleep(10);

      expect(changeEmitted).toBe(true);
      expect(changeValue).toBe('10');
      expect(wrapper?.data.currentValue).toBe('5');
    }
  });

  test('should emit change without asyncChange', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-stepper': SmartStepper,
        },
        template: `<smart-stepper id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ asyncChange: false, currentValue: '5' });
      instance.emitChange('10');
      await simulate.sleep(10);

      expect(wrapper?.data.currentValue).toBe('10');
    }
  });

  test('should handle plus button click', async () => {
    let changeEmitted = false;
    let plusEmitted = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-stepper': SmartStepper,
        },
        template: `<smart-stepper id="wrapper" value="{{ 5 }}" step="2" bind:change="onChange" bind:plus="onPlus" />`,
        data: {
          value: 5,
        },
        methods: {
          onChange() {
            changeEmitted = true;
          },
          onPlus() {
            plusEmitted = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ currentValue: '5', step: 2, min: 1, max: 10 });
      instance.type = 'plus';
      instance.onChange();
      await simulate.sleep(10);

      expect(changeEmitted).toBe(true);
      expect(plusEmitted).toBe(true);
      expect(ty.vibrateShort).toHaveBeenCalledWith({ type: 'light' });
    }
  });

  test('should handle minus button click', async () => {
    let changeEmitted = false;
    let minusEmitted = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-stepper': SmartStepper,
        },
        template: `<smart-stepper id="wrapper" value="{{ 5 }}" step="2" bind:change="onChange" bind:minus="onMinus" />`,
        data: {
          value: 5,
        },
        methods: {
          onChange() {
            changeEmitted = true;
          },
          onMinus() {
            minusEmitted = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ currentValue: '5', step: 2, min: 1, max: 10 });
      instance.type = 'minus';
      instance.onChange();
      await simulate.sleep(10);

      expect(changeEmitted).toBe(true);
      expect(minusEmitted).toBe(true);
      expect(ty.vibrateShort).toHaveBeenCalledWith({ type: 'light' });
    }
  });

  test('should emit overlimit when plus button is disabled', async () => {
    let overlimitEmitted = false;
    let overlimitType: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-stepper': SmartStepper,
        },
        template: `<smart-stepper id="wrapper" value="{{ 10 }}" max="10" bind:overlimit="onOverlimit" />`,
        data: {
          value: 10,
        },
        methods: {
          onOverlimit(event: any) {
            overlimitEmitted = true;
            overlimitType = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ currentValue: '10', max: 10, min: 1, step: 1 });
      instance.type = 'plus';
      instance.onChange();
      await simulate.sleep(10);

      expect(overlimitEmitted).toBe(true);
      expect(overlimitType).toBe('plus');
    }
  });

  test('should emit overlimit when minus button is disabled', async () => {
    let overlimitEmitted = false;
    let overlimitType: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-stepper': SmartStepper,
        },
        template: `<smart-stepper id="wrapper" value="{{ 1 }}" min="1" bind:overlimit="onOverlimit" />`,
        data: {
          value: 1,
        },
        methods: {
          onOverlimit(event: any) {
            overlimitEmitted = true;
            overlimitType = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ currentValue: '1', min: 1, max: 10, step: 1 });
      instance.type = 'minus';
      instance.onChange();
      await simulate.sleep(10);

      expect(overlimitEmitted).toBe(true);
      expect(overlimitType).toBe('minus');
    }
  });

  test('should handle tap event', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-stepper': SmartStepper,
        },
        template: `<smart-stepper id="wrapper" value="{{ 5 }}" />`,
        data: {
          value: 5,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ currentValue: '5', step: 1, min: 1, max: 10 });
      const mockEvent = {
        currentTarget: {
          dataset: { type: 'plus' },
        },
      } as any;
      instance.onTap(mockEvent);
      await simulate.sleep(10);

      expect(instance.type).toBe('plus');
    }
  });

  test('should handle touchstart event with longPress enabled', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-stepper': SmartStepper,
        },
        template: `<smart-stepper id="wrapper" value="{{ 5 }}" long-press="{{ true }}" />`,
        data: {
          value: 5,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ longPress: true, currentValue: '5', step: 1, min: 1, max: 10 });
      const mockEvent = {
        currentTarget: {
          dataset: { type: 'plus' },
        },
      } as any;
      instance.onTouchStart(mockEvent);
      await simulate.sleep(10);

      expect(instance.type).toBe('plus');
      expect(instance.isLongPress).toBe(false);
      
      // Clean up: clear the timer to prevent issues
      if (instance.longPressTimer) {
        clearTimeout(instance.longPressTimer);
        instance.longPressTimer = undefined;
      }
    }
  });

  test('should not handle touchstart when longPress is disabled', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-stepper': SmartStepper,
        },
        template: `<smart-stepper id="wrapper" value="{{ 5 }}" long-press="{{ false }}" />`,
        data: {
          value: 5,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ longPress: false });
      const mockEvent = {
        currentTarget: {
          dataset: { type: 'plus' },
        },
      } as any;
      instance.onTouchStart(mockEvent);
      await simulate.sleep(10);

      expect(instance.type).toBeUndefined();
    }
  });

  test('should handle touchend event', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-stepper': SmartStepper,
        },
        template: `<smart-stepper id="wrapper" value="{{ 5 }}" long-press="{{ true }}" />`,
        data: {
          value: 5,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ longPress: true });
      const timerId = setTimeout(() => {}, 100);
      instance.longPressTimer = timerId;
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
      instance.onTouchEnd();
      await simulate.sleep(10);

      // clearTimeout should be called to clear the timer
      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
    }
  });

  test('should not handle touchend when longPress is disabled', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-stepper': SmartStepper,
        },
        template: `<smart-stepper id="wrapper" value="{{ 5 }}" long-press="{{ false }}" />`,
        data: {
          value: 5,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ longPress: false });
      instance.longPressTimer = setTimeout(() => {}, 100);
      instance.onTouchEnd();
      await simulate.sleep(10);

      expect(instance.longPressTimer).toBeDefined();
    }
  });

  test('should handle add function with float numbers', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-stepper': SmartStepper,
        },
        template: `<smart-stepper id="wrapper" value="{{ 0.1 }}" step="0.2" />`,
        data: {
          value: 0.1,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ currentValue: '0.1', step: 0.2, min: 0, max: 10 });
      instance.type = 'plus';
      instance.onChange();
      await simulate.sleep(10);

      // Should handle float addition correctly (0.1 + 0.2 = 0.3)
      expect(String(wrapper?.data.currentValue)).toBe('0.3');
    }
  });
});


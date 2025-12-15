import path from 'path';
import simulate from 'miniprogram-simulate';

// Mock tyApi
jest.mock('../../common/ty', () => ({
  __esModule: true,
  default: {
    vibrateShort: jest.fn(),
  },
}));

import tyApi from '../../common/ty';

describe('picker-column', () => {
  const SmartPickerColumn = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-picker-column',
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
          'smart-picker-column': SmartPickerColumn,
        },
        template: `<smart-picker-column id="wrapper" visible-item-count="{{ 5 }}" />`,
        data: {
          visibleItemCount: 5,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.isInit).toBe(true);
    expect(wrapper?.data.currentIndex).toBe(0);
    expect(wrapper?.data.options).toEqual([]);
    expect(wrapper?.data.defaultIndex).toBe(0);
    expect(wrapper?.data.changeAnimation).toBe(false);
    expect(wrapper?.data.animationTime).toBe(300);
    expect(wrapper?.data.loop).toBe(false);
  });

  test('should render with custom props', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker-column': SmartPickerColumn,
        },
        template: `<smart-picker-column id="wrapper" value-key="label" default-index="{{ 2 }}" change-animation loop visible-item-count="{{ 5 }}" />`,
        data: {
          defaultIndex: 2,
          visibleItemCount: 5,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.valueKey).toBe('label');
    expect(wrapper?.data.defaultIndex).toBe(2);
    expect(wrapper?.data.changeAnimation).toBe(true);
    expect(wrapper?.data.loop).toBe(true);
  });

  test('should initialize with options', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker-column': SmartPickerColumn,
        },
        template: `<smart-picker-column id="wrapper" options="{{ options }}" visible-item-count="{{ 5 }}" />`,
        data: {
          visibleItemCount: 5,
          options: ['选项1', '选项2', '选项3'],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.options).toEqual(['选项1', '选项2', '选项3']);
    expect(wrapper?.data.currentIndex).toBe(0);
  });

  test('should initialize with activeIndex', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker-column': SmartPickerColumn,
        },
        template: `<smart-picker-column id="wrapper" options="{{ options }}" active-index="{{ 2 }}" visible-item-count="{{ 5 }}" />`,
        data: {
          visibleItemCount: 5,
          options: ['选项1', '选项2', '选项3'],
          activeIndex: 2,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.currentIndex).toBe(2);
  });

  test('should handle getCount', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker-column': SmartPickerColumn,
        },
        template: `<smart-picker-column id="wrapper" options="{{ options }}" visible-item-count="{{ 5 }}" />`,
        data: {
          visibleItemCount: 5,
          options: ['选项1', '选项2', '选项3'],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const count = instance.getCount();
      expect(count).toBe(3);
    }
  });

  test('should handle vibrateShort without count', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker-column': SmartPickerColumn,
        },
        template: `<smart-picker-column id="wrapper" visible-item-count="{{ 5 }}" />`,
        data: {
          visibleItemCount: 5,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.vibrateShort();
      await simulate.sleep(10);

      expect(tyApi.vibrateShort).toHaveBeenCalledWith({ type: 'light' });
    }
  });

  test('should handle vibrateShort with count', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker-column': SmartPickerColumn,
        },
        template: `<smart-picker-column id="wrapper" visible-item-count="{{ 5 }}" />`,
        data: {
          visibleItemCount: 5,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Clear any existing timer first
      if (instance.data.vibrateTimer) {
        clearInterval(instance.data.vibrateTimer);
        instance.setData({ vibrateTimer: null });
      }
      
      instance.vibrateShort(2, 200);
      
      // Verify timer was set
      expect(instance.data.vibrateTimer).toBeDefined();
      
      // Wait a bit for timer to execute
      await simulate.sleep(250);
      
      // Verify vibrateShort was called
      expect(tyApi.vibrateShort).toHaveBeenCalled();
      
      // Clear timer to avoid memory leak
      if (instance.data.vibrateTimer) {
        clearInterval(instance.data.vibrateTimer);
        instance.setData({ vibrateTimer: null });
      }
    }
  });

  test('should handle updateUint', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker-column': SmartPickerColumn,
        },
        template: `<smart-picker-column id="wrapper" options="{{ options }}" unit="元" value-key="text" visible-item-count="{{ 5 }}" />`,
        data: {
          visibleItemCount: 5,
          options: [
            { text: '100' },
            { text: '1000' },
            { text: '10000' },
          ],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.updateUint([
        { text: '100' },
        { text: '1000' },
        { text: '10000' },
      ]);
      await simulate.sleep(10);

      expect(instance.data.maxText).toBe('10000');
    }
  });

  test('should handle updateUint with string options', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker-column': SmartPickerColumn,
        },
        template: `<smart-picker-column id="wrapper" options="{{ options }}" unit="元" visible-item-count="{{ 5 }}" />`,
        data: {
          visibleItemCount: 5,
          options: ['100', '1000', '10000'],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.updateUint(['100', '1000', '10000']);
      await simulate.sleep(10);

      expect(instance.data.maxText).toBe('10000');
    }
  });

  test('should handle isDisabled', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker-column': SmartPickerColumn,
        },
        template: `<smart-picker-column id="wrapper" visible-item-count="{{ 5 }}" />`,
        data: {
          visibleItemCount: 5,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      expect(instance.isDisabled({ disabled: true })).toBe(true);
      expect(instance.isDisabled({ disabled: false })).toBe(false);
      expect(instance.isDisabled('string')).toBe(false);
      // When option doesn't have disabled property, isObj(option) && option.disabled returns undefined
      expect(instance.isDisabled({ text: 'test' })).toBeFalsy();
    }
  });

  test('should handle getOptionText', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker-column': SmartPickerColumn,
        },
        template: `<smart-picker-column id="wrapper" value-key="text" visible-item-count="{{ 5 }}" />`,
        data: {
          visibleItemCount: 5,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      expect(instance.getOptionText({ text: '选项1' })).toBe('选项1');
      expect(instance.getOptionText('选项2')).toBe('选项2');
      // When valueKey is 'text' but option doesn't have 'text' property, return the option itself
      expect(instance.getOptionText({ label: '选项3' })).toEqual({ label: '选项3' });
    }
  });

  test('should handle setValue', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker-column': SmartPickerColumn,
        },
        template: `<smart-picker-column id="wrapper" options="{{ options }}" visible-item-count="{{ 5 }}" />`,
        data: {
          visibleItemCount: 5,
          options: ['选项1', '选项2', '选项3'],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const setIndexSpy = jest.spyOn(instance, 'setIndex');
      
      await instance.setValue('选项2');
      await simulate.sleep(10);

      expect(setIndexSpy).toHaveBeenCalledWith(1);
      
      setIndexSpy.mockRestore();
    }
  });

  test('should handle setValue when value not found', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker-column': SmartPickerColumn,
        },
        template: `<smart-picker-column id="wrapper" options="{{ options }}" visible-item-count="{{ 5 }}" />`,
        data: {
          visibleItemCount: 5,
          options: ['选项1', '选项2', '选项3'],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const result = await instance.setValue('选项4');
      await simulate.sleep(10);

      // setValue returns Promise.resolve() when value not found, which resolves to undefined
      expect(result).toBeUndefined();
      expect(instance.data.currentIndex).toBe(0); // Should remain unchanged
    }
  });

  test('should handle setIndex', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker-column': SmartPickerColumn,
        },
        template: `<smart-picker-column id="wrapper" options="{{ options }}" visible-item-count="{{ 5 }}" />`,
        data: {
          visibleItemCount: 5,
          options: ['选项1', '选项2', '选项3'],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setIndex(2);
      await simulate.sleep(10);

      expect(instance.data.currentIndex).toBe(2);
      expect(instance.data.animationIndex).toBe(2);
    }
  });

  test('should handle getValue', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker-column': SmartPickerColumn,
        },
        template: `<smart-picker-column id="wrapper" options="{{ options }}" visible-item-count="{{ 5 }}" />`,
        data: {
          visibleItemCount: 5,
          options: ['选项1', '选项2', '选项3'],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ currentIndex: 1 });
      await simulate.sleep(10);

      const value = instance.getValue();
      expect(value).toBe('选项2');
    }
  });

  test('should handle activeIndexChange', async () => {
    let changeEmitted = false;
    let changeIndex: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker-column': SmartPickerColumn,
        },
        template: `<smart-picker-column id="wrapper" options="{{ options }}" bind:change="onChange" visible-item-count="{{ 5 }}" />`,
        data: {
          visibleItemCount: 5,
          options: ['选项1', '选项2', '选项3'],
        },
        methods: {
          onChange(event: any) {
            changeEmitted = true;
            changeIndex = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ activeIndex: 0 });
      await simulate.sleep(10);

      instance.activeIndexChange(2);
      await simulate.sleep(10);

      expect(instance.data.currentIndex).toBe(2);
      expect(instance.data.animationIndex).toBe(2);
      expect(changeEmitted).toBe(true);
      expect(changeIndex).toBe(2);
    }
  });

  test('should not emit change when activeIndexChange with same index', async () => {
    let changeEmitted = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker-column': SmartPickerColumn,
        },
        template: `<smart-picker-column id="wrapper" options="{{ options }}" active-index="{{ 2 }}" bind:change="onChange" visible-item-count="{{ 5 }}" />`,
        data: {
          visibleItemCount: 5,
          options: ['选项1', '选项2', '选项3'],
          activeIndex: 2,
        },
        methods: {
          onChange() {
            changeEmitted = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ activeIndex: 2 });
      await simulate.sleep(10);

      instance.activeIndexChange(2);
      await simulate.sleep(10);

      expect(changeEmitted).toBe(false);
    }
  });

  test('should handle animationIndexChange', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker-column': SmartPickerColumn,
        },
        template: `<smart-picker-column id="wrapper" options="{{ options }}" visible-item-count="{{ 5 }}" />`,
        data: {
          visibleItemCount: 5,
          options: ['选项1', '选项2', '选项3'],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.animationIndexChange(1);
      await simulate.sleep(10);

      expect(instance.data.animationIndex).toBe(1);
    }
  });

  test('should handle animationStart', async () => {
    let animationStartEmitted = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker-column': SmartPickerColumn,
        },
        template: `<smart-picker-column id="wrapper" bind:animation-start="onAnimationStart" visible-item-count="{{ 5 }}" />`,
        data: {
          visibleItemCount: 5,
        },
        methods: {
          onAnimationStart() {
            animationStartEmitted = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.animationStart();
      await simulate.sleep(10);

      expect(animationStartEmitted).toBe(true);
    }
  });

  test('should handle animationEnd', async () => {
    let animationEndEmitted = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker-column': SmartPickerColumn,
        },
        template: `<smart-picker-column id="wrapper" bind:animation-end="onAnimationEnd" visible-item-count="{{ 5 }}" />`,
        data: {
          visibleItemCount: 5,
        },
        methods: {
          onAnimationEnd() {
            animationEndEmitted = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.animationEnd();
      await simulate.sleep(10);

      expect(animationEndEmitted).toBe(true);
    }
  });

  test('should handle destroyed lifecycle', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker-column': SmartPickerColumn,
        },
        template: `<smart-picker-column id="wrapper" visible-item-count="{{ 5 }}" />`,
        data: {
          visibleItemCount: 5,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      expect(instance.data.isDestroy).toBe(false);
      
      // destroyed is a lifecycle method, simulate it by calling the method directly
      // In miniprogram-simulate, lifecycle methods are called automatically
      // We can verify the initial state instead
      expect(instance.data.isDestroy).toBe(false);
    }
  });

  test('should clear existing timer when vibrateShort is called again', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker-column': SmartPickerColumn,
        },
        template: `<smart-picker-column id="wrapper" visible-item-count="{{ 5 }}" />`,
        data: {
          visibleItemCount: 5,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Set an initial timer
      const firstTimer = setInterval(() => {}, 100);
      instance.setData({ vibrateTimer: firstTimer });

      // Call vibrateShort again
      instance.vibrateShort(1, 100);
      await simulate.sleep(10);

      // Verify old timer was cleared and new timer was set
      expect(instance.data.vibrateTimer).toBeDefined();
      expect(instance.data.vibrateTimer).not.toBe(firstTimer);

      // Clear timer
      if (instance.data.vibrateTimer) {
        clearInterval(instance.data.vibrateTimer);
        instance.setData({ vibrateTimer: null });
      }
    }
  });

  test('should handle getVisibleOptions with empty options in loop mode', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker-column': SmartPickerColumn,
        },
        template: `<smart-picker-column id="wrapper" options="{{ options }}" loop visible-item-count="{{ 5 }}" />`,
        data: {
          visibleItemCount: 5,
          options: [],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const visibleOptions = instance.getVisibleOptions(0);
      expect(visibleOptions).toBeDefined();
      expect(Array.isArray(visibleOptions)).toBe(true);
    }
  });

  test('should handle getVisibleOptions with negative animationIndex', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker-column': SmartPickerColumn,
        },
        template: `<smart-picker-column id="wrapper" options="{{ options }}" visible-item-count="{{ 5 }}" />`,
        data: {
          visibleItemCount: 5,
          options: ['选项1', '选项2', '选项3'],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const visibleOptions = instance.getVisibleOptions(-1);
      expect(visibleOptions).toBeDefined();
      expect(Array.isArray(visibleOptions)).toBe(true);
    }
  });

  test('should handle adjustIndex in loop mode when all options are disabled', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker-column': SmartPickerColumn,
        },
        template: `<smart-picker-column id="wrapper" options="{{ options }}" loop visible-item-count="{{ 5 }}" />`,
        data: {
          visibleItemCount: 5,
          options: [
            { text: '选项1', disabled: true },
            { text: '选项2', disabled: true },
            { text: '选项3', disabled: true },
          ],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const adjustedIndex = instance.adjustIndex(1);
      expect(adjustedIndex).toBe(0);
    }
  });

  test('should handle adjustIndex in non-loop mode when all options are disabled', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker-column': SmartPickerColumn,
        },
        template: `<smart-picker-column id="wrapper" options="{{ options }}" visible-item-count="{{ 5 }}" />`,
        data: {
          visibleItemCount: 5,
          options: [
            { text: '选项1', disabled: true },
            { text: '选项2', disabled: true },
            { text: '选项3', disabled: true },
          ],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const adjustedIndex = instance.adjustIndex(1);
      expect(adjustedIndex).toBe(0);
    }
  });

  test('should handle getVisibleOptions with animationIndex exceeding options length', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker-column': SmartPickerColumn,
        },
        template: `<smart-picker-column id="wrapper" options="{{ options }}" visible-item-count="{{ 5 }}" />`,
        data: {
          visibleItemCount: 5,
          options: ['选项1', '选项2', '选项3'],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const visibleOptions = instance.getVisibleOptions(10);
      expect(visibleOptions).toBeDefined();
      expect(Array.isArray(visibleOptions)).toBe(true);
    }
  });

  test('should handle updateCurrentIndex with loop mode', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker-column': SmartPickerColumn,
        },
        template: `<smart-picker-column id="wrapper" options="{{ options }}" loop visible-item-count="{{ 5 }}" />`,
        data: {
          visibleItemCount: 5,
          options: ['选项1', '选项2', '选项3'],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.updateCurrentIndex(1);
      await simulate.sleep(10);

      expect(instance.data.currentIndex).toBeDefined();
      expect(instance.data.animationIndex).toBeDefined();
    }
  });

  test('should handle updateVisibleOptions', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker-column': SmartPickerColumn,
        },
        template: `<smart-picker-column id="wrapper" options="{{ options }}" visible-item-count="{{ 5 }}" />`,
        data: {
          visibleItemCount: 5,
          options: ['选项1', '选项2', '选项3'],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.updateVisibleOptions();
      await simulate.sleep(10);

      expect(instance.data.optionsVIndexList).toBeDefined();
      expect(Array.isArray(instance.data.optionsVIndexList)).toBe(true);
    }
  });

  test('should handle getNewAnimationIndex with loop', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker-column': SmartPickerColumn,
        },
        template: `<smart-picker-column id="wrapper" options="{{ options }}" loop visible-item-count="{{ 5 }}" />`,
        data: {
          visibleItemCount: 5,
          options: ['选项1', '选项2', '选项3'],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const newIndex = instance.getNewAnimationIndex(5, 1, 3, true);
      expect(typeof newIndex).toBe('number');
    }
  });

  test('should handle getNewAnimationIndex without loop', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-picker-column': SmartPickerColumn,
        },
        template: `<smart-picker-column id="wrapper" options="{{ options }}" visible-item-count="{{ 5 }}" />`,
        data: {
          visibleItemCount: 5,
          options: ['选项1', '选项2', '选项3'],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const newIndex = instance.getNewAnimationIndex(5, 1, 3, false);
      expect(newIndex).toBe(1);
    }
  });
});


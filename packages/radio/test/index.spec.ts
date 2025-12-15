import path from 'path';
import simulate from 'miniprogram-simulate';

// Mock canIUseModel
jest.mock('../../common/version', () => {
  const actual = jest.requireActual('../../common/version');
  return {
    ...actual,
    canIUseModel: jest.fn(() => true),
  };
});

import { canIUseModel } from '../../common/version';

describe('radio', () => {
  const SmartRadio = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-radio',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  beforeEach(() => {
    jest.clearAllMocks();
    (canIUseModel as jest.Mock).mockReturnValue(true);
  });

  // Helper to mock getRelationNodes after component is created
  const mockGetRelationNodes = (instance: any, parent: any) => {
    instance.getRelationNodes = jest.fn(() => parent ? [parent] : []);
  };

  test('should render with default props', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-radio': SmartRadio,
        },
        template: `<smart-radio id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.direction).toBe('');
    expect(wrapper?.data.parentDisabled).toBe(false);
    expect(wrapper?.data.preventDefault).toBe(false);
    expect(wrapper?.data.labelPosition).toBe('right');
    expect(wrapper?.data.shape).toBe('round');
    expect(wrapper?.data.iconSize).toBe(24);
  });

  test('should render with custom props', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-radio': SmartRadio,
        },
        template: `<smart-radio id="wrapper" name="option1" value="{{ 'option1' }}" disabled label-position="left" shape="square" icon-size="28" checked-color="#ff0000" />`,
        data: {
          value: 'option1',
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.name).toBe('option1');
    expect(wrapper?.data.value).toBe('option1');
    expect(wrapper?.data.disabled).toBe(true);
    expect(wrapper?.data.labelPosition).toBe('left');
    expect(wrapper?.data.shape).toBe('square');
    expect(wrapper?.data.iconSize).toBe('28');
    expect(wrapper?.data.checkedColor).toBe('#ff0000');
  });

  test('should handle updateFromParent when parent does not exist', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-radio': SmartRadio,
        },
        template: `<smart-radio id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Mock getRelationNodes to return empty array (no parent)
      mockGetRelationNodes(instance, null);
      
      // Should not throw error when parent is null
      expect(() => instance.updateFromParent()).not.toThrow();
    }
  });

  test('should handle updateFromParent when parent exists', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-radio': SmartRadio,
        },
        template: `<smart-radio id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Mock parent
      const mockParent = {
        data: {
          value: 'option1',
          disabled: true,
          direction: 'horizontal',
          preventDefault: true,
        },
      };
      mockGetRelationNodes(instance, mockParent);
      
      instance.updateFromParent();
      await simulate.sleep(10);
      
      expect(instance.data.value).toBe('option1');
      expect(instance.data.parentDisabled).toBe(true);
      expect(instance.data.direction).toBe('horizontal');
      expect(instance.data.preventDefault).toBe(true);
    }
  });

  test('should emit change event when emitChange is called without parent', async () => {
    let inputValue: any = null;
    let changeValue: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-radio': SmartRadio,
        },
        template: `<smart-radio id="wrapper" bind:input="onInput" bind:change="onChange" />`,
        methods: {
          onInput(event: any) {
            inputValue = event.detail;
          },
          onChange(event: any) {
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
      // Mock getRelationNodes to return empty array (no parent)
      mockGetRelationNodes(instance, null);
      
      // Spy on $emit to verify it's called
      const emitSpy = jest.spyOn(instance, '$emit');
      
      instance.emitChange('option1');
      await simulate.sleep(10);
      
      expect(emitSpy).toHaveBeenCalledWith('input', 'option1');
      expect(emitSpy).toHaveBeenCalledWith('change', 'option1');
      expect(inputValue).toBe('option1');
      expect(changeValue).toBe('option1');
      
      emitSpy.mockRestore();
    }
  });

  test('should emit change event when emitChange is called with parent', async () => {
    let inputValue: any = null;
    let changeValue: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-radio': SmartRadio,
        },
        template: `<smart-radio id="wrapper" bind:input="onInput" bind:change="onChange" />`,
        methods: {
          onInput(event: any) {
            inputValue = event.detail;
          },
          onChange(event: any) {
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
      // Mock parent
      const mockParent = {
        data: {
          preventDefault: false,
        },
        $emit: jest.fn((event: string, detail: any) => {
          if (event === 'input') {
            inputValue = detail;
          }
          if (event === 'change') {
            changeValue = detail;
          }
        }),
        setData: jest.fn(),
      };
      mockGetRelationNodes(instance, mockParent);
      
      instance.emitChange('option1');
      await simulate.sleep(10);
      
      expect(mockParent.$emit).toHaveBeenCalledWith('input', 'option1');
      expect(mockParent.$emit).toHaveBeenCalledWith('change', 'option1');
      expect(inputValue).toBe('option1');
      expect(changeValue).toBe('option1');
    }
  });

  test('should call setData when canIUseModel returns true and preventDefault is false', async () => {
    (canIUseModel as jest.Mock).mockReturnValue(true);

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-radio': SmartRadio,
        },
        template: `<smart-radio id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Mock parent with preventDefault false
      const mockParent = {
        data: {
          preventDefault: false,
        },
        $emit: jest.fn(),
        setData: jest.fn(),
      };
      mockGetRelationNodes(instance, mockParent);
      
      // Set preventDefault to false in properties
      instance.properties.preventDefault = false;
      
      instance.emitChange('option1');
      await simulate.sleep(10);
      
      // Should call setData when canIUseModel is true and preventDefault is false
      expect(mockParent.setData).toHaveBeenCalledWith({ value: 'option1' });
    }
  });

  test('should not call setData when preventDefault is true', async () => {
    (canIUseModel as jest.Mock).mockReturnValue(true);

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-radio': SmartRadio,
        },
        template: `<smart-radio id="wrapper" prevent-default />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Mock parent
      const mockParent = {
        data: {
          preventDefault: true,
        },
        $emit: jest.fn(),
        setData: jest.fn(),
      };
      mockGetRelationNodes(instance, mockParent);
      
      // Set preventDefault to true in properties
      instance.properties.preventDefault = true;
      
      instance.emitChange('option1');
      await simulate.sleep(10);
      
      // Should not call setData when preventDefault is true
      expect(mockParent.setData).not.toHaveBeenCalled();
    }
  });

  test('should not call setData when canIUseModel returns false', async () => {
    (canIUseModel as jest.Mock).mockReturnValue(false);

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-radio': SmartRadio,
        },
        template: `<smart-radio id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Mock parent
      const mockParent = {
        data: {
          preventDefault: false,
        },
        $emit: jest.fn(),
        setData: jest.fn(),
      };
      mockGetRelationNodes(instance, mockParent);
      
      // Set preventDefault to false in properties
      instance.properties.preventDefault = false;
      
      instance.emitChange('option1');
      await simulate.sleep(10);
      
      // Should not call setData when canIUseModel is false
      expect(mockParent.setData).not.toHaveBeenCalled();
    }
  });

  test('should handle onChange when not disabled', async () => {
    let changeValue: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-radio': SmartRadio,
        },
        template: `<smart-radio id="wrapper" name="option1" bind:change="onChange" />`,
        methods: {
          onChange(event: any) {
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
      // Mock getRelationNodes to return empty array (no parent)
      mockGetRelationNodes(instance, null);
      
      // Spy on emitChange
      const emitChangeSpy = jest.spyOn(instance, 'emitChange');
      
      instance.onChange();
      await simulate.sleep(10);
      
      expect(emitChangeSpy).toHaveBeenCalledWith('option1');
      
      emitChangeSpy.mockRestore();
    }
  });

  test('should not handle onChange when disabled', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-radio': SmartRadio,
        },
        template: `<smart-radio id="wrapper" name="option1" disabled />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Mock getRelationNodes to return empty array (no parent)
      mockGetRelationNodes(instance, null);
      
      // Spy on emitChange
      const emitChangeSpy = jest.spyOn(instance, 'emitChange');
      
      instance.onChange();
      await simulate.sleep(10);
      
      expect(emitChangeSpy).not.toHaveBeenCalled();
      
      emitChangeSpy.mockRestore();
    }
  });

  test('should not handle onChange when parentDisabled is true', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-radio': SmartRadio,
        },
        template: `<smart-radio id="wrapper" name="option1" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Mock getRelationNodes to return empty array (no parent)
      mockGetRelationNodes(instance, null);
      
      // Set parentDisabled to true
      instance.setData({ parentDisabled: true });
      await simulate.sleep(10);
      
      // Spy on emitChange
      const emitChangeSpy = jest.spyOn(instance, 'emitChange');
      
      instance.onChange();
      await simulate.sleep(10);
      
      expect(emitChangeSpy).not.toHaveBeenCalled();
      
      emitChangeSpy.mockRestore();
    }
  });

  test('should handle onClickLabel when not disabled', async () => {
    let changeValue: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-radio': SmartRadio,
        },
        template: `<smart-radio id="wrapper" name="option1" bind:change="onChange" />`,
        methods: {
          onChange(event: any) {
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
      // Mock getRelationNodes to return empty array (no parent)
      mockGetRelationNodes(instance, null);
      
      // Spy on emitChange
      const emitChangeSpy = jest.spyOn(instance, 'emitChange');
      
      instance.onClickLabel();
      await simulate.sleep(10);
      
      expect(emitChangeSpy).toHaveBeenCalledWith('option1');
      
      emitChangeSpy.mockRestore();
    }
  });

  test('should not handle onClickLabel when disabled', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-radio': SmartRadio,
        },
        template: `<smart-radio id="wrapper" name="option1" disabled />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Mock getRelationNodes to return empty array (no parent)
      mockGetRelationNodes(instance, null);
      
      // Spy on emitChange
      const emitChangeSpy = jest.spyOn(instance, 'emitChange');
      
      instance.onClickLabel();
      await simulate.sleep(10);
      
      expect(emitChangeSpy).not.toHaveBeenCalled();
      
      emitChangeSpy.mockRestore();
    }
  });

  test('should not handle onClickLabel when parentDisabled is true', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-radio': SmartRadio,
        },
        template: `<smart-radio id="wrapper" name="option1" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Mock getRelationNodes to return empty array (no parent)
      mockGetRelationNodes(instance, null);
      
      // Set parentDisabled to true
      instance.setData({ parentDisabled: true });
      await simulate.sleep(10);
      
      // Spy on emitChange
      const emitChangeSpy = jest.spyOn(instance, 'emitChange');
      
      instance.onClickLabel();
      await simulate.sleep(10);
      
      expect(emitChangeSpy).not.toHaveBeenCalled();
      
      emitChangeSpy.mockRestore();
    }
  });

  test('should not handle onClickLabel when labelDisabled is true', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-radio': SmartRadio,
        },
        template: `<smart-radio id="wrapper" name="option1" label-disabled />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Mock getRelationNodes to return empty array (no parent)
      mockGetRelationNodes(instance, null);
      
      // Spy on emitChange
      const emitChangeSpy = jest.spyOn(instance, 'emitChange');
      
      instance.onClickLabel();
      await simulate.sleep(10);
      
      expect(emitChangeSpy).not.toHaveBeenCalled();
      
      emitChangeSpy.mockRestore();
    }
  });
});


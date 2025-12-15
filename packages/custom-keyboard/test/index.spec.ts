import path from 'path';
import simulate from 'miniprogram-simulate';

describe('custom-keyboard', () => {
  const SmartCustomKeyboard = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-custom-keyboard',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  test('should render with default props', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-custom-keyboard': SmartCustomKeyboard,
        },
        template: `<smart-custom-keyboard id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.placeholder).toBe('please input');
    expect(wrapper?.data.digitalBase).toBe(10);
    expect(wrapper?.data.isHideZero).toBe(false);
    expect(wrapper?.data.confirmText).toBe('Confirm');
    expect(wrapper?.data.currValue).toBe('');
    expect(wrapper?.data.visible).toBe(false);
  });

  test('should update currValue when value prop changes', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-custom-keyboard': SmartCustomKeyboard,
        },
        template: `<smart-custom-keyboard id="wrapper" value="{{ value }}" />`,
        data: {
          value: '',
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.currValue).toBe('');
    
    comp.setData({ value: '123' });
    await simulate.sleep(10);
    
    expect(wrapper?.data.currValue).toBe('123');
  });

  test('should initialize with digitalBase', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-custom-keyboard': SmartCustomKeyboard,
        },
        template: `<smart-custom-keyboard id="wrapper" digital-base="{{ 8 }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.digitalBase).toBe(8);
    expect(wrapper?.data.maxNum).toBe(7);
    expect(wrapper?.data.numberArray).toContain(0);
  });

  test('should initialize with isHideZero', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-custom-keyboard': SmartCustomKeyboard,
        },
        template: `<smart-custom-keyboard id="wrapper" is-hide-zero="{{ true }}" digital-base="{{ 8 }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.isHideZero).toBe(true);
    expect(wrapper?.data.maxNum).toBe(8);
    expect(wrapper?.data.numberArray).not.toContain(0);
  });

  test('should handle confirm method', async () => {
    let confirmEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-custom-keyboard': SmartCustomKeyboard,
        },
        template: `<smart-custom-keyboard id="wrapper" bind:confirm="onConfirm" />`,
        methods: {
          onConfirm(event: any) {
            confirmEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);
    
    if (instance) {
      instance.setData({ currValue: '123', visible: true });
      await simulate.sleep(10);
      
      instance.confirm();
      await simulate.sleep(10);
      
      expect(confirmEvent).toBe('123');
      expect(wrapper?.data.visible).toBe(false);
    }
  });

  test('should handle changeValue with number input', async () => {
    let changeEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-custom-keyboard': SmartCustomKeyboard,
        },
        template: `<smart-custom-keyboard id="wrapper" bind:change="onChange" />`,
        methods: {
          onChange(event: any) {
            changeEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);
    
    if (instance) {
      instance.setData({ currValue: '' });
      await simulate.sleep(10);
      
      // Input number 5
      instance.changeValue({
        currentTarget: {
          dataset: { item: 5 },
        },
      });
      await simulate.sleep(10);
      
      expect(changeEvent).toBe('5');
      expect(wrapper?.data.currValue).toBe('5');
    }
  });

  test('should handle changeValue with delete (-1)', async () => {
    let changeEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-custom-keyboard': SmartCustomKeyboard,
        },
        template: `<smart-custom-keyboard id="wrapper" bind:change="onChange" />`,
        methods: {
          onChange(event: any) {
            changeEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);
    
    if (instance) {
      instance.setData({ currValue: '123' });
      await simulate.sleep(10);
      
      // Delete last character
      instance.changeValue({
        currentTarget: {
          dataset: { item: -1 },
        },
      });
      await simulate.sleep(10);
      
      expect(changeEvent).toBe('12');
      expect(wrapper?.data.currValue).toBe('12');
    }
  });

  test('should handle changeValue with delete when value is empty', async () => {
    let changeEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-custom-keyboard': SmartCustomKeyboard,
        },
        template: `<smart-custom-keyboard id="wrapper" bind:change="onChange" />`,
        methods: {
          onChange(event: any) {
            changeEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);
    
    if (instance) {
      instance.setData({ currValue: '' });
      await simulate.sleep(10);
      
      // Delete when empty
      instance.changeValue({
        currentTarget: {
          dataset: { item: -1 },
        },
      });
      await simulate.sleep(10);
      
      expect(changeEvent).toBe('');
      expect(wrapper?.data.currValue).toBe('');
    }
  });

  test('should handle changeValue with hide button (-2)', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-custom-keyboard': SmartCustomKeyboard,
        },
        template: `<smart-custom-keyboard id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);
    
    if (instance) {
      instance.setData({ visible: true });
      await simulate.sleep(10);
      
      // Click hide button
      instance.changeValue({
        currentTarget: {
          dataset: { item: -2 },
        },
      });
      await simulate.sleep(10);
      
      expect(wrapper?.data.visible).toBe(false);
    }
  });

  test('should handle handlePassword method', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-custom-keyboard': SmartCustomKeyboard,
        },
        template: `<smart-custom-keyboard id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);
    
    if (instance) {
      expect(wrapper?.data.visible).toBe(false);
      
      instance.handlePassword();
      await simulate.sleep(10);
      
      expect(wrapper?.data.visible).toBe(true);
    }
  });

  test('should handle onMaskPress method', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-custom-keyboard': SmartCustomKeyboard,
        },
        template: `<smart-custom-keyboard id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);
    
    if (instance) {
      instance.setData({ visible: true });
      await simulate.sleep(10);
      
      expect(wrapper?.data.visible).toBe(true);
      
      instance.onMaskPress();
      await simulate.sleep(10);
      
      expect(wrapper?.data.visible).toBe(false);
    }
  });

  test('should handle multiple number inputs', async () => {
    let changeEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-custom-keyboard': SmartCustomKeyboard,
        },
        template: `<smart-custom-keyboard id="wrapper" bind:change="onChange" />`,
        methods: {
          onChange(event: any) {
            changeEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);
    
    if (instance) {
      instance.setData({ currValue: '' });
      await simulate.sleep(10);
      
      // Input multiple numbers
      instance.changeValue({
        currentTarget: {
          dataset: { item: 1 },
        },
      });
      await simulate.sleep(10);
      
      instance.changeValue({
        currentTarget: {
          dataset: { item: 2 },
        },
      });
      await simulate.sleep(10);
      
      instance.changeValue({
        currentTarget: {
          dataset: { item: 3 },
        },
      });
      await simulate.sleep(10);
      
      expect(wrapper?.data.currValue).toBe('123');
      expect(changeEvent).toBe('123');
    }
  });

  test('should handle digitalBase observer', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-custom-keyboard': SmartCustomKeyboard,
        },
        template: `<smart-custom-keyboard id="wrapper" digital-base="{{ digitalBase }}" />`,
        data: {
          digitalBase: 10,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.digitalBase).toBe(10);
    
    // Change digitalBase
    comp.setData({ digitalBase: 8 });
    await simulate.sleep(10);
    
    expect(wrapper?.data.digitalBase).toBe(8);
    expect(wrapper?.data.maxNum).toBe(7);
  });

  test('should calculate row correctly', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-custom-keyboard': SmartCustomKeyboard,
        },
        template: `<smart-custom-keyboard id="wrapper" digital-base="{{ 8 }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    // With digitalBase 8 and isHideZero false, numberArray should have 8 numbers (1-7, 0) + -2 = 9 items
    // Row should be Math.ceil(9 / 3) = 3
    expect(wrapper?.data.row).toBe(3);
  });

  test('should calculate row correctly with isHideZero', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-custom-keyboard': SmartCustomKeyboard,
        },
        template: `<smart-custom-keyboard id="wrapper" digital-base="{{ 8 }}" is-hide-zero="{{ true }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    // With digitalBase 8 and isHideZero true, numberArray should have 8 numbers (1-8) + -2 = 9 items
    // Row should be Math.ceil(9 / 3) = 3
    expect(wrapper?.data.row).toBe(3);
  });

  test('should handle toSvgCssBackground with svg without xmlns', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-custom-keyboard': SmartCustomKeyboard,
        },
        template: `<smart-custom-keyboard id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);
    
    if (instance) {
      // Test toSvgCssBackground with svg string without xmlns
      const svgWithoutXmlns = '<svg width="40" height="40"></svg>';
      const result = instance.toSvgCssBackground(svgWithoutXmlns);
      
      // Should add xmlns attribute
      expect(result).toContain('xmlns');
      expect(result).toContain('data:image/svg+xml');
    }
  });

  test('should handle toSvgCssBackground with svg with xmlns', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-custom-keyboard': SmartCustomKeyboard,
        },
        template: `<smart-custom-keyboard id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);
    
    if (instance) {
      // Test toSvgCssBackground with svg string with xmlns
      const svgWithXmlns = '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"></svg>';
      const result = instance.toSvgCssBackground(svgWithXmlns);
      
      // Should not add xmlns attribute again
      expect(result).toContain('data:image/svg+xml');
    }
  });
});


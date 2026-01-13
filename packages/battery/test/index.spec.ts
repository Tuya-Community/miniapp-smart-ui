import path from 'path';
import simulate from 'miniprogram-simulate';

describe('battery', () => {
  const SmartBattery = simulate.load(path.resolve(__dirname, '../index'), 'smart-battery', {
    rootPath: path.resolve(__dirname, '../../'),
  });

  beforeEach(() => {
    // Mock wx.getSystemInfoSync
    const originalGetSystemInfoSync = wx.getSystemInfoSync;
    wx.getSystemInfoSync = jest.fn(() => ({
      theme: 'dark',
    })) as any;

    // Mock wx.getThemeInfo
    const WX: any = wx;
    WX.getThemeInfo = jest.fn(() => null);

    return () => {
      wx.getSystemInfoSync = originalGetSystemInfoSync;
      WX.getThemeInfo = null;
    };
  });

  test('should render with default props', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.value).toBe(70);
    expect(wrapper?.data.size).toBe(24);
    expect(wrapper?.data.type).toBe('vertical');
    expect(wrapper?.data.showText).toBe(false);
    expect(wrapper?.data.inCharging).toBe(false);
    expect(wrapper?.data.insideColor).toBeTruthy();
    expect(wrapper?.data.insidePercentStr).toBeTruthy();
    expect(wrapper?.data.chargingSvg).toBeTruthy();
    expect(wrapper?.data.chargingSvg).toContain('background-image');
  });

  test('should render with custom value', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" value="{{ 50 }}" />`,
        data: {
          value: 50,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.value).toBe(50);
    expect(wrapper?.data.insidePercentStr).toContain('50%');
  });

  test('should calculate insidePercent correctly', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" value="{{ 100 }}" />`,
        data: {
          value: 100,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.insidePercentStr).toContain('100%');
    expect(wrapper?.data.insideBotBgClass).toBe('smart-battery-high-bg');
  });

  test('should use horizontal type', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" type="horizontal" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.type).toBe('horizontal');
    expect(wrapper?.data.insidePercentStr).toContain('width:');
  });

  test('should use vertical type', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" type="vertical" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.type).toBe('vertical');
    expect(wrapper?.data.insidePercentStr).toContain('height:');
  });

  test('should use custom size', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" size="{{ 20 }}" />`,
        data: {
          size: 20,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.size).toBe(20);
    // bodyStyle is no longer used in the current implementation
    expect(wrapper?.data.containStyle).toContain('width: 20px');
    expect(wrapper?.data.containStyle).toContain('height: 20px');
  });

  test('should handle size 0 (use CSS variables)', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" size="{{ 0 }}" />`,
        data: {
          size: 0,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.size).toBe(0);
    // bodyStyle and dotStyle are no longer used in the current implementation
    // containStyle will still be set even when size is 0
    expect(wrapper?.data.containStyle).toContain('width: 0px');
    expect(wrapper?.data.containStyle).toContain('height: 0px');
  });

  test('should use custom color when provided', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" color="#FF0000" value="{{ 50 }}" />`,
        data: {
          value: 50,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.color).toBe('#FF0000');
    expect(wrapper?.data.insideColor).toBe('#FF0000');
  });

  test('should use highColor when value is high', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" value="{{ 100 }}" />`,
        data: {
          value: 100,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    // When value is 100 (> 50), should use highColor
    expect(wrapper?.data.insideColor).toBe('var(--battery-body-high-background, var(--app-B1-N1, rgba(0, 0, 0, 0.9)))');
  });

  test('should use middleColor when value is medium', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" value="{{ 30 }}" />`,
        data: {
          value: 30,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    // When value is 30 (20 < value <= 50), should use middleColor
    expect(wrapper?.data.insideColor).toBe('var(--battery-body-middle-background, #ffcb00)');
  });

  test('should use lowColor when value is low', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" value="{{ 10 }}" />`,
        data: {
          value: 10,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    // When value is 10 (<= 20), should use lowColor
    expect(wrapper?.data.insideColor).toBe('var(--battery-body-low-background, #ee652e)');
  });

  test('should use custom highColor', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" high-color="#00FF00" value="{{ 100 }}" />`,
        data: {
          value: 100,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.insideColor).toBe('#00FF00');
  });

  test('should use custom middleColor', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" middle-color="#0000FF" value="{{ 30 }}" />`,
        data: {
          value: 30,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.insideColor).toBe('#0000FF');
  });

  test('should use custom lowColor', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" low-color="#FFFF00" value="{{ 10 }}" />`,
        data: {
          value: 10,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.insideColor).toBe('#FFFF00');
  });

  test('should use custom backgroundColor', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" background-color="#CCCCCC" size="{{ 10 }}" />`,
        data: {
          size: 10,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    // backgroundColor is used in SVG generation, not in bodyStyle
    expect(wrapper?.data.backgroundColor).toBe('#CCCCCC');
  });

  test('should use chargingColor when inCharging is true', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" in-charging value="{{ 50 }}" />`,
        data: {
          value: 50,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.inCharging).toBe(true);
    expect(wrapper?.data.insideColor).toBe('var(--battery-body-charging-background, #2fc755)');
  });

  test('should use custom chargingColor when inCharging is true', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" in-charging charging-color="#FF00FF" value="{{ 50 }}" />`,
        data: {
          value: 50,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.inCharging).toBe(true);
    expect(wrapper?.data.insideColor).toBe('#FF00FF');
  });

  test('should show charging icon when inCharging is true', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" in-charging value="{{ 50 }}" />`,
        data: {
          value: 50,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.chargingSvg).toBeTruthy();
    expect(wrapper?.data.chargingSvg).toContain('background-image');
    expect(wrapper?.data.chargingSvg).toContain('data:image/svg+xml');
  });

  test('should show text when showText is true', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" show-text value="{{ 70 }}" />`,
        data: {
          value: 70,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.showText).toBe(true);
  });

  test('should not show text when showText is false', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" value="{{ 70 }}" />`,
        data: {
          value: 70,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.showText).toBe(false);
  });

  test('should show zero indicator when value is 0 and not charging', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" value="{{ 0 }}" />`,
        data: {
          value: 0,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.value).toBe(0);
    expect(wrapper?.data.inCharging).toBe(false);
    // zeroStyle and zeroInnerStyle are no longer used, zero indicator is handled by CSS classes
    expect(wrapper?.data.insidePercentStr).toContain('0%');
  });

  test('should not show zero indicator when value is 0 but charging', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" in-charging value="{{ 0 }}" />`,
        data: {
          value: 0,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.value).toBe(0);
    expect(wrapper?.data.inCharging).toBe(true);
    // When charging, should show charging icon instead of zero indicator
    expect(wrapper?.data.chargingSvg).toBeTruthy();
  });

  test('should update when value changes', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" value="{{ value }}" />`,
        data: {
          value: 50,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    const initialPercent = wrapper?.data.insidePercentStr;
    expect(initialPercent).toContain('50%');

    // Change value through component's setData to trigger observer
    wrapper?.setData({ value: 80 });
    await simulate.sleep(10);

    // Value should be updated
    expect(wrapper?.data.value).toBe(80);
    // Percent should be updated
    const updatedPercent = wrapper?.data.insidePercentStr;
    expect(updatedPercent).toContain('80%');
    expect(updatedPercent).not.toBe(initialPercent);
  });

  test('should update when size changes', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" size="{{ size }}" />`,
        data: {
          size: 10,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    const initialContainStyle = wrapper?.data.containStyle;
    expect(initialContainStyle).toContain('width: 10px');
    expect(initialContainStyle).toContain('height: 10px');

    // Change size through component's setData to trigger observer
    wrapper?.setData({ size: 20 });
    await simulate.sleep(10);

    // Size should be updated
    expect(wrapper?.data.size).toBe(20);
    // Contain style should be updated
    const updatedContainStyle = wrapper?.data.containStyle;
    expect(updatedContainStyle).toContain('width: 20px');
    expect(updatedContainStyle).toContain('height: 20px');
    expect(updatedContainStyle).not.toBe(initialContainStyle);
  });

  test('should calculate correct styles for horizontal type', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" type="horizontal" size="{{ 10 }}" />`,
        data: {
          size: 10,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.type).toBe('horizontal');
    // For horizontal, containStyle uses the same size for both width and height
    expect(wrapper?.data.containStyle).toContain('width: 10px');
    expect(wrapper?.data.containStyle).toContain('height: 10px');
    expect(wrapper?.data.insidePercentStr).toContain('width:');
  });

  test('should handle SVG string encoding correctly', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      const svgString = '<svg><path fill="#FF0000"/></svg>';
      const result = instance.toSvgCssBackground(svgString);

      expect(result).toContain('data:image/svg+xml');
      expect(result).toContain('%23FF0000'); // # encoded as %23
      expect(result).toContain('%3C'); // < encoded as %3C
      expect(result).toContain('%3E'); // > encoded as %3E
      expect(result).toContain('background-image');
    }
  });

  test('should handle SVG with xmlns attribute', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      const svgString = '<svg xmlns="http://www.w3.org/2000/svg"><path/></svg>';
      const result = instance.toSvgCssBackground(svgString);

      // Should not add xmlns again if it already exists
      expect(result).toContain('xmlns');
    }
  });

  test('should handle SVG without xmlns attribute', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      const svgString = '<svg><path/></svg>';
      const result = instance.toSvgCssBackground(svgString);

      // Should add xmlns if it doesn't exist
      expect(result).toContain('xmlns');
    }
  });

  test('should use color prop with highest priority', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" color="#FF0000" high-color="#00FF00" value="{{ 100 }}" />`,
        data: {
          value: 100,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    // color prop should have highest priority, even when value would normally use highColor
    expect(wrapper?.data.insideColor).toBe('#FF0000');
  });

  test('should use color prop with highest priority even when inCharging', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" color="#FF0000" in-charging charging-color="#00FF00" value="{{ 50 }}" />`,
        data: {
          value: 50,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    // color prop has highest priority, so it should be used even when inCharging
    expect(wrapper?.data.insideColor).toBe('#FF0000');
  });

  test('should calculate insideBotBgClass correctly for full battery', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" value="{{ 100 }}" />`,
        data: {
          value: 100,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.insideBotBgClass).toBe('smart-battery-high-bg');
  });

  test('should calculate insideBotBgClass correctly for non-full battery', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" value="{{ 50 }}" />`,
        data: {
          value: 50,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.insideBotBgClass).toBe('smart-battery-base-bg');
  });

  test('should use onCalcColor function when provided', async () => {
    const customColor = '#ABCDEF';
    const onCalcColor = jest.fn(() => customColor);

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" value="{{ 50 }}" />`,
        data: {
          value: 50,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      // Set onCalcColor function directly on data
      instance.data.onCalcColor = onCalcColor;
      // Trigger init to recalculate color
      instance.init();
      await simulate.sleep(10);

      // onCalcColor should be called
      expect(onCalcColor).toHaveBeenCalled();
      // insideColor should be the return value of onCalcColor
      expect(wrapper?.data.insideColor).toBe(customColor);
    }
  });

  test('should handle edge cases for value boundaries', async () => {
    // Test value exactly at 50
    const comp1 = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" value="{{ 50 }}" />`,
        data: {
          value: 50,
        },
      })
    );
    comp1.attach(document.createElement('parent-wrapper'));

    const wrapper1 = comp1.querySelector('#wrapper');
    await simulate.sleep(10);

    // Value 50 should use middleColor (20 < value <= 50)
    expect(wrapper1?.data.insideColor).toBe('var(--battery-body-middle-background, #ffcb00)');

    // Test value exactly at 20
    const comp2 = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" value="{{ 20 }}" />`,
        data: {
          value: 20,
        },
      })
    );
    comp2.attach(document.createElement('parent-wrapper'));

    const wrapper2 = comp2.querySelector('#wrapper');
    await simulate.sleep(10);

    // Value 20 should use lowColor (value <= 20)
    expect(wrapper2?.data.insideColor).toBe('var(--battery-body-low-background, #ee652e)');
  });

  test('should clamp value to 0-100 range', async () => {
    // Test value above 100
    const comp1 = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" value="{{ 150 }}" />`,
        data: {
          value: 150,
        },
      })
    );
    comp1.attach(document.createElement('parent-wrapper'));

    const wrapper1 = comp1.querySelector('#wrapper');
    await simulate.sleep(10);

    // Value should be clamped to 100
    expect(wrapper1?.data.insidePercentStr).toContain('100%');

    // Test value below 0
    const comp2 = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" value="{{ -10 }}" />`,
        data: {
          value: -10,
        },
      })
    );
    comp2.attach(document.createElement('parent-wrapper'));

    const wrapper2 = comp2.querySelector('#wrapper');
    await simulate.sleep(10);

    // Value should be clamped to 0
    expect(wrapper2?.data.insidePercentStr).toContain('0%');
  });
});

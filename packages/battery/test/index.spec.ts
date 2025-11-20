import path from 'path';
import simulate from 'miniprogram-simulate';

describe('battery', () => {
  const SmartBattery = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-battery',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

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
    
    expect(wrapper?.data.svgUrl).toBeTruthy();
    expect(wrapper?.data.svgUrl).toContain('background-image');
    expect(wrapper?.data.value).toBe(70);
    expect(wrapper?.data.size).toBe(10);
    expect(wrapper?.data.type).toBe('vertical');
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
    expect(wrapper?.data.svgUrl).toBeTruthy();
  });

  test('should clamp value to 100 when value > 100', async () => {
    const comp = simulate.render(
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
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      instance.setData({ value: 150 });
      await simulate.sleep(10);
      
      // The top value should be calculated as if value is 100
      const svgUrl = wrapper?.data.svgUrl;
      expect(svgUrl).toBeTruthy();
      // When value is 100, top should be 3
      expect(svgUrl).toContain('2 3 9 3');
    }
  });

  test('should clamp value to 0 when value < 0', async () => {
    const comp = simulate.render(
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
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      instance.setData({ value: -10 });
      await simulate.sleep(10);
      
      // The top value should be calculated as if value is 0
      const svgUrl = wrapper?.data.svgUrl;
      expect(svgUrl).toBeTruthy();
      // When value is 0, top should be 17
      expect(svgUrl).toContain('2 17 9 17');
    }
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
    expect(wrapper?.data.svgUrl).toContain('rotate(90deg)');
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
    expect(wrapper?.data.svgUrl).toContain('transform: 0');
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
    expect(wrapper?.data.svgUrl).toContain('width: 22px');
    expect(wrapper?.data.svgUrl).toContain('height: 38px');
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
    const svgUrl = wrapper?.data.svgUrl;
    expect(svgUrl).toBeTruthy();
    // Should contain the custom color
    expect(svgUrl).toContain('%23FF0000');
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
    
    // When value is 100, top is 3, which should use highColor
    const svgUrl = wrapper?.data.svgUrl;
    expect(svgUrl).toBeTruthy();
    expect(svgUrl).toContain('%2370CF98'); // #70CF98 encoded
  });

  test('should use middleColor when value is medium', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" value="{{ 15 }}" />`,
        data: {
          value: 15,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    // When value is 15, top should be around 14.9, which should use middleColor (14.2 < top <= 15.6)
    const svgUrl = wrapper?.data.svgUrl;
    expect(svgUrl).toBeTruthy();
    expect(svgUrl).toContain('%23F5A623'); // #F5A623 encoded
  });

  test('should use lowColor when value is low', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" value="{{ 5 }}" />`,
        data: {
          value: 5,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    // When value is 5, top should be around 16.3, which should use lowColor
    const svgUrl = wrapper?.data.svgUrl;
    expect(svgUrl).toBeTruthy();
    expect(svgUrl).toContain('%23FF4444'); // #FF4444 encoded
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
    
    const svgUrl = wrapper?.data.svgUrl;
    expect(svgUrl).toBeTruthy();
    expect(svgUrl).toContain('%2300FF00'); // #00FF00 encoded
  });

  test('should use custom middleColor', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" middle-color="#0000FF" value="{{ 15 }}" />`,
        data: {
          value: 15,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    const svgUrl = wrapper?.data.svgUrl;
    expect(svgUrl).toBeTruthy();
    expect(svgUrl).toContain('%230000FF'); // #0000FF encoded
  });

  test('should use custom lowColor', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" low-color="#FFFF00" value="{{ 5 }}" />`,
        data: {
          value: 5,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    const svgUrl = wrapper?.data.svgUrl;
    expect(svgUrl).toBeTruthy();
    expect(svgUrl).toContain('%23FFFF00'); // #FFFF00 encoded
  });

  test('should use custom backgroundColor', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" background-color="#CCCCCC" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    const svgUrl = wrapper?.data.svgUrl;
    expect(svgUrl).toBeTruthy();
    expect(svgUrl).toContain('%23CCCCCC'); // #CCCCCC encoded
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
      // Set onCalcColor via setData
      instance.setData({ onCalcColor });
      // Trigger init to recalculate
      instance.init();
      await simulate.sleep(10);
      
      const svgUrl = wrapper?.data.svgUrl;
      expect(svgUrl).toBeTruthy();
      expect(onCalcColor).toHaveBeenCalled();
      expect(svgUrl).toContain('%23ABCDEF'); // #ABCDEF encoded
    }
  });

  test('should use getBgColor from theme info when available', async () => {
    const WX: any = wx;
    WX.getThemeInfo = jest.fn(() => ({
      '--app-B1-N3': '#FFFFFF',
    }));

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
    
    const svgUrl = wrapper?.data.svgUrl;
    expect(svgUrl).toBeTruthy();
    expect(WX.getThemeInfo).toHaveBeenCalled();
    expect(svgUrl).toContain('%23FFFFFF'); // #FFFFFF encoded
  });

  test('should use getBgColor from system info when theme is light', async () => {
    const originalGetSystemInfoSync = wx.getSystemInfoSync;
    wx.getSystemInfoSync = jest.fn(() => ({
      theme: 'light',
    })) as any;

    const WX: any = wx;
    WX.getThemeInfo = jest.fn(() => null);

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
    
    const svgUrl = wrapper?.data.svgUrl;
    expect(svgUrl).toBeTruthy();
    expect(svgUrl).toContain('%23fff'); // #fff encoded

    wx.getSystemInfoSync = originalGetSystemInfoSync;
  });

  test('should use default getBgColor when theme is dark', async () => {
    const originalGetSystemInfoSync = wx.getSystemInfoSync;
    wx.getSystemInfoSync = jest.fn(() => ({
      theme: 'dark',
    })) as any;

    const WX: any = wx;
    WX.getThemeInfo = jest.fn(() => null);

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
    
    const svgUrl = wrapper?.data.svgUrl;
    expect(svgUrl).toBeTruthy();
    // rgba(0, 0, 0, 0.5) should be encoded in the SVG
    expect(svgUrl).toContain('rgba(0');

    wx.getSystemInfoSync = originalGetSystemInfoSync;
  });

  test('should update svgUrl when value changes', async () => {
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
    
    const initialSvgUrl = wrapper?.data.svgUrl;
    expect(initialSvgUrl).toBeTruthy();
    
    // Change value through component's setData to trigger observer
    wrapper?.setData({ value: 80 });
    await simulate.sleep(10);
    
    // Value should be updated
    expect(wrapper?.data.value).toBe(80);
    // SVG should be updated (different points for different value)
    const updatedSvgUrl = wrapper?.data.svgUrl;
    expect(updatedSvgUrl).toBeTruthy();
    // When value is 80, top should be around 5.8, which is different from value 50
    expect(updatedSvgUrl).not.toBe(initialSvgUrl);
  });

  test('should generate correct SVG structure', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-battery': SmartBattery,
        },
        template: `<smart-battery id="wrapper" value="{{ 70 }}" size="{{ 10 }}" />`,
        data: {
          value: 70,
          size: 10,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    const svgUrl = wrapper?.data.svgUrl;
    expect(svgUrl).toBeTruthy();
    expect(svgUrl).toContain('data:image/svg+xml');
    expect(svgUrl).toContain('width: 11px');
    expect(svgUrl).toContain('height: 19px');
    expect(svgUrl).toContain('background-repeat: no-repeat');
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
});


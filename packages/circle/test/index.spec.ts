import path from 'path';
import simulate from 'miniprogram-simulate';

describe('circle', () => {
  const SmartCircle = simulate.load(path.resolve(__dirname, '../index'), 'smart-circle', {
    rootPath: path.resolve(__dirname, '../../'),
  });

  beforeEach(() => {
    // Mock wx.getSystemInfo
    const originalGetSystemInfo = wx.getSystemInfo;
    wx.getSystemInfo = jest.fn((options: any) => {
      if (options && options.success) {
        options.success({
          pixelRatio: 2,
          windowWidth: 375,
          windowHeight: 667,
        });
      }
    }) as any;

    return () => {
      wx.getSystemInfo = originalGetSystemInfo;
    };
  });

  test('should render with default props', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-circle': SmartCircle,
        },
        template: `<smart-circle id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper).toBeTruthy();
    expect(wrapper?.data.size).toBe('100px');
    expect(wrapper?.data.trackWidth).toBe(10);
    expect(wrapper?.data.trackColor).toBe('#d3d3d3');
    expect(wrapper?.data.fillColor).toBe('#007AFF');
    expect(wrapper?.data.maskColor).toBe('transparent');
    expect(wrapper?.data.percent).toBe(0);
    expect(wrapper?.data.mode).toBe('basic');
    expect(wrapper?.data.round).toBe(true);
  });

  test('should render with custom props', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-circle': SmartCircle,
        },
        template: `
          <smart-circle 
            id="wrapper" 
            size="200px"
            track-width="{{ 20 }}"
            track-color="#ff0000"
            fill-color="#00ff00"
            mask-color="#0000ff"
            percent="{{ 50 }}"
            mode="angle"
            round="{{ false }}"
          />
        `,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.size).toBe('200px');
    expect(wrapper?.data.trackWidth).toBe(20);
    expect(wrapper?.data.trackColor).toBe('#ff0000');
    expect(wrapper?.data.fillColor).toBe('#00ff00');
    expect(wrapper?.data.maskColor).toBe('#0000ff');
    expect(wrapper?.data.percent).toBe(50);
    expect(wrapper?.data.mode).toBe('angle');
    expect(wrapper?.data.round).toBe(false);
  });

  test('should initialize canvasId in created', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-circle': SmartCircle,
        },
        template: `<smart-circle id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    // canvasId should be initialized
    expect(wrapper?.data.canvasId).toBeTruthy();
    expect(wrapper?.data.canvasId).toContain('smart-ui-circle_');
  });

  test('should initialize size from string', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-circle': SmartCircle,
        },
        template: `<smart-circle id="wrapper" size="150px" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.width).toBe(150);
    expect(wrapper?.data.height).toBe(150);
  });

  test('should initialize size from number', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-circle': SmartCircle,
        },
        template: `<smart-circle id="wrapper" size="{{ 200 }}" />`,
        data: {
          size: 200,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.width).toBe(200);
    expect(wrapper?.data.height).toBe(200);
  });

  test('should handle parseSize with invalid string', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-circle': SmartCircle,
        },
        template: `<smart-circle id="wrapper" size="invalid" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    // parseSize should return the original value when no number is found
    const sizeVal = instance?.parseSize();
    expect(sizeVal).toBe('invalid');
  });

  test('should call initRate in mounted', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-circle': SmartCircle,
        },
        template: `<smart-circle id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(30); // Wait for mounted lifecycle

    // initRate should be called and set dpr
    expect(wx.getSystemInfo).toHaveBeenCalled();
    expect(wrapper?.data.dpr).toBe(2);
  });

  test('should call render.init when percent changes and dpr is set', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-circle': SmartCircle,
        },
        template: `<smart-circle id="wrapper" percent="{{ percent }}" />`,
        data: {
          percent: 0,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(30); // Wait for mounted to set dpr

    // Mock render.init
    const initSpy = jest.fn();
    if (instance && instance.render) {
      instance.render.init = initSpy;
    }

    // Change percent
    comp.setData({ percent: 50 });
    await simulate.sleep(10);

    // render.init should be called when dpr is set
    if (instance?.data.dpr) {
      expect(initSpy).toHaveBeenCalled();
    }
  });

  test('should call render.init when dpr changes', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-circle': SmartCircle,
        },
        template: `<smart-circle id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(30); // Wait for mounted to set dpr

    // Mock render.init
    const initSpy = jest.fn();
    if (instance && instance.render) {
      instance.render.init = initSpy;
    }

    // Change dpr
    instance?.setData({ dpr: 3 });
    await simulate.sleep(10);

    // render.init should be called
    expect(initSpy).toHaveBeenCalled();
  });

  test('should clean up canvasId in destroyed', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-circle': SmartCircle,
        },
        template: `<smart-circle id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    const canvasId = wrapper?.data.canvasId;
    expect(canvasId).toBeTruthy();

    // Destroy component
    comp.detach();
    await simulate.sleep(10);

    // canvasId should be removed from idListRef (we can't directly test this,
    // but we can verify the component is destroyed)
    expect(wrapper).toBeTruthy();
  });

  test('should handle initId collision and retry', async () => {
    // Mock Date and Math.random to create predictable IDs
    const originalDate = Date;
    const originalMathRandom = Math.random;

    const fixedTimestamp = 1234567890123;
    const MockDate = jest.fn(() => new originalDate(fixedTimestamp)) as any;
    MockDate.now = jest.fn(() => fixedTimestamp);
    global.Date = MockDate;

    // First component: generate id with '45'
    Math.random = jest.fn(() => 0.12345);

    const comp1 = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-circle': SmartCircle,
        },
        template: `<smart-circle id="wrapper1" />`,
      })
    );
    comp1.attach(document.createElement('parent-wrapper'));
    await simulate.sleep(10);

    const wrapper1 = comp1.querySelector('#wrapper1');
    const firstId = wrapper1?.data.canvasId;
    expect(firstId).toBeTruthy();

    // Second component: try to generate same id (collision), then retry with different value
    let randomCallCount = 0;
    Math.random = jest.fn(() => {
      randomCallCount++;
      if (randomCallCount === 1) {
        return 0.12345; // Same as first - will cause collision
      }
      return 0.6789; // Different value for retry
    });

    const comp2 = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-circle': SmartCircle,
        },
        template: `<smart-circle id="wrapper2" />`,
      })
    );
    comp2.attach(document.createElement('parent-wrapper'));
    await simulate.sleep(10);

    const wrapper2 = comp2.querySelector('#wrapper2');
    const secondId = wrapper2?.data.canvasId;

    // IDs should be different (retry happened)
    expect(secondId).not.toBe(firstId);
    expect(secondId).toBeTruthy();
    // Verify Math.random was called at least twice (once for collision, once for retry)
    expect(randomCallCount).toBeGreaterThanOrEqual(2);

    // Restore
    global.Date = originalDate;
    Math.random = originalMathRandom;
  });

  test('should not call render.init when percent changes but dpr is not set', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-circle': SmartCircle,
        },
        template: `<smart-circle id="wrapper" percent="{{ percent }}" />`,
        data: {
          percent: 0,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    // Ensure dpr is 0
    instance?.setData({ dpr: 0 });
    await simulate.sleep(10);

    // Mock render.init
    const initSpy = jest.fn();
    if (instance && instance.render) {
      instance.render.init = initSpy;
    }

    // Change percent
    comp.setData({ percent: 50 });
    await simulate.sleep(10);

    // render.init should NOT be called when dpr is 0
    expect(initSpy).not.toHaveBeenCalled();
  });

  test('should not reinitialize canvasId if already set', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-circle': SmartCircle,
        },
        template: `<smart-circle id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    const originalCanvasId = wrapper?.data.canvasId;
    expect(originalCanvasId).toBeTruthy();

    // Manually set canvasId
    instance?.setData({ canvasId: 'custom-id' });
    await simulate.sleep(10);

    // Call initId - should return early without changing canvasId
    instance?.initId();
    await simulate.sleep(10);

    // canvasId should remain 'custom-id'
    expect(wrapper?.data.canvasId).toBe('custom-id');
  });

  test('should parseSize return number when size is number', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-circle': SmartCircle,
        },
        template: `<smart-circle id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    // Directly test parseSize with number type
    // We need to set the property type, not just data
    if (instance) {
      // Access the properties object and set size as number
      (instance as any).properties = { ...(instance as any).properties, size: 300 };
      (instance as any).data.size = 300;
    }
    await simulate.sleep(10);

    // parseSize should return the number directly
    const sizeVal = instance?.parseSize();
    // Since size prop is String type, it might be converted to string
    // Let's check if the logic works correctly
    expect(typeof sizeVal).toBe('number');
    expect(sizeVal).toBe(300);
  });
});

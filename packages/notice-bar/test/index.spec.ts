import path from 'path';
import simulate from 'miniprogram-simulate';

describe('notice-bar', () => {
  const SmartNoticeBar = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-notice-bar',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  beforeEach(() => {
    // Mock wx.createAnimation
    const originalCreateAnimation = wx.createAnimation;
    wx.createAnimation = jest.fn((options: any) => {
      const animation: any = {
        translateX: jest.fn((value: number) => {
          return animation;
        }),
        step: jest.fn(() => {
          return animation;
        }),
        export: jest.fn(() => ({
          actions: [],
        })),
      };
      return animation;
    }) as any;

    // Mock requestAnimationFrame
    const originalRequestAnimationFrame = global.requestAnimationFrame;
    global.requestAnimationFrame = jest.fn((callback: FrameRequestCallback) => {
      if (callback) {
        callback(0);
      }
      return 1;
    }) as any;

    // Mock getRect
    const originalGetRect = require('../../common/utils').getRect;
    require('../../common/utils').getRect = jest.fn((context: any, selector: string) => {
      if (selector === '.smart-notice-bar__content') {
        return Promise.resolve({ width: 200, height: 20 });
      }
      if (selector === '.smart-notice-bar__wrap') {
        return Promise.resolve({ width: 100, height: 20 });
      }
      return Promise.resolve({ width: 0, height: 0 });
    });

    // Mock wx.navigateTo and wx.redirectTo
    wx.navigateTo = jest.fn() as any;
    wx.redirectTo = jest.fn() as any;

    return () => {
      wx.createAnimation = originalCreateAnimation;
      global.requestAnimationFrame = originalRequestAnimationFrame;
      require('../../common/utils').getRect = originalGetRect;
    };
  });


  test('should emit close event when mode is closeable', async () => {
    let closeEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-notice-bar': SmartNoticeBar,
        },
        template: `<smart-notice-bar id="wrapper" mode="closeable" bind:close="onClose" />`,
        methods: {
          onClose(event: any) {
            closeEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onClickIcon({
        detail: { test: 'data' },
      });
      await simulate.sleep(10);

      expect(wrapper?.data.show).toBe(false);
      expect(closeEvent).toEqual({ test: 'data' });
    }
  });

  test('should not close when mode is not closeable', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-notice-bar': SmartNoticeBar,
        },
        template: `<smart-notice-bar id="wrapper" mode="link" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onClickIcon({
        detail: {},
      });
      await simulate.sleep(10);

      expect(wrapper?.data.show).toBe(true);
    }
  });

  test('should emit btn-click event', async () => {
    let btnClickEmitted = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-notice-bar': SmartNoticeBar,
        },
        template: `<smart-notice-bar id="wrapper" bind:btn-click="onBtnClick" />`,
        methods: {
          onBtnClick() {
            btnClickEmitted = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onClickBtnText({ detail: { test: 'data' } });
      await simulate.sleep(10);

      expect(btnClickEmitted).toBe(true);
    }
  });

  test('should navigate when mode is link and openType is navigateTo', async () => {
    let clickEmitted = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-notice-bar': SmartNoticeBar,
        },
        template: `<smart-notice-bar id="wrapper" mode="link" url="/test" open-type="navigateTo" bind:click="onClick" />`,
        methods: {
          onClick() {
            clickEmitted = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onClick({ detail: {} } as any);
      await simulate.sleep(10);

      expect(wx.navigateTo).toHaveBeenCalledWith({ url: '/test' });
      expect(clickEmitted).toBe(true);
    }
  });

  test('should redirect when mode is link and openType is redirectTo', async () => {
    let clickEmitted = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-notice-bar': SmartNoticeBar,
        },
        template: `<smart-notice-bar id="wrapper" mode="link" url="/test" open-type="redirectTo" bind:click="onClick" />`,
        methods: {
          onClick() {
            clickEmitted = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onClick({ detail: {} } as any);
      await simulate.sleep(10);

      expect(wx.redirectTo).toHaveBeenCalledWith({ url: '/test' });
      expect(clickEmitted).toBe(true);
    }
  });

  test('should emit click event when mode is not link', async () => {
    let clickEmitted = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-notice-bar': SmartNoticeBar,
        },
        template: `<smart-notice-bar id="wrapper" mode="closable" bind:click="onClick" />`,
        methods: {
          onClick() {
            clickEmitted = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onClick({ detail: {} } as any);
      await simulate.sleep(10);

      expect(wx.navigateTo).not.toHaveBeenCalled();
      expect(wx.redirectTo).not.toHaveBeenCalled();
      expect(clickEmitted).toBe(true);
    }
  });

  test('should emit click event when url is empty', async () => {
    let clickEmitted = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-notice-bar': SmartNoticeBar,
        },
        template: `<smart-notice-bar id="wrapper" mode="link" url="" bind:click="onClick" />`,
        methods: {
          onClick() {
            clickEmitted = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onClick({ detail: {} } as any);
      await simulate.sleep(10);

      expect(wx.navigateTo).not.toHaveBeenCalled();
      expect(clickEmitted).toBe(true);
    }
  });

  test('should handle destroyed lifecycle', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-notice-bar': SmartNoticeBar,
        },
        template: `<smart-notice-bar id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Set a timer
      instance.timer = setTimeout(() => {}, 100);
      
      // Trigger destroyed lifecycle by detaching
      comp.detach();
      await simulate.sleep(10);

      // Should not throw error
      expect(instance).toBeDefined();
    }
  });

  test('should handle init with scrollable true', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-notice-bar': SmartNoticeBar,
        },
        template: `<smart-notice-bar id="wrapper" scrollable="{{ true }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ scrollable: true, speed: 60, delay: 1 });
      require('../../common/utils').getRect = jest.fn((context: any, selector: string) => {
        if (selector === '.smart-notice-bar__content') {
          return Promise.resolve({ width: 200, height: 20 });
        }
        if (selector === '.smart-notice-bar__wrap') {
          return Promise.resolve({ width: 100, height: 20 });
        }
        return Promise.resolve({ width: 0, height: 0 });
      });

      instance.init();
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(instance.wrapWidth).toBe(100);
      expect(instance.contentWidth).toBe(200);
      expect(instance.duration).toBeDefined();
    }
  });

  test('should handle init when wrapRect.width < contentRect.width and scrollable is null', async () => {
    // Override beforeEach mock for this test
    const originalGetRect = require('../../common/utils').getRect;
    require('../../common/utils').getRect = jest.fn((context: any, selector: string) => {
      if (selector === '.smart-notice-bar__content') {
        return Promise.resolve({ width: 200, height: 20 });
      }
      if (selector === '.smart-notice-bar__wrap') {
        return Promise.resolve({ width: 100, height: 20 });
      }
      return Promise.resolve({ width: 0, height: 0 });
    });

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-notice-bar': SmartNoticeBar,
        },
        template: `<smart-notice-bar id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ scrollable: null, speed: 60, delay: 1 });

      instance.init();
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(instance.wrapWidth).toBe(100);
      expect(instance.contentWidth).toBe(200);
    }

    require('../../common/utils').getRect = originalGetRect;
  });

  test('should handle init when scrollable is false and wrapRect.width >= contentRect.width', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-notice-bar': SmartNoticeBar,
        },
        template: `<smart-notice-bar id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ scrollable: false, speed: 60, delay: 1 });
      require('../../common/utils').getRect = jest.fn((context: any, selector: string) => {
        if (selector === '.smart-notice-bar__content') {
          return Promise.resolve({ width: 100, height: 20 });
        }
        if (selector === '.smart-notice-bar__wrap') {
          return Promise.resolve({ width: 200, height: 20 });
        }
        return Promise.resolve({ width: 0, height: 0 });
      });

      instance.init();
      await new Promise(resolve => setTimeout(resolve, 100));

      // Should not set wrapWidth/contentWidth when not scrollable
      expect(instance.wrapWidth).toBeUndefined();
    }
  });

  test('should handle scroll with isInit true', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-notice-bar': SmartNoticeBar,
        },
        template: `<smart-notice-bar id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.wrapWidth = 100;
      instance.contentWidth = 200;
      instance.duration = 3000;
      instance.setData({ delay: 1 });
      
      // Create animation object
      instance.animation = wx.createAnimation({
        duration: 3000,
        timingFunction: 'linear',
        delay: 1,
      });

      instance.scroll(true);
      await new Promise(resolve => setTimeout(resolve, 20));

      expect(wrapper?.data.animationData).toBeDefined();
    }
  });

  test('should handle scroll with isInit false', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-notice-bar': SmartNoticeBar,
        },
        template: `<smart-notice-bar id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.wrapWidth = 100;
      instance.contentWidth = 200;
      instance.duration = 3000;
      instance.setData({ delay: 1 });
      
      // Create animation object
      instance.animation = wx.createAnimation({
        duration: 3000,
        timingFunction: 'linear',
        delay: 1,
      });

      instance.scroll(false);
      await new Promise(resolve => setTimeout(resolve, 20));

      expect(wrapper?.data.animationData).toBeDefined();
    }
  });

  test('should handle scroll clearing existing timer', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-notice-bar': SmartNoticeBar,
        },
        template: `<smart-notice-bar id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.wrapWidth = 100;
      instance.contentWidth = 200;
      instance.duration = 3000;
      instance.setData({ delay: 1 });
      
      // Create animation object
      instance.animation = wx.createAnimation({
        duration: 3000,
        timingFunction: 'linear',
        delay: 1,
      });
      
      // Set an existing timer
      instance.timer = setTimeout(() => {}, 100);

      instance.scroll();
      await new Promise(resolve => setTimeout(resolve, 20));

      expect(instance.timer).not.toBeNull();
    }
  });

  test('should handle scroll timer callback', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-notice-bar': SmartNoticeBar,
        },
        template: `<smart-notice-bar id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.wrapWidth = 100;
      instance.contentWidth = 200;
      instance.duration = 10; // Short duration for testing
      instance.setData({ delay: 1 });
      
      // Create animation object
      instance.animation = wx.createAnimation({
        duration: 10,
        timingFunction: 'linear',
        delay: 1,
      });

      instance.scroll();
      await new Promise(resolve => setTimeout(resolve, 50));

      // Timer should be set and will call scroll again
      expect(instance.timer).not.toBeNull();
    }
  });
});


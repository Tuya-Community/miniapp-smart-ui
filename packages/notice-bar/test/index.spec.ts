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
    require('../../common/utils').getRect = jest.fn(() => {
      return Promise.resolve([
        { width: 200, height: 20 },
        { width: 100, height: 20 },
      ]);
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
});


import path from 'path';
import simulate from 'miniprogram-simulate';

describe('notify', () => {
  const SmartNotify = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-notify',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  beforeEach(() => {
    // Mock wx.nextTick
    const originalNextTick = wx.nextTick;
    wx.nextTick = jest.fn((callback: () => void) => {
      if (callback) {
        callback();
      }
    }) as any;

    // Mock getSystemInfoSync
    const originalGetSystemInfoSync = wx.getSystemInfoSync;
    wx.getSystemInfoSync = jest.fn(() => ({
      statusBarHeight: 20,
    })) as any;

    return () => {
      wx.nextTick = originalNextTick;
      wx.getSystemInfoSync = originalGetSystemInfoSync;
    };
  });

  test('should show notify', async () => {
    let onOpenedCalled = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-notify': SmartNotify,
        },
        template: `<smart-notify id="wrapper" />`,
        data: {
          onOpened: () => {
            onOpenedCalled = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ onOpened: () => { onOpenedCalled = true; } });
      instance.show();
      await simulate.sleep(10);

      expect(wrapper?.data.show).toBe(true);
      expect(onOpenedCalled).toBe(true);
    }
  });

  test('should hide notify after duration', () => {
    jest.useFakeTimers();
    let onCloseCalled = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-notify': SmartNotify,
        },
        template: `<smart-notify id="wrapper" duration="{{ 1000 }}" />`,
        data: {
          duration: 1000,
          onClose: () => {
            onCloseCalled = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      instance.setData({ onClose: () => { onCloseCalled = true; } });
      instance.show();

      expect(wrapper?.data.show).toBe(true);

      // Fast-forward time
      jest.advanceTimersByTime(1000);

      expect(wrapper?.data.show).toBe(false);
      expect(onCloseCalled).toBe(true);
    }

    jest.useRealTimers();
  });

  test('should not hide notify when duration is Infinity', () => {
    jest.useFakeTimers();
    let onCloseCalled = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-notify': SmartNotify,
        },
        template: `<smart-notify id="wrapper" duration="{{ Infinity }}" />`,
        data: {
          duration: Infinity,
          onClose: () => {
            onCloseCalled = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      instance.setData({ onClose: () => { onCloseCalled = true; } });
      instance.show();

      expect(wrapper?.data.show).toBe(true);

      // Fast-forward time
      jest.advanceTimersByTime(5000);

      // Should still be showing
      expect(wrapper?.data.show).toBe(true);
      expect(onCloseCalled).toBe(false);
    }

    jest.useRealTimers();
  });

  test('should not hide notify when duration is 0', () => {
    jest.useFakeTimers();
    let onCloseCalled = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-notify': SmartNotify,
        },
        template: `<smart-notify id="wrapper" duration="{{ 0 }}" />`,
        data: {
          duration: 0,
          onClose: () => {
            onCloseCalled = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      instance.setData({ onClose: () => { onCloseCalled = true; } });
      instance.show();

      expect(wrapper?.data.show).toBe(true);

      // Fast-forward time
      jest.advanceTimersByTime(1000);

      // Should still be showing
      expect(wrapper?.data.show).toBe(true);
      expect(onCloseCalled).toBe(false);
    }

    jest.useRealTimers();
  });

  test('should hide notify manually', async () => {
    let onCloseCalled = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-notify': SmartNotify,
        },
        template: `<smart-notify id="wrapper" />`,
        data: {
          onClose: () => {
            onCloseCalled = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ onClose: () => { onCloseCalled = true; } });
      instance.show();
      await simulate.sleep(10);

      expect(wrapper?.data.show).toBe(true);

      instance.hide();
      await simulate.sleep(10);

      expect(wrapper?.data.show).toBe(false);
      expect(onCloseCalled).toBe(true);
    }
  });

  test('should call onClick when tapped', async () => {
    let onClickCalled = false;
    let onClickDetail: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-notify': SmartNotify,
        },
        template: `<smart-notify id="wrapper" />`,
        data: {
          onClick: (detail: any) => {
            onClickCalled = true;
            onClickDetail = detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({
        onClick: (detail: any) => {
          onClickCalled = true;
          onClickDetail = detail;
        },
      });

      instance.onTap({
        detail: { test: 'data' },
      });
      await simulate.sleep(10);

      expect(onClickCalled).toBe(true);
      expect(onClickDetail).toEqual({ test: 'data' });
    }
  });

  test('should not call onClick when onClick is not set', () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-notify': SmartNotify,
        },
        template: `<smart-notify id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      instance.setData({ onClick: null });

      // Should not throw
      expect(() => {
        instance.onTap({
          detail: { test: 'data' },
        });
      }).not.toThrow();
    }
  });

  test('should clear timer when show is called multiple times', () => {
    jest.useFakeTimers();
    let hideCallCount = 0;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-notify': SmartNotify,
        },
        template: `<smart-notify id="wrapper" duration="{{ 1000 }}" />`,
        data: {
          duration: 1000,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      // Mock hide method to count calls
      const originalHide = instance.hide;
      instance.hide = jest.fn(() => {
        hideCallCount++;
        originalHide.call(instance);
      });

      instance.show();

      // Show again before timer expires
      instance.show();

      // Fast-forward time - should only hide once
      jest.advanceTimersByTime(1000);

      expect(hideCallCount).toBe(1);
    }

    jest.useRealTimers();
  });
});


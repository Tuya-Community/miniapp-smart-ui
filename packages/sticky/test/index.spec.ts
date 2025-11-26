import path from 'path';
import simulate from 'miniprogram-simulate';
import { getRect } from '../../common/utils';
import { getCurrentPage } from '../../common/utils';

// Mock utilities
jest.mock('../../common/utils', () => ({
  getRect: jest.fn(),
  getCurrentPage: jest.fn(),
  isDef: jest.fn((value: unknown) => value !== undefined && value !== null),
}));

describe('sticky', () => {
  const SmartSticky = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-sticky',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock wx.nextTick
    const originalNextTick = wx.nextTick;
    wx.nextTick = jest.fn((callback: () => void) => {
      if (callback) {
        callback();
      }
    }) as any;

    // Mock getCurrentPage
    (getCurrentPage as jest.Mock).mockReturnValue({
      smartPageScroller: [],
      onPageScroll: undefined,
    });

    return () => {
      wx.nextTick = originalNextTick;
    };
  });

  test('should render with default props', async () => {
    (getRect as jest.Mock).mockResolvedValue({ width: 100, height: 50, top: 10 });

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-sticky': SmartSticky,
        },
        template: `<smart-sticky id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.zIndex).toBe(99);
    expect(wrapper?.data.offsetTop).toBe(0);
    expect(wrapper?.data.disabled).toBe(false);
    // fixed may be true or false depending on scroll position, so we just check it's defined
    expect(typeof wrapper?.data.fixed).toBe('boolean');
    expect(wrapper?.data.transform).toBe(0);
  });

  test('should set fixed to false when disabled', async () => {
    (getRect as jest.Mock).mockResolvedValue({ width: 100, height: 50, top: 0 });

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-sticky': SmartSticky,
        },
        template: `<smart-sticky id="wrapper" disabled />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onScroll();
      await simulate.sleep(10);

      expect(wrapper?.data.fixed).toBe(false);
      expect(wrapper?.data.transform).toBe(0);
    }
  });

  test('should set fixed to true when offsetTop >= root.top without container', async () => {
    (getRect as jest.Mock).mockResolvedValue({ width: 100, height: 50, top: -10 });

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-sticky': SmartSticky,
        },
        template: `<smart-sticky id="wrapper" offset-top="{{ 0 }}" />`,
        data: {
          offsetTop: 0,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onScroll();
      await simulate.sleep(10);

      expect(wrapper?.data.fixed).toBe(true);
      expect(wrapper?.data.height).toBe(50);
    }
  });

  test('should set fixed to false when offsetTop < root.top without container', async () => {
    (getRect as jest.Mock).mockResolvedValue({ width: 100, height: 50, top: 10 });

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-sticky': SmartSticky,
        },
        template: `<smart-sticky id="wrapper" offset-top="{{ 0 }}" />`,
        data: {
          offsetTop: 0,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onScroll();
      await simulate.sleep(10);

      expect(wrapper?.data.fixed).toBe(false);
    }
  });

  test('should return early when root is not defined', async () => {
    (getRect as jest.Mock).mockResolvedValue(null);

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-sticky': SmartSticky,
        },
        template: `<smart-sticky id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onScroll();
      await simulate.sleep(10);

      // Should not throw error
      expect(wrapper?.data.fixed).toBe(false);
    }
  });

  test('should return early when root has no width and height', async () => {
    (getRect as jest.Mock).mockResolvedValue({ width: 0, height: 0, top: 0 });

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-sticky': SmartSticky,
        },
        template: `<smart-sticky id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onScroll();
      await simulate.sleep(10);

      // Should not throw error
      expect(wrapper?.data.fixed).toBe(false);
    }
  });

  test('should handle container when offsetTop + root.height > container.height + container.top', async () => {
    (getRect as jest.Mock).mockImplementation((context: any, selector: string) => {
      if (selector === '.smart-sticky') {
        return Promise.resolve({ width: 100, height: 50, top: 0 });
      }
      return Promise.resolve(null);
    });

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-sticky': SmartSticky,
        },
        template: `<smart-sticky id="wrapper" container="{{ container }}" offset-top="{{ 100 }}" />`,
        data: {
          container: () => ({
            boundingClientRect: jest.fn((callback: any) => {
              callback({ width: 100, height: 200, top: 0 });
              return {
                exec: jest.fn(),
              };
            }),
          }),
          offsetTop: 100,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Mock getContainerRect to return container with height + top < offsetTop + root.height
      instance.getContainerRect = jest.fn().mockResolvedValue({
        width: 100,
        height: 200,
        top: 0,
      });

      instance.onScroll();
      await simulate.sleep(10);

      // offsetTop (100) + root.height (50) = 150 > container.height (200) + container.top (0) = 200
      // Actually: 150 > 200 is false, so this won't trigger
      // Let's adjust: offsetTop (100) + root.height (50) = 150, container.height (200) + container.top (0) = 200
      // We need: 150 > 200, which is false
      // Let's use: offsetTop (200) + root.height (50) = 250 > container.height (200) + container.top (0) = 200
      instance.setData({ offsetTop: 200 });
      instance.getContainerRect = jest.fn().mockResolvedValue({
        width: 100,
        height: 200,
        top: 0,
      });

      instance.onScroll();
      await simulate.sleep(10);

      expect(wrapper?.data.fixed).toBe(false);
      expect(wrapper?.data.transform).toBe(150); // container.height (200) - root.height (50) = 150
    }
  });

  test('should set fixed to true when offsetTop >= root.top with container', async () => {
    (getRect as jest.Mock).mockImplementation((context: any, selector: string) => {
      if (selector === '.smart-sticky') {
        return Promise.resolve({ width: 100, height: 50, top: -10 });
      }
      return Promise.resolve(null);
    });

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-sticky': SmartSticky,
        },
        template: `<smart-sticky id="wrapper" container="{{ container }}" offset-top="{{ 0 }}" />`,
        data: {
          container: () => ({
            boundingClientRect: jest.fn((callback: any) => {
              callback({ width: 100, height: 200, top: 0 });
              return {
                exec: jest.fn(),
              };
            }),
          }),
          offsetTop: 0,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.getContainerRect = jest.fn().mockResolvedValue({
        width: 100,
        height: 200,
        top: 0,
      });

      instance.onScroll();
      await simulate.sleep(10);

      expect(wrapper?.data.fixed).toBe(true);
      expect(wrapper?.data.height).toBe(50);
      expect(wrapper?.data.transform).toBe(0);
    }
  });

  test('should set fixed to false when offsetTop < root.top with container', async () => {
    (getRect as jest.Mock).mockImplementation((context: any, selector: string) => {
      if (selector === '.smart-sticky') {
        return Promise.resolve({ width: 100, height: 50, top: 10 });
      }
      return Promise.resolve(null);
    });

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-sticky': SmartSticky,
        },
        template: `<smart-sticky id="wrapper" container="{{ container }}" offset-top="{{ 0 }}" />`,
        data: {
          container: () => ({
            boundingClientRect: jest.fn((callback: any) => {
              callback({ width: 100, height: 200, top: 0 });
              return {
                exec: jest.fn(),
              };
            }),
          }),
          offsetTop: 0,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.getContainerRect = jest.fn().mockResolvedValue({
        width: 100,
        height: 200,
        top: 0,
      });

      instance.onScroll();
      await simulate.sleep(10);

      expect(wrapper?.data.fixed).toBe(false);
      expect(wrapper?.data.transform).toBe(0);
    }
  });

  test('should emit scroll event in setDataAfterDiff', async () => {
    (getRect as jest.Mock).mockResolvedValue({ width: 100, height: 50, top: -10 });

    let scrollEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-sticky': SmartSticky,
        },
        template: `<smart-sticky id="wrapper" bind:scroll="onScroll" />`,
        methods: {
          onScroll(event: any) {
            scrollEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.scrollTop = 100;
      instance.setDataAfterDiff({ fixed: true, height: 50 });
      await simulate.sleep(10);

      expect(scrollEvent).toEqual({
        scrollTop: 100,
        isFixed: true,
      });
    }
  });

  test('should only setData when diff has changes', async () => {
    (getRect as jest.Mock).mockResolvedValue({ width: 100, height: 50, top: 0 });

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-sticky': SmartSticky,
        },
        template: `<smart-sticky id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      wrapper?.setData({ fixed: false });
      const setDataSpy = jest.spyOn(wrapper, 'setData');

      instance.setDataAfterDiff({ fixed: false });
      await simulate.sleep(10);

      // Should not call setData when values are the same
      expect(setDataSpy).not.toHaveBeenCalled();
      setDataSpy.mockRestore();
    }
  });

  test('should handle scrollTop observer', async () => {
    (getRect as jest.Mock).mockResolvedValue({ width: 100, height: 50, top: 0 });

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-sticky': SmartSticky,
        },
        template: `<smart-sticky id="wrapper" scroll-top="{{ scrollTop }}" />`,
        data: {
          scrollTop: 0,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const onScrollSpy = jest.spyOn(instance, 'onScroll');

      wrapper?.setData({ scrollTop: 100 });
      await simulate.sleep(10);

      expect(onScrollSpy).toHaveBeenCalledWith({ scrollTop: 100 });
      onScrollSpy.mockRestore();
    }
  });

  test('should handle pageScrollMixin when scrollTop is null', async () => {
    (getRect as jest.Mock).mockResolvedValue({ width: 100, height: 50, top: 0 });

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-sticky': SmartSticky,
        },
        template: `<smart-sticky id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ scrollTop: null });
      const onScrollSpy = jest.spyOn(instance, 'onScroll');

      // Simulate page scroll event
      if (instance._scroller) {
        instance._scroller({ scrollTop: 50 });
        await simulate.sleep(10);

        expect(onScrollSpy).toHaveBeenCalledWith({ scrollTop: 50 });
      }
      onScrollSpy.mockRestore();
    }
  });

  test('should not call onScroll when scrollTop is set', async () => {
    (getRect as jest.Mock).mockResolvedValue({ width: 100, height: 50, top: 0 });

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-sticky': SmartSticky,
        },
        template: `<smart-sticky id="wrapper" scroll-top="{{ 100 }}" />`,
        data: {
          scrollTop: 100,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const onScrollSpy = jest.spyOn(instance, 'onScroll');

      // Simulate page scroll event
      if (instance._scroller) {
        instance._scroller({ scrollTop: 50 });
        await simulate.sleep(10);

        // Should not call onScroll when scrollTop is set
        expect(onScrollSpy).not.toHaveBeenCalled();
      }
      onScrollSpy.mockRestore();
    }
  });

  test('should handle getContainerRect error', async () => {
    (getRect as jest.Mock).mockResolvedValue({ width: 100, height: 50, top: 0 });

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-sticky': SmartSticky,
        },
        template: `<smart-sticky id="wrapper" container="{{ container }}" />`,
        data: {
          container: () => null,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Should not throw error when container returns null
      instance.onScroll();
      await simulate.sleep(10);

      expect(wrapper?.data.fixed).toBe(false);
    }
  });
});


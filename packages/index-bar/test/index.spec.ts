import path from 'path';
import simulate from 'miniprogram-simulate';

describe('index-bar', () => {
  const SmartIndexBar = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-index-bar',
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

    // Mock getRect
    const originalGetRect = require('../../common/utils').getRect;
    require('../../common/utils').getRect = jest.fn((context: any, selector: string) => {
      if (selector === '.smart-index-anchor-wrapper') {
        return Promise.resolve({ width: 100, height: 50, top: 0 });
      }
      if (selector === '.smart-index-bar') {
        return Promise.resolve({ width: 200, height: 400, top: 0 });
      }
      if (selector === '.smart-index-bar__sidebar') {
        return Promise.resolve({ width: 30, height: 500, top: 0 });
      }
      return Promise.resolve({ width: 0, height: 0, top: 0 });
    });

    return () => {
      wx.nextTick = originalNextTick;
      require('../../common/utils').getRect = originalGetRect;
    };
  });


  test('should not handle touch move when not scrollable', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-index-bar': SmartIndexBar,
        },
        template: `<smart-index-bar id="wrapper" scrollable="{{ false }}" />`,
        data: {
          scrollable: false,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const scrollToAnchorSpy = jest.spyOn(instance, 'scrollToAnchor');

      instance.onTouchMove({
        touches: [
          {
            clientY: 100,
          },
        ],
      });
      await simulate.sleep(10);

      expect(scrollToAnchorSpy).not.toHaveBeenCalled();
      scrollToAnchorSpy.mockRestore();
    }
  });

  test('should handle touch stop when scrollable', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-index-bar': SmartIndexBar,
        },
        template: `<smart-index-bar id="wrapper" scrollable="{{ true }}" />`,
        data: {
          scrollable: true,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.scrollToAnchorIndex = 0;
      instance.onTouchStop();
      await simulate.sleep(10);

      expect(instance.scrollToAnchorIndex).toBeNull();
    }
  });

  test('should not handle touch stop when not scrollable', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-index-bar': SmartIndexBar,
        },
        template: `<smart-index-bar id="wrapper" scrollable="{{ false }}" />`,
        data: {
          scrollable: false,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.scrollToAnchorIndex = 0;
      instance.onTouchStop();
      await simulate.sleep(10);

      // Should not change
      expect(instance.scrollToAnchorIndex).toBe(0);
    }
  });

});


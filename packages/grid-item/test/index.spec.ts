import path from 'path';
import simulate from 'miniprogram-simulate';

describe('grid-item', () => {
  const SmartGridItem = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-grid-item',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  beforeEach(() => {
    // Mock wx.navigateTo and wx.redirectTo
    wx.navigateTo = jest.fn() as any;
    wx.redirectTo = jest.fn() as any;
    wx.switchTab = jest.fn() as any;
    wx.reLaunch = jest.fn() as any;
  });

  test('should handle updateStyle without parent', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-grid-item': SmartGridItem,
        },
        template: `<smart-grid-item id="item" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const item = comp.querySelector('#item');
    const instance = item?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Mock getRelationNodes to return empty array (no parent)
      (instance as any).getRelationNodes = jest.fn(() => []);

      // Should not throw error
      expect(() => instance.updateStyle()).not.toThrow();
      await simulate.sleep(10);
    }
  });

  test('should handle updateStyle with parent', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-grid-item': SmartGridItem,
        },
        template: `<smart-grid-item id="item" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const item = comp.querySelector('#item');
    const instance = item?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Mock parent using getRelationNodes
      const mockParent = {
        data: {
          columnNum: 4,
          border: true,
          square: false,
          gutter: 10,
          clickable: true,
          center: true,
          direction: 'vertical',
          reverse: false,
          iconSize: '28px',
        },
        children: [instance],
      } as any;
      (instance as any).getRelationNodes = jest.fn(() => [mockParent]);
      
      // Access parent to trigger getter
      const _ = (instance as any).parent;

      instance.updateStyle();
      await simulate.sleep(10);

      expect(item?.data.columnNum).toBe(4);
      expect(item?.data.border).toBe(true);
      expect(item?.data.square).toBe(false);
      expect(item?.data.gutter).toBe(10);
      expect(item?.data.clickable).toBe(true);
      expect(item?.data.center).toBe(true);
      expect(item?.data.direction).toBe('vertical');
      expect(item?.data.reverse).toBe(false);
      expect(item?.data.iconSize).toBe('28px');
      expect(item?.data.index).toBe(0);
    }
  });

  test('should handle onClick', async () => {
    let clickEvent = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-grid-item': SmartGridItem,
        },
        template: `<smart-grid-item id="item" bind:click="onClick" />`,
        methods: {
          onClick() {
            clickEvent = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const item = comp.querySelector('#item');
    const instance = item?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onClick();
      await simulate.sleep(10);

      expect(clickEvent).toBe(true);
    }
  });

  test('should handle onClick with jumpLink', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-grid-item': SmartGridItem,
        },
        template: `<smart-grid-item id="item" url="/pages/index/index" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const item = comp.querySelector('#item');
    const instance = item?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ url: '/pages/index/index' });
      instance.onClick();
      await simulate.sleep(10);

      expect(wx.navigateTo).toHaveBeenCalled();
    }
  });
});


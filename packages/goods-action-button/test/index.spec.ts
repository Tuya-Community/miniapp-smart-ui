import path from 'path';
import simulate from 'miniprogram-simulate';

describe('goods-action-button', () => {
  const SmartGoodsActionButton = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-goods-action-button',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  beforeEach(() => {
    // Mock wx navigation methods
    const originalNavigateTo = wx.navigateTo;
    const originalRedirectTo = wx.redirectTo;
    const originalSwitchTab = wx.switchTab;
    const originalReLaunch = wx.reLaunch;

    wx.navigateTo = jest.fn() as any;
    wx.redirectTo = jest.fn() as any;
    wx.switchTab = jest.fn() as any;
    wx.reLaunch = jest.fn() as any;

    return () => {
      wx.navigateTo = originalNavigateTo;
      wx.redirectTo = originalRedirectTo;
      wx.switchTab = originalSwitchTab;
      wx.reLaunch = originalReLaunch;
    };
  });

  test('should render with default props', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-goods-action-button': SmartGoodsActionButton,
        },
        template: `<smart-goods-action-button id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.size).toBe('normal');
    expect(wrapper?.data.type).toBe('danger');
    expect(wrapper?.data.disabled).toBe(false);
    expect(wrapper?.data.loading).toBe(false);
    expect(wrapper?.data.plain).toBe(false);
  });

  test('should handle onClick', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-goods-action-button': SmartGoodsActionButton,
        },
        template: `<smart-goods-action-button id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const emitSpy = jest.spyOn(instance, '$emit');
      const mockEvent = { detail: { value: 'test' } } as any;
      instance.onClick(mockEvent);
      
      expect(emitSpy).toHaveBeenCalledWith('click', mockEvent.detail);
      emitSpy.mockRestore();
    }
  });

  test('should handle updateStyle when parent is null', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-goods-action-button': SmartGoodsActionButton,
        },
        template: `<smart-goods-action-button id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      // When there's no parent component, parent will be null
      // This tests the early return in updateStyle when parent == null
      expect(() => {
        instance.updateStyle();
      }).not.toThrow();
    }
  });

});


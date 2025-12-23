import path from 'path';
import simulate from 'miniprogram-simulate';

describe('mixins/link', () => {
  // Use cell component which uses link mixin
  const SmartCell = simulate.load(
    path.resolve(__dirname, '../../cell/index'),
    'smart-cell',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  beforeEach(() => {
    // Mock wx navigation methods
    wx.navigateTo = jest.fn() as any;
    wx.redirectTo = jest.fn() as any;
    wx.switchTab = jest.fn() as any;
    wx.reLaunch = jest.fn() as any;
    wx.navigateBack = jest.fn() as any;
    
    // Mock getCurrentPages
    (global as any).getCurrentPages = jest.fn(() => []);
  });

  test('should handle jumpLink with navigateTo when pages length <= 9', async () => {
    (global as any).getCurrentPages = jest.fn(() => new Array(9));
    
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cell': SmartCell,
        },
        template: `<smart-cell id="wrapper" url="/pages/test" link-type="navigateTo" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      instance.jumpLink();
      
      expect(wx.navigateTo).toHaveBeenCalledWith({ url: '/pages/test' });
    }
  });

  test('should handle jumpLink with redirectTo when pages length > 9 (line 15)', async () => {
    (global as any).getCurrentPages = jest.fn(() => new Array(10));
    
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cell': SmartCell,
        },
        template: `<smart-cell id="wrapper" url="/pages/test" link-type="navigateTo" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      instance.jumpLink();
      
      expect(wx.redirectTo).toHaveBeenCalledWith({ url: '/pages/test' });
      expect(wx.navigateTo).not.toHaveBeenCalled();
    }
  });

  test('should handle jumpLink with different link types', async () => {
    (global as any).getCurrentPages = jest.fn(() => []);
    
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cell': SmartCell,
        },
        template: `<smart-cell id="wrapper" url="/pages/test" link-type="switchTab" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      instance.jumpLink();
      
      expect(wx.switchTab).toHaveBeenCalledWith({ url: '/pages/test' });
    }
  });

  test('should not jump when url is empty', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cell': SmartCell,
        },
        template: `<smart-cell id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      instance.jumpLink();
      
      expect(wx.navigateTo).not.toHaveBeenCalled();
      expect(wx.redirectTo).not.toHaveBeenCalled();
    }
  });
});


import path from 'path';
import simulate from 'miniprogram-simulate';
import { getRect } from '../../common/utils';

// Mock utilities
jest.mock('../../common/utils', () => ({
  getRect: jest.fn(),
}));

describe('tabbar', () => {
  const SmartTabbar = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-tabbar',
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

    (getRect as jest.Mock).mockResolvedValue({ height: 60 });

    return () => {
      wx.nextTick = originalNextTick;
    };
  });

  test('should render with default props', () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-tabbar': SmartTabbar,
        },
        template: `<smart-tabbar id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');

    expect(wrapper?.data.height).toBe(50);
    expect(wrapper?.data.fixed).toBe(true);
    expect(wrapper?.data.border).toBe(true);
    expect(wrapper?.data.zIndex).toBe(1);
    expect(wrapper?.data.safeAreaInsetBottom).toBe(true);
  });

  test('should update children when active prop changes', () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-tabbar': SmartTabbar,
        },
        template: `<smart-tabbar id="wrapper" active="{{ active }}" />`,
        data: {
          active: 0,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      // Mock children
      const mockChild = {
        updateFromParent: jest.fn(),
      };
      instance.getRelationNodes = jest.fn(() => [mockChild, mockChild]);

      comp.setData({ active: 1 });

      expect(mockChild.updateFromParent).toHaveBeenCalled();
    }
  });

  test('should update children when activeColor prop changes', () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-tabbar': SmartTabbar,
        },
        template: `<smart-tabbar id="wrapper" active-color="{{ activeColor }}" />`,
        data: {
          activeColor: '#000000',
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      // Mock children
      const mockChild = {
        updateFromParent: jest.fn(),
      };
      instance.getRelationNodes = jest.fn(() => [mockChild]);

      comp.setData({ activeColor: '#ff0000' });

      expect(mockChild.updateFromParent).toHaveBeenCalled();
    }
  });

  test('should update children when inactiveColor prop changes', () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-tabbar': SmartTabbar,
        },
        template: `<smart-tabbar id="wrapper" inactive-color="{{ inactiveColor }}" />`,
        data: {
          inactiveColor: '#999999',
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      // Mock children
      const mockChild = {
        updateFromParent: jest.fn(),
      };
      instance.getRelationNodes = jest.fn(() => [mockChild]);

      comp.setData({ inactiveColor: '#cccccc' });

      expect(mockChild.updateFromParent).toHaveBeenCalled();
    }
  });

  test('should not update children when children is empty', () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-tabbar': SmartTabbar,
        },
        template: `<smart-tabbar id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      // Mock empty children
      instance.getRelationNodes = jest.fn(() => []);

      instance.updateChildren();

      // Should not throw error
      expect(instance.getRelationNodes).toHaveBeenCalled();
    }
  });

  test('should set height when fixed and placeholder are true', () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-tabbar': SmartTabbar,
        },
        template: `<smart-tabbar id="wrapper" fixed="{{ true }}" placeholder="{{ true }}" />`,
        data: {
          fixed: true,
          placeholder: true,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      instance.setHeight();

      expect(wx.nextTick).toHaveBeenCalled();
      expect(getRect).toHaveBeenCalled();
    }
  });

  test('should not set height when fixed is false', () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-tabbar': SmartTabbar,
        },
        template: `<smart-tabbar id="wrapper" fixed="{{ false }}" placeholder="{{ true }}" />`,
        data: {
          fixed: false,
          placeholder: true,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      (getRect as jest.Mock).mockClear();

      instance.setHeight();

      expect(getRect).not.toHaveBeenCalled();
    }
  });

  test('should not set height when placeholder is false', () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-tabbar': SmartTabbar,
        },
        template: `<smart-tabbar id="wrapper" fixed="{{ true }}" placeholder="{{ false }}" />`,
        data: {
          fixed: true,
          placeholder: false,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      (getRect as jest.Mock).mockClear();

      instance.setHeight();

      expect(getRect).not.toHaveBeenCalled();
    }
  });

  test('should update height from getRect result', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-tabbar': SmartTabbar,
        },
        template: `<smart-tabbar id="wrapper" fixed="{{ true }}" placeholder="{{ true }}" />`,
        data: {
          fixed: true,
          placeholder: true,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      (getRect as jest.Mock).mockResolvedValue({ height: 80 });

      instance.setHeight();

      // Wait for promise to resolve
      await Promise.resolve();
      await Promise.resolve(); // Wait for nextTick and getRect promise

      expect(wrapper?.data.height).toBe(80);
    }
  });
});


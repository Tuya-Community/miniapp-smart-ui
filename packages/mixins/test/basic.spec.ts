import path from 'path';
import simulate from 'miniprogram-simulate';

describe('mixins/basic', () => {
  // Use overlay component which uses basic mixin
  const SmartOverlay = simulate.load(
    path.resolve(__dirname, '../../overlay/index'),
    'smart-overlay',
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
      return Promise.resolve();
    }) as any;

    return () => {
      wx.nextTick = originalNextTick;
    };
  });

  test('should have $emit method', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-overlay': SmartOverlay,
        },
        template: `<smart-overlay id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      expect(typeof instance.$emit).toBe('function');
      
      // Test $emit
      const emitSpy = jest.spyOn(instance, 'triggerEvent');
      instance.$emit('test-event', { data: 'test' });
      
      expect(emitSpy).toHaveBeenCalledWith('test-event', { data: 'test' }, undefined);
      emitSpy.mockRestore();
    }
  });

  test('should have set method that returns a promise (lines 12-14)', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-overlay': SmartOverlay,
        },
        template: `<smart-overlay id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      expect(typeof instance.set).toBe('function');
      
      // Test set method (lines 12-14)
      const setDataSpy = jest.spyOn(instance, 'setData');
      const nextTickSpy = jest.spyOn(wx, 'nextTick');
      
      const promise = instance.set({ testKey: 'testValue' });
      
      expect(setDataSpy).toHaveBeenCalledWith({ testKey: 'testValue' });
      expect(nextTickSpy).toHaveBeenCalled();
      expect(promise).toBeInstanceOf(Promise);
      
      await promise;
      
      setDataSpy.mockRestore();
      nextTickSpy.mockRestore();
    }
  });

  test('should have setView method', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-overlay': SmartOverlay,
        },
        template: `<smart-overlay id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      expect(typeof instance.setView).toBe('function');
      
      // Set initial data
      instance.setData({ existingKey: 'oldValue' });
      
      // Test setView with changed data
      const setDataSpy = jest.spyOn(instance, 'setData');
      instance.setView({ existingKey: 'newValue' });
      
      expect(setDataSpy).toHaveBeenCalledWith({ existingKey: 'newValue' }, undefined);
      
      // Test setView with unchanged data
      setDataSpy.mockClear();
      const callback = jest.fn();
      instance.setView({ existingKey: 'newValue' }, callback);
      
      expect(setDataSpy).not.toHaveBeenCalled();
      expect(callback).toHaveBeenCalled();
      
      setDataSpy.mockRestore();
    }
  });
});


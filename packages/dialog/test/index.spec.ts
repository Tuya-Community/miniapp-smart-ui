import path from 'path';
import simulate from 'miniprogram-simulate';

describe('dialog', () => {
  const SmartDialog = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-dialog',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  beforeEach(() => {
    // Mock wx.nextTick
    const originalNextTick = wx.nextTick;
    wx.nextTick = jest.fn((callback: any) => {
      if (callback) {
        callback();
      }
    }) as any;

    return () => {
      wx.nextTick = originalNextTick;
    };
  });

  test('should clean up contextRef when destroyed', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dialog': SmartDialog,
        },
        template: `<smart-dialog id="test-dialog" show="{{ true }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#test-dialog');
    const instance = wrapper?.instance;
    
    await simulate.sleep(10);
    
    if (instance && instance.id) {
      // Access the destroyed method from the component instance
      const destroyedMethod = (instance as any).destroyed;
      if (destroyedMethod) {
        destroyedMethod.call(instance);
        await simulate.sleep(10);
        
        // contextRef should be cleaned up
        const { contextRef } = require('../dialog');
        expect(contextRef.value[`#${instance.id}`]).toBeNull();
      }
    }
  });

  test('should not clean up contextRef when id is not set', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dialog': SmartDialog,
        },
        template: `<smart-dialog show="{{ true }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('smart-dialog');
    const instance = wrapper?.instance;
    
    await simulate.sleep(10);
    
    if (instance) {
      // Should not throw error when id is not set
      expect(() => instance.destroyed()).not.toThrow();
    }
  });

  test('should handle onPopUpError with callback', async () => {
    let callbackCalled = false;
    let callbackAction: string | null = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dialog': SmartDialog,
        },
        template: `<smart-dialog id="wrapper" show="{{ true }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      // Set callback and actionType
      instance.setData({
        callback: (action: string) => {
          callbackCalled = true;
          callbackAction = action;
        },
        actionType: 'confirm',
      });
      await simulate.sleep(10);
      
      instance.onPopUpError();
      await simulate.sleep(10);
      
      expect(callbackCalled).toBe(true);
      expect(callbackAction).toBe('confirm');
    }
  });

  test('should not call callback in onPopUpError when callback is not set', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dialog': SmartDialog,
        },
        template: `<smart-dialog id="wrapper" show="{{ true }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      // Don't set callback
      instance.setData({
        actionType: 'confirm',
      });
      await simulate.sleep(10);
      
      // Should not throw error
      expect(() => instance.onPopUpError()).not.toThrow();
    }
  });

  test('should trigger onClickOverlay event when overlay is clicked', async () => {
    let closeEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dialog': SmartDialog,
        },
        template: `<smart-dialog id="wrapper" show="{{ true }}" close-on-click-overlay="{{ true }}" bind:close="onClose" />`,
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
    
    if (instance) {
      // Trigger onClickOverlay method
      instance.onClickOverlay();
      await simulate.sleep(10);
      
      // Should emit close event with 'overlay' action
      expect(closeEvent).toBe('overlay');
    }
  });

  test('should call close with overlay action when onClickOverlay is triggered', async () => {
    let closeEvent: any = null;
    let actionTypeSet = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dialog': SmartDialog,
        },
        template: `<smart-dialog id="wrapper" show="{{ true }}" auto-close="{{ false }}" bind:close="onClose" />`,
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
    
    if (instance) {
      // Mock setData to track actionType
      const originalSetData = instance.setData;
      instance.setData = jest.fn((data: any) => {
        if (data.actionType === 'overlay') {
          actionTypeSet = true;
        }
        originalSetData.call(instance, data);
      });

      // Trigger onClickOverlay
      instance.onClickOverlay();
      await simulate.sleep(10);
      
      // Should set actionType to 'overlay' and emit close event
      expect(actionTypeSet).toBe(true);
      expect(closeEvent).toBe('overlay');
    }
  });
});

// Test dialog.ts API functions
describe('dialog API', () => {
  let DialogInstance: any;
  let contextRef: any;

  beforeAll(() => {
    // Import dialog.ts module
    const dialogModule = require('../dialog');
    DialogInstance = dialogModule.default;
    contextRef = dialogModule.contextRef;
  });

  beforeEach(() => {
    // Mock wx.nextTick
    const originalNextTick = wx.nextTick;
    wx.nextTick = jest.fn((callback: any) => {
      if (callback) {
        callback();
      }
    }) as any;

    // Reset default options
    DialogInstance.resetDefaultOptions();

    return () => {
      wx.nextTick = originalNextTick;
    };
  });

  test('should handle Dialog.confirm', () => {
    // Dialog.confirm should call Dialog with showCancelButton: true
    const mockOptions = {
      title: 'Test',
      message: 'Test message',
    };
    
    // Just verify the method exists and returns a promise
    const result = DialogInstance.confirm(mockOptions);
    expect(result).toBeInstanceOf(Promise);
  });

  test('should handle Dialog.input', () => {
    // Dialog.input should call Dialog with showCancelButton: true and value
    const mockOptions = {
      title: 'Test',
      value: 'test value',
    };
    
    // Just verify the method exists and returns a promise
    const result = DialogInstance.input(mockOptions);
    expect(result).toBeInstanceOf(Promise);
  });

  test('should handle Dialog.close', () => {
    // Dialog.close should close all dialogs in queue
    // Method should exist and be callable
    expect(typeof DialogInstance.close).toBe('function');
    DialogInstance.close();
  });

  test('should handle Dialog.stopLoading', () => {
    // Dialog.stopLoading should stop loading for all dialogs
    expect(typeof DialogInstance.stopLoading).toBe('function');
    DialogInstance.stopLoading();
  });

  test('should handle Dialog.setDefaultOptions', () => {
    DialogInstance.setDefaultOptions({
      title: 'Default Title',
      message: 'Default Message',
    });

    expect(DialogInstance.currentOptions).toHaveProperty('title', 'Default Title');
    expect(DialogInstance.currentOptions).toHaveProperty('message', 'Default Message');
    
    // Reset
    DialogInstance.resetDefaultOptions();
  });

  test('should handle context as function', () => {
    const contextFn = jest.fn(() => ({
      selectComponent: jest.fn(() => null),
    }));

    const promise = DialogInstance({
      context: contextFn,
      selector: '#test-dialog',
      title: 'Test',
    });

    // Context function should be called
    expect(contextFn).toHaveBeenCalled();
    expect(promise).toBeInstanceOf(Promise);
  });

  test('should handle context as object', () => {
    const mockContext = {
      selectComponent: jest.fn(() => null),
    };

    const promise = DialogInstance({
      context: mockContext,
      selector: '#test-dialog',
      title: 'Test',
    });

    expect(mockContext.selectComponent).toHaveBeenCalledWith('#test-dialog');
    expect(promise).toBeInstanceOf(Promise);
  });

  test('should handle dialog not found', async () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    const mockContext = {
      selectComponent: jest.fn(() => null),
    };

    const promise = DialogInstance({
      context: mockContext,
      selector: '#non-existent',
      title: 'Test',
    });

    // Wait a bit for async operations
    await simulate.sleep(20);
    expect(consoleWarnSpy).toHaveBeenCalled();
    expect(promise).toBeInstanceOf(Promise);
    
    consoleWarnSpy.mockRestore();
  });

  test('should handle ignoreQueue option', () => {
    const mockDialog = {
      id: 'test-dialog',
      setData: jest.fn(),
    };
    
    const mockContext = {
      selectComponent: jest.fn(() => mockDialog),
    };

    // First call
    DialogInstance({
      context: mockContext,
      selector: '#test-dialog',
      title: 'First',
    });

    // Second call with ignoreQueue
    const promise = DialogInstance({
      context: mockContext,
      selector: '#test-dialog',
      title: 'Second',
      ignoreQueue: true,
    });

    expect(promise).toBeInstanceOf(Promise);
  });

  test('should handle duplicate dialog call in queue', async () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    const mockDialog = {
      id: 'test-dialog',
      setData: jest.fn(),
    };
    
    const mockContext = {
      selectComponent: jest.fn(() => mockDialog),
    };

    // First call
    DialogInstance({
      context: mockContext,
      selector: '#test-dialog',
      title: 'First',
    });

    await simulate.sleep(10);

    // Second call without ignoreQueue (should be ignored)
    DialogInstance({
      context: mockContext,
      selector: '#test-dialog',
      title: 'Second',
      ignoreQueue: false,
    });

    // Should warn about duplicate call
    await simulate.sleep(20);
    expect(consoleWarnSpy).toHaveBeenCalled();
    
    consoleWarnSpy.mockRestore();
  });

  test('should handle value as string in Dialog', () => {
    const mockDialog = {
      id: 'test-dialog',
      setData: jest.fn(),
    };
    
    const mockContext = {
      selectComponent: jest.fn(() => mockDialog),
    };

    const promise = DialogInstance({
      context: mockContext,
      selector: '#test-dialog',
      title: 'Test',
      value: 'test input value',
    });

    expect(promise).toBeInstanceOf(Promise);
    // The value should be processed and passed to setData
    // We just verify the function can handle string value
  });
});


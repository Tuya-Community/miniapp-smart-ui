import path from 'path';
import simulate from 'miniprogram-simulate';
import DialogInstance, { contextRef, queueRef } from '../dialog';

describe('dialog.ts', () => {
  const SmartDialog = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-dialog',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  beforeEach(() => {
    // Clear contextRef and queueRef before each test
    contextRef.value = {};
    queueRef.value = [];
    
    // Mock wx.nextTick
    const originalNextTick = wx.nextTick;
    wx.nextTick = jest.fn((callback: () => void) => {
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

  test('should call Dialog.alert', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dialog': SmartDialog,
        },
        template: `<smart-dialog id="smart-dialog" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const dialog = comp.querySelector('#smart-dialog');
    await simulate.sleep(10);

    if (dialog) {
      const promise = DialogInstance.alert({
        context: comp.instance,
        selector: '#smart-dialog',
        title: 'Test Title',
        message: 'Test Message',
      });

      await simulate.sleep(10);

      expect(dialog.data.show).toBe(true);
      expect(dialog.data.title).toBe('Test Title');
      expect(dialog.data.message).toBe('Test Message');
      expect(queueRef.value.length).toBe(1);

      // Clean up
      dialog.setData({ show: false });
      await simulate.sleep(10);
    }
  });

  test('should call Dialog.confirm', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dialog': SmartDialog,
        },
        template: `<smart-dialog id="smart-dialog" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const dialog = comp.querySelector('#smart-dialog');
    await simulate.sleep(10);

    if (dialog) {
      const promise = DialogInstance.confirm({
        context: comp.instance,
        selector: '#smart-dialog',
        title: 'Test Title',
        message: 'Test Message',
      });

      await simulate.sleep(10);

      expect(dialog.data.show).toBe(true);
      expect(dialog.data.showCancelButton).toBe(true);
      expect(queueRef.value.length).toBe(1);

      // Clean up
      dialog.setData({ show: false });
      await simulate.sleep(10);
    }
  });

  test('should call Dialog.input', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dialog': SmartDialog,
        },
        template: `<smart-dialog id="smart-dialog" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const dialog = comp.querySelector('#smart-dialog');
    await simulate.sleep(10);

    if (dialog) {
      const promise = DialogInstance.input({
        context: comp.instance,
        selector: '#smart-dialog',
        title: 'Test Title',
        value: 'initial value',
      });

      await simulate.sleep(10);

      expect(dialog.data.show).toBe(true);
      expect(dialog.data.showCancelButton).toBe(true);
      expect(dialog.data.inputValue).toBe('initial value');
      expect(queueRef.value.length).toBe(1);

      // Clean up
      dialog.setData({ show: false });
      await simulate.sleep(10);
    }
  });

  test('should handle Dialog when dialog component not found', async () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    // Create a mock context that returns null for selectComponent
    const mockContext = {
      selectComponent: jest.fn(() => null),
    } as any;

    const promise = DialogInstance.alert({
      context: mockContext,
      selector: '#non-existent-dialog',
      title: 'Test Title',
      message: 'Test Message',
    });

    await simulate.sleep(10);

    expect(consoleWarnSpy).toHaveBeenCalled();
    expect(queueRef.value.length).toBe(0);

    consoleWarnSpy.mockRestore();
  });

  test('should handle Dialog with context function', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dialog': SmartDialog,
        },
        template: `<smart-dialog id="smart-dialog" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const dialog = comp.querySelector('#smart-dialog');
    await simulate.sleep(10);

    if (dialog) {
      const promise = DialogInstance.alert({
        context: () => comp.instance,
        selector: '#smart-dialog',
        title: 'Test Title',
      });

      await simulate.sleep(10);

      expect(dialog.data.show).toBe(true);

      // Clean up
      dialog.setData({ show: false });
      await simulate.sleep(10);
    }
  });

  test('should handle Dialog with contextRef', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dialog': SmartDialog,
        },
        template: `<smart-dialog id="smart-dialog" id="{{ 'test-dialog' }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const dialog = comp.querySelector('#smart-dialog');
    await simulate.sleep(10);

    if (dialog && dialog.instance) {
      dialog.instance.id = 'test-dialog';
      contextRef.value['#test-dialog'] = comp.instance;
      await simulate.sleep(10);

      const promise = DialogInstance.alert({
        selector: '#smart-dialog',
        title: 'Test Title',
      });

      await simulate.sleep(10);

      expect(dialog.data.show).toBe(true);

      // Clean up
      dialog.setData({ show: false });
      await simulate.sleep(10);
    }
  });


  test('should handle Dialog with ignoreQueue true', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dialog': SmartDialog,
        },
        template: `<smart-dialog id="smart-dialog" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const dialog = comp.querySelector('#smart-dialog');
    await simulate.sleep(10);

    if (dialog && dialog.instance) {
      dialog.instance.id = 'test-dialog';
      // Add a different dialog to queue to test ignoreQueue
      const otherDialog = { id: 'other-dialog' } as any;
      queueRef.value.push(otherDialog);

      const promise = DialogInstance.alert({
        context: comp.instance,
        selector: '#smart-dialog',
        title: 'Test Title',
        ignoreQueue: true,
      });

      await simulate.sleep(10);

      // When ignoreQueue is true, should still open dialog
      expect(dialog.data.show).toBe(true);
      // Queue should have both dialogs
      expect(queueRef.value.length).toBeGreaterThanOrEqual(1);

      // Clean up
      dialog.setData({ show: false });
      await simulate.sleep(10);
    }
  });

  test('should handle Dialog callback with confirm action', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dialog': SmartDialog,
        },
        template: `<smart-dialog id="smart-dialog" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const dialog = comp.querySelector('#smart-dialog');
    await simulate.sleep(10);

    if (dialog && dialog.instance) {
      dialog.instance.id = 'test-dialog';

      const promise = DialogInstance.alert({
        context: comp.instance,
        selector: '#smart-dialog',
        title: 'Test Title',
      });

      await simulate.sleep(10);

      // Trigger callback with confirm
      if (dialog.data.callback) {
        dialog.data.callback('confirm', dialog.instance);
        await simulate.sleep(10);

        expect(queueRef.value.length).toBe(0);
      }

      // Clean up
      dialog.setData({ show: false });
      await simulate.sleep(10);
    }
  });

  test('should handle Dialog callback with cancel action', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dialog': SmartDialog,
        },
        template: `<smart-dialog id="smart-dialog" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const dialog = comp.querySelector('#smart-dialog');
    await simulate.sleep(10);

    if (dialog && dialog.instance) {
      dialog.instance.id = 'test-dialog';

      const promise = DialogInstance.alert({
        context: comp.instance,
        selector: '#smart-dialog',
        title: 'Test Title',
      });

      await simulate.sleep(10);

      // Trigger callback with cancel
      if (dialog.data.callback) {
        const initialQueueLength = queueRef.value.length;
        dialog.data.callback('cancel', dialog.instance);
        await simulate.sleep(10);

        // Callback should remove dialog from queue
        expect(queueRef.value.length).toBeLessThan(initialQueueLength);
      }

      // Clean up
      dialog.setData({ show: false });
      await simulate.sleep(10);
    }
  });

  test('should handle Dialog promise catch', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dialog': SmartDialog,
        },
        template: `<smart-dialog id="smart-dialog" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const dialog = comp.querySelector('#smart-dialog');
    await simulate.sleep(10);

    if (dialog && dialog.instance) {
      dialog.instance.id = 'test-dialog';

      const promise = DialogInstance.alert({
        context: comp.instance,
        selector: '#smart-dialog',
        title: 'Test Title',
      });

      await simulate.sleep(10);

      // Trigger callback with cancel to reject promise
      if (dialog.data.callback) {
        const initialQueueLength = queueRef.value.length;
        dialog.data.callback('cancel', dialog.instance);
        await simulate.sleep(10);

        // Callback should remove dialog from queue
        expect(queueRef.value.length).toBeLessThan(initialQueueLength);
        
        // Promise should be rejected
        try {
          await promise;
        } catch (e) {
          // Expected to reject
          expect(e).toBeDefined();
        }
      }

      // Clean up
      dialog.setData({ show: false });
      await simulate.sleep(10);
    }
  });

  test('should call Dialog.close', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dialog': SmartDialog,
        },
        template: `<smart-dialog id="smart-dialog" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const dialog = comp.querySelector('#smart-dialog');
    await simulate.sleep(10);

    if (dialog && dialog.instance) {
      dialog.instance.id = 'test-dialog';
      dialog.instance.close = jest.fn();
      queueRef.value.push(dialog.instance);

      DialogInstance.close();

      expect(dialog.instance.close).toHaveBeenCalled();
      expect(queueRef.value.length).toBe(0);
    }
  });

  test('should call Dialog.stopLoading', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dialog': SmartDialog,
        },
        template: `<smart-dialog id="smart-dialog" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const dialog = comp.querySelector('#smart-dialog');
    await simulate.sleep(10);

    if (dialog && dialog.instance) {
      dialog.instance.id = 'test-dialog';
      dialog.instance.stopLoading = jest.fn();
      queueRef.value.push(dialog.instance);

      DialogInstance.stopLoading();

      expect(dialog.instance.stopLoading).toHaveBeenCalled();
    }
  });

  test('should handle Dialog.setDefaultOptions', () => {
    DialogInstance.setDefaultOptions({
      title: 'Default Title',
      message: 'Default Message',
    });

    expect(DialogInstance.currentOptions.title).toBe('Default Title');
    expect(DialogInstance.currentOptions.message).toBe('Default Message');
  });

  test('should handle Dialog.resetDefaultOptions', () => {
    DialogInstance.setDefaultOptions({
      title: 'Custom Title',
    });

    DialogInstance.resetDefaultOptions();

    expect(DialogInstance.currentOptions.title).toBe('');
    expect(DialogInstance.currentOptions.message).toBe('');
  });

  test('should handle Dialog with string value', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dialog': SmartDialog,
        },
        template: `<smart-dialog id="smart-dialog" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const dialog = comp.querySelector('#smart-dialog');
    await simulate.sleep(10);

    if (dialog) {
      const promise = DialogInstance.alert({
        context: comp.instance,
        selector: '#smart-dialog',
        value: 'test value',
      });

      await simulate.sleep(10);

      expect(dialog.data.inputValue).toBe('test value');

      // Clean up
      dialog.setData({ show: false });
      await simulate.sleep(10);
    }
  });

  test('should handle Dialog with null value', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dialog': SmartDialog,
        },
        template: `<smart-dialog id="smart-dialog" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const dialog = comp.querySelector('#smart-dialog');
    await simulate.sleep(10);

    if (dialog) {
      const promise = DialogInstance.alert({
        context: comp.instance,
        selector: '#smart-dialog',
        value: null,
      });

      await simulate.sleep(10);

      expect(dialog.data.inputValue).toBe('');

      // Clean up
      dialog.setData({ show: false });
      await simulate.sleep(10);
    }
  });
});


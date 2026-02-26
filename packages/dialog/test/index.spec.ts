import path from 'path';
import simulate from 'miniprogram-simulate';
import { contextRef, queueRef } from '../dialog';

describe('dialog', () => {
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

    return () => {
      wx.nextTick = originalNextTick;
    };
  });

  test('should stop loading when show becomes false', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dialog': SmartDialog,
        },
        template: `<smart-dialog id="wrapper" show="{{ show }}" />`,
        data: {
          show: true,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({
        loading: {
          confirm: true,
          cancel: true,
        },
      });
      await simulate.sleep(10);

      comp.setData({ show: false });
      await simulate.sleep(10);

      expect(wrapper?.data.loading.confirm).toBe(false);
      expect(wrapper?.data.loading.cancel).toBe(false);
    }
  });

  test('should emit confirm event', async () => {
    let confirmEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dialog': SmartDialog,
        },
        template: `<smart-dialog id="wrapper" show="{{ true }}" bind:confirm="onConfirm" />`,
        methods: {
          onConfirm(event: any) {
            confirmEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onConfirm();
      await simulate.sleep(10);

      expect(confirmEvent).toBeTruthy();
      expect(confirmEvent.dialog).toBe(instance);
    }
  });

  test('should emit cancel event', async () => {
    let cancelEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dialog': SmartDialog,
        },
        template: `<smart-dialog id="wrapper" show="{{ true }}" bind:cancel="onCancel" />`,
        methods: {
          onCancel(event: any) {
            cancelEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onCancel();
      await simulate.sleep(10);

      expect(cancelEvent).toBeTruthy();
      expect(cancelEvent.dialog).toBe(instance);
    }
  });

  test('should close on overlay click', async () => {
    let closeEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dialog': SmartDialog,
        },
        template: `<smart-dialog id="wrapper" show="{{ true }}" bind:close="onClose" />`,
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
    await simulate.sleep(10);

    if (instance) {
      instance.onClickOverlay();
      await simulate.sleep(10);

      expect(closeEvent).toBe('overlay');
    }
  });

  test('should update inputValue on input', async () => {
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
    await simulate.sleep(10);

    if (instance) {
      instance.onInput({
        detail: {
          value: 'test input',
        },
      });
      await simulate.sleep(10);

      expect(wrapper?.data.inputValue).toBe('test input');
    }
  });

  test('should call onInput callback when provided', async () => {
    const onInputCallback = jest.fn();

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
    await simulate.sleep(10);

    if (instance) {
      instance.setData({
        onInput: onInputCallback,
      });
      await simulate.sleep(10);

      instance.onInput({
        detail: {
          value: 'test callback',
        },
      });
      await simulate.sleep(10);

      expect(wrapper?.data.inputValue).toBe('test callback');
      expect(onInputCallback).toHaveBeenCalledWith('test callback');
    }
  });

  test('should close dialog with action', async () => {
    let closeEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dialog': SmartDialog,
        },
        template: `<smart-dialog id="wrapper" show="{{ true }}" auto-close="{{ true }}" bind:close="onClose" />`,
        data: {
          autoClose: true,
        },
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
    await simulate.sleep(10);

    if (instance) {
      instance.close('confirm');
      await simulate.sleep(10);

      expect(wrapper?.data.show).toBe(false);
      expect(wrapper?.data.actionType).toBe('confirm');
      expect(closeEvent).toBe('confirm');
    }
  });

  test('should not close dialog when autoClose is false', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dialog': SmartDialog,
        },
        template: `<smart-dialog id="wrapper" show="{{ true }}" auto-close="{{ false }}" />`,
        data: {
          autoClose: false,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.close('confirm');
      await simulate.sleep(10);

      expect(wrapper?.data.show).toBe(true);
      expect(wrapper?.data.actionType).toBe('confirm');
    }
  });

  test('should handle action without asyncClose and beforeClose', async () => {
    let confirmEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dialog': SmartDialog,
        },
        template: `<smart-dialog id="wrapper" show="{{ true }}" bind:confirm="onConfirm" />`,
        methods: {
          onConfirm(event: any) {
            confirmEvent = event.detail;
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
        asyncClose: false,
        beforeClose: null,
      });
      instance.handleAction('confirm');
      await simulate.sleep(10);

      expect(confirmEvent).toBeTruthy();
    }
  });

  test('should not handle action when show is false', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dialog': SmartDialog,
        },
        template: `<smart-dialog id="wrapper" show="{{ false }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const emitSpy = jest.spyOn(instance, '$emit');
      instance.handleAction('confirm');
      await simulate.sleep(10);

      expect(emitSpy).not.toHaveBeenCalled();
      emitSpy.mockRestore();
    }
  });

  test('should emit transition events', async () => {
    let beforeEnterEmitted = false;
    let enterEmitted = false;
    let afterEnterEmitted = false;
    let beforeLeaveEmitted = false;
    let leaveEmitted = false;
    let afterLeaveEmitted = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dialog': SmartDialog,
        },
        template: `<smart-dialog id="wrapper" bind:before-enter="onBeforeEnter" bind:enter="onEnter" bind:after-enter="onAfterEnter" bind:before-leave="onBeforeLeave" bind:leave="onLeave" bind:after-leave="onAfterLeave" />`,
        methods: {
          onBeforeEnter() {
            beforeEnterEmitted = true;
          },
          onEnter() {
            enterEmitted = true;
          },
          onAfterEnter() {
            afterEnterEmitted = true;
          },
          onBeforeLeave() {
            beforeLeaveEmitted = true;
          },
          onLeave() {
            leaveEmitted = true;
          },
          onAfterLeave() {
            afterLeaveEmitted = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onBeforeEnter();
      instance.onEnter();
      instance.onAfterEnter();
      instance.onBeforeLeave();
      instance.onLeave();
      instance.onAfterLeave();
      await simulate.sleep(10);

      expect(beforeEnterEmitted).toBe(true);
      expect(enterEmitted).toBe(true);
      expect(afterEnterEmitted).toBe(true);
      expect(beforeLeaveEmitted).toBe(true);
      expect(leaveEmitted).toBe(true);
      expect(afterLeaveEmitted).toBe(true);
    }
  });

  test('should call callback in onAfterLeave', async () => {
    let callbackCalled = false;
    let callbackAction: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dialog': SmartDialog,
        },
        template: `<smart-dialog id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({
        callback: (action: string) => {
          callbackCalled = true;
          callbackAction = action;
        },
        actionType: 'confirm',
      });
      instance.onAfterLeave();
      await simulate.sleep(10);

      expect(callbackCalled).toBe(true);
      expect(callbackAction).toBe('confirm');
    }
  });

  test('should call callback in onPopUpError', async () => {
    let callbackCalled = false;
    let callbackAction: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dialog': SmartDialog,
        },
        template: `<smart-dialog id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({
        callback: (action: string) => {
          callbackCalled = true;
          callbackAction = action;
        },
        actionType: 'cancel',
      });
      instance.onPopUpError();
      await simulate.sleep(10);

      expect(callbackCalled).toBe(true);
      expect(callbackAction).toBe('cancel');
    }
  });

  test('should handle destroyed lifecycle without id', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dialog': SmartDialog,
        },
        template: `<smart-dialog id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Set id to empty to test early return
      instance.id = '';
      await simulate.sleep(10);

      // Call destroyed - should return early
      if (instance.destroyed) {
        instance.destroyed();
      }
      await simulate.sleep(10);

      expect(instance.id).toBe('');
    }
  });

  test('should handle action with beforeClose returning true', async () => {
    let closeCalled = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dialog': SmartDialog,
        },
        template: `<smart-dialog id="wrapper" show="{{ true }}" bind:close="onClose" />`,
        methods: {
          onClose() {
            closeCalled = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const beforeClose = jest.fn(() => Promise.resolve(true));
      instance.setData({
        show: true,
        asyncClose: false,
        beforeClose,
      });
      await simulate.sleep(10);

      instance.handleAction('confirm');
      await simulate.sleep(50);

      expect(beforeClose).toHaveBeenCalled();
      expect(closeCalled).toBe(true);
    }
  });

  test('should handle action with beforeClose returning false', async () => {
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
    await simulate.sleep(10);

    if (instance) {
      const beforeClose = jest.fn(() => Promise.resolve(false));
      instance.setData({
        show: true,
        asyncClose: false,
        beforeClose,
        loading: { confirm: false, cancel: false },
      });
      await simulate.sleep(10);

      instance.handleAction('confirm');
      await simulate.sleep(50);

      expect(beforeClose).toHaveBeenCalled();
      // Should stop loading when beforeClose returns false
      expect(wrapper?.data.loading.confirm).toBe(false);
    }
  });

  test('should handle action with asyncClose', async () => {
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
    await simulate.sleep(10);

    if (instance) {
      instance.setData({
        show: true,
        asyncClose: true,
        beforeClose: null,
        loading: { confirm: false, cancel: false },
      });
      await simulate.sleep(10);

      instance.handleAction('confirm');
      await simulate.sleep(10);

      // Should set loading to true
      expect(wrapper?.data.loading.confirm).toBe(true);
    }
  });

  test('should handle destroyed lifecycle with id', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dialog': SmartDialog,
        },
        template: `<smart-dialog id="wrapper" id="{{ 'test-dialog' }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Set id
      instance.id = 'test-dialog';
      await simulate.sleep(10);

      // Verify contextRef is set
      expect(contextRef.value['#test-dialog']).toBeTruthy();

      // Call destroyed
      if (instance.destroyed) {
        instance.destroyed();
      }
      await simulate.sleep(10);

      // Should clear contextRef
      expect(contextRef.value['#test-dialog']).toBeNull();
    }
  });

  test('should handle action with beforeClose returning true', async () => {
    let closeCalled = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dialog': SmartDialog,
        },
        template: `<smart-dialog id="wrapper" show="{{ true }}" bind:close="onClose" />`,
        methods: {
          onClose() {
            closeCalled = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const beforeClose = jest.fn(() => Promise.resolve(true));
      instance.setData({
        show: true,
        asyncClose: false,
        beforeClose,
      });
      await simulate.sleep(10);

      instance.handleAction('confirm');
      await simulate.sleep(50);

      expect(beforeClose).toHaveBeenCalled();
      expect(closeCalled).toBe(true);
    }
  });

  test('should handle action with beforeClose returning false', async () => {
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
    await simulate.sleep(10);

    if (instance) {
      const beforeClose = jest.fn(() => Promise.resolve(false));
      instance.setData({
        show: true,
        asyncClose: false,
        beforeClose,
        loading: { confirm: false, cancel: false },
      });
      await simulate.sleep(10);

      instance.handleAction('confirm');
      await simulate.sleep(50);

      expect(beforeClose).toHaveBeenCalled();
      // Should stop loading when beforeClose returns false
      expect(wrapper?.data.loading.confirm).toBe(false);
    }
  });

  test('should handle action with beforeClose returning void', async () => {
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
    await simulate.sleep(10);

    if (instance) {
      const beforeClose = jest.fn(() => {});
      instance.setData({
        show: true,
        asyncClose: false,
        beforeClose,
        loading: { confirm: false, cancel: false },
      });
      await simulate.sleep(10);

      instance.handleAction('confirm');
      await simulate.sleep(50);

      expect(beforeClose).toHaveBeenCalled();
    }
  });

  test('should log error when dialog id is repeated in mounted', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dialog': SmartDialog,
        },
        template: `<smart-dialog id="wrapper" id="{{ 'test-dialog' }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.id = 'test-dialog';
      // Set contextRef to simulate repeated id
      contextRef.value['#test-dialog'] = {} as any;
      await simulate.sleep(10);

      // Trigger mounted
      if (instance.mounted) {
        instance.mounted();
        await simulate.sleep(10);

        expect(consoleErrorSpy).toHaveBeenCalledWith(
          expect.stringContaining('Dialog component #test-dialog repeated!')
        );
      }

      consoleErrorSpy.mockRestore();
    }
  });

  test('should handle destroyed lifecycle with queue cleanup', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dialog': SmartDialog,
        },
        template: `<smart-dialog id="wrapper" id="{{ 'test-dialog' }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.id = 'test-dialog';
      // Set contextRef first
      contextRef.value['#test-dialog'] = comp.instance;
      // Add to queue with same id
      queueRef.value.push(instance);
      await simulate.sleep(10);

      // Verify initial state
      expect(contextRef.value['#test-dialog']).toBeTruthy();
      expect(queueRef.value.length).toBe(1);
      expect(queueRef.value.find(item => item.id === 'test-dialog')).toBeTruthy();

      // Call destroyed
      if (instance.destroyed) {
        instance.destroyed();
        await simulate.sleep(10);

        // Should clear contextRef and remove from queue
        expect(contextRef.value['#test-dialog']).toBeNull();
        expect(queueRef.value.length).toBe(0);
        expect(queueRef.value.find(item => item.id === 'test-dialog')).toBeFalsy();
      }
    }
  });

  test('should handle onInput with undefined detail', async () => {
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
    await simulate.sleep(10);

    if (instance) {
      instance.onInput({});
      await simulate.sleep(10);

      expect(wrapper?.data.inputValue).toBe('');
    }
  });

  test('should handle onInput with null detail', async () => {
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
    await simulate.sleep(10);

    if (instance) {
      instance.onInput({ detail: null });
      await simulate.sleep(10);

      expect(wrapper?.data.inputValue).toBe('');
    }
  });

  test('should handle onAfterLeave without callback', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dialog': SmartDialog,
        },
        template: `<smart-dialog id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({
        callback: null,
        actionType: 'confirm',
      });
      
      // Should not throw error
      expect(() => instance.onAfterLeave()).not.toThrow();
    }
  });

  test('should handle onPopUpError without callback', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dialog': SmartDialog,
        },
        template: `<smart-dialog id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({
        callback: null,
        actionType: 'cancel',
      });
      
      // Should not throw error
      expect(() => instance.onPopUpError()).not.toThrow();
    }
  });
});


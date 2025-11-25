import path from 'path';
import simulate from 'miniprogram-simulate';

describe('swipe-cell', () => {
  const SmartSwipeCell = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-swipe-cell',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  test('should open left position', async () => {
    let openEvent: any = null;
    let tabCloseEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-swipe-cell': SmartSwipeCell,
        },
        template: `<smart-swipe-cell id="wrapper" left-width="{{ 100 }}" bind:open="onOpen" bind:tab-close="onTabClose" />`,
        data: {
          leftWidth: 100,
        },
        methods: {
          onOpen(event: any) {
            openEvent = event.detail;
          },
          onTabClose(event: any) {
            tabCloseEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.open('left');
      await simulate.sleep(10);

      expect(wrapper?.data.position).toBe('left');
      expect(openEvent).toEqual({
        position: 'left',
        name: '',
      });
    }
  });

  test('should open right position', async () => {
    let openEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-swipe-cell': SmartSwipeCell,
        },
        template: `<smart-swipe-cell id="wrapper" right-width="{{ 100 }}" bind:open="onOpen" />`,
        data: {
          rightWidth: 100,
        },
        methods: {
          onOpen(event: any) {
            openEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.open('right');
      await simulate.sleep(10);

      expect(wrapper?.data.position).toBe('right');
      expect(openEvent).toEqual({
        position: 'right',
        name: '',
      });
    }
  });

  test('should emit tab-close when switching position', async () => {
    let tabCloseEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-swipe-cell': SmartSwipeCell,
        },
        template: `<smart-swipe-cell id="wrapper" left-width="{{ 100 }}" right-width="{{ 100 }}" bind:tab-close="onTabClose" />`,
        data: {
          leftWidth: 100,
          rightWidth: 100,
        },
        methods: {
          onTabClose(event: any) {
            tabCloseEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ position: 'left' });
      instance.open('right');
      await simulate.sleep(10);

      expect(tabCloseEvent).toBe('left');
    }
  });

  test('should close swipe cell', async () => {
    let tabCloseEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-swipe-cell': SmartSwipeCell,
        },
        template: `<smart-swipe-cell id="wrapper" left-width="{{ 100 }}" bind:tab-close="onTabClose" />`,
        data: {
          leftWidth: 100,
        },
        methods: {
          onTabClose(event: any) {
            tabCloseEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ position: 'left' });
      instance.close();
      await simulate.sleep(10);

      expect(wrapper?.data.position).toBe('close');
      expect(tabCloseEvent).toBe('left');
    }
  });

  test('should not emit tab-close when already closed', async () => {
    let tabCloseEmitted = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-swipe-cell': SmartSwipeCell,
        },
        template: `<smart-swipe-cell id="wrapper" bind:tab-close="onTabClose" />`,
        methods: {
          onTabClose() {
            tabCloseEmitted = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ position: 'close' });
      instance.close();
      await simulate.sleep(10);

      expect(tabCloseEmitted).toBe(false);
    }
  });

  test('should emit click event', async () => {
    let clickEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-swipe-cell': SmartSwipeCell,
        },
        template: `<smart-swipe-cell id="wrapper" bind:click="onClick" />`,
        methods: {
          onClick(event: any) {
            clickEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onClick({
        currentTarget: {
          dataset: {
            key: 'left',
          },
        },
      });
      await simulate.sleep(10);

      expect(clickEvent).toBe('left');
    }
  });

  test('should close when clicked and not asyncClose', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-swipe-cell': SmartSwipeCell,
        },
        template: `<smart-swipe-cell id="wrapper" left-width="{{ 100 }}" />`,
        data: {
          leftWidth: 100,
          asyncClose: false,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ position: 'left' });
      instance.offset = 100;
      instance.onClick({
        currentTarget: {
          dataset: {
            key: 'outside',
          },
        },
      });
      await simulate.sleep(10);

      expect(wrapper?.data.position).toBe('close');
    }
  });

  test('should emit close event when clicked and asyncClose', async () => {
    let closeEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-swipe-cell': SmartSwipeCell,
        },
        template: `<smart-swipe-cell id="wrapper" left-width="{{ 100 }}" async-close="{{ true }}" bind:close="onClose" />`,
        data: {
          leftWidth: 100,
          asyncClose: true,
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
      instance.setData({ position: 'left' });
      instance.offset = 100;
      instance.onClick({
        currentTarget: {
          dataset: {
            key: 'outside',
          },
        },
      });
      await simulate.sleep(10);

      expect(closeEvent).toEqual({
        position: 'outside',
        instance,
        name: '',
      });
    }
  });

  test('should not close when offset is 0', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-swipe-cell': SmartSwipeCell,
        },
        template: `<smart-swipe-cell id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ position: 'left' });
      instance.offset = 0;
      const closeSpy = jest.spyOn(instance, 'close');

      instance.onClick({
        currentTarget: {
          dataset: {
            key: 'outside',
          },
        },
      });
      await simulate.sleep(10);

      expect(closeSpy).not.toHaveBeenCalled();
      closeSpy.mockRestore();
    }
  });

  test('should not start drag when disabled', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-swipe-cell': SmartSwipeCell,
        },
        template: `<smart-swipe-cell id="wrapper" disabled />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const touchStartSpy = jest.spyOn(instance, 'touchStart');

      instance.startDrag({
        touches: [{ clientX: 0, clientY: 0 }],
      } as any);
      await simulate.sleep(10);

      expect(touchStartSpy).not.toHaveBeenCalled();
      touchStartSpy.mockRestore();
    }
  });

  test('should not drag when disabled', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-swipe-cell': SmartSwipeCell,
        },
        template: `<smart-swipe-cell id="wrapper" disabled />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ disabled: true });
      const touchMoveSpy = jest.spyOn(instance, 'touchMove');

      instance.onDrag({
        touches: [{ clientX: 10, clientY: 0 }],
      } as any);
      await simulate.sleep(10);

      expect(touchMoveSpy).not.toHaveBeenCalled();
      touchMoveSpy.mockRestore();
    }
  });

  test('should not end drag when disabled', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-swipe-cell': SmartSwipeCell,
        },
        template: `<smart-swipe-cell id="wrapper" disabled />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ disabled: true });
      instance.dragging = false;
      const swipeLeaveTransitionSpy = jest.spyOn(instance, 'swipeLeaveTransition');

      instance.endDrag();
      await simulate.sleep(10);

      expect(swipeLeaveTransitionSpy).not.toHaveBeenCalled();
      swipeLeaveTransitionSpy.mockRestore();
    }
  });
});


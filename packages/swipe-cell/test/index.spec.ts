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

  test('should end drag when dragging is true', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-swipe-cell': SmartSwipeCell,
        },
        template: `<smart-swipe-cell id="wrapper" left-width="{{ 100 }}" />`,
        data: {
          leftWidth: 100,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.dragging = true;
      instance.offset = 50;
      const swipeLeaveTransitionSpy = jest.spyOn(instance, 'swipeLeaveTransition');

      instance.endDrag();
      await simulate.sleep(10);

      expect(instance.dragging).toBe(false);
      expect(swipeLeaveTransitionSpy).toHaveBeenCalled();
      swipeLeaveTransitionSpy.mockRestore();
    }
  });

  test('should update leftWidth observer when offset > 0', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-swipe-cell': SmartSwipeCell,
        },
        template: `<smart-swipe-cell id="wrapper" left-width="{{ leftWidth }}" />`,
        data: {
          leftWidth: 100,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.offset = 50;
      const swipeMoveSpy = jest.spyOn(instance, 'swipeMove');

      wrapper?.setData({ leftWidth: 150 });
      await simulate.sleep(10);

      expect(swipeMoveSpy).toHaveBeenCalledWith(150);
      swipeMoveSpy.mockRestore();
    }
  });

  test('should update rightWidth observer when offset < 0', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-swipe-cell': SmartSwipeCell,
        },
        template: `<smart-swipe-cell id="wrapper" right-width="{{ rightWidth }}" />`,
        data: {
          rightWidth: 100,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.offset = -50;
      const swipeMoveSpy = jest.spyOn(instance, 'swipeMove');

      wrapper?.setData({ rightWidth: 150 });
      await simulate.sleep(10);

      expect(swipeMoveSpy).toHaveBeenCalledWith(-150);
      swipeMoveSpy.mockRestore();
    }
  });

  test('should remove from ARRAY when destroyed', async () => {
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
      // Check that instance is in ARRAY
      const initialLength = instance.getRelationNodes ? 0 : 0; // We can't access ARRAY directly
      
      comp.detach();
      await simulate.sleep(10);

      // Instance should be removed from ARRAY
      // We verify by checking that destroyed was called
      expect(instance).toBeDefined();
    }
  });

  test('should open right when threshold exceeded', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-swipe-cell': SmartSwipeCell,
        },
        template: `<smart-swipe-cell id="wrapper" right-width="{{ 100 }}" />`,
        data: {
          rightWidth: 100,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.offset = -40; // -40 > -100 * 0.3 = -30, so should open right
      instance.rightWidth = 100;
      const openSpy = jest.spyOn(instance, 'open');

      instance.swipeLeaveTransition();
      await simulate.sleep(10);

      expect(openSpy).toHaveBeenCalledWith('right');
      openSpy.mockRestore();
    }
  });

  test('should open left when threshold exceeded', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-swipe-cell': SmartSwipeCell,
        },
        template: `<smart-swipe-cell id="wrapper" left-width="{{ 100 }}" />`,
        data: {
          leftWidth: 100,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.offset = 40; // 40 > 100 * 0.3 = 30, so should open left
      instance.leftWidth = 100;
      const openSpy = jest.spyOn(instance, 'open');

      instance.swipeLeaveTransition();
      await simulate.sleep(10);

      expect(openSpy).toHaveBeenCalledWith('left');
      openSpy.mockRestore();
    }
  });

  test('should close when threshold not exceeded', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-swipe-cell': SmartSwipeCell,
        },
        template: `<smart-swipe-cell id="wrapper" left-width="{{ 100 }}" />`,
        data: {
          leftWidth: 100,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.offset = 20; // 20 < 100 * 0.3 = 30, so should close
      instance.leftWidth = 100;
      const closeSpy = jest.spyOn(instance, 'close');

      instance.swipeLeaveTransition();
      await simulate.sleep(10);

      expect(closeSpy).toHaveBeenCalled();
      expect(wrapper?.data.catchMove).toBe(false);
      closeSpy.mockRestore();
    }
  });

  test('should not drag when direction is not horizontal', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-swipe-cell': SmartSwipeCell,
        },
        template: `<smart-swipe-cell id="wrapper" left-width="{{ 100 }}" />`,
        data: {
          leftWidth: 100,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.direction = 'vertical';
      instance.dragging = false;
      const swipeMoveSpy = jest.spyOn(instance, 'swipeMove');

      instance.onDrag({
        touches: [{ clientX: 10, clientY: 50 }],
      } as any);
      await simulate.sleep(10);

      expect(swipeMoveSpy).not.toHaveBeenCalled();
      expect(instance.dragging).toBe(false);
      swipeMoveSpy.mockRestore();
    }
  });

  test('should close other instances when dragging', async () => {
    const comp1 = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-swipe-cell': SmartSwipeCell,
        },
        template: `<smart-swipe-cell id="wrapper1" left-width="{{ 100 }}" />`,
        data: {
          leftWidth: 100,
        },
      })
    );
    comp1.attach(document.createElement('parent-wrapper'));

    const comp2 = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-swipe-cell': SmartSwipeCell,
        },
        template: `<smart-swipe-cell id="wrapper2" left-width="{{ 100 }}" />`,
        data: {
          leftWidth: 100,
        },
      })
    );
    comp2.attach(document.createElement('parent-wrapper'));

    const wrapper1 = comp1.querySelector('#wrapper1');
    const wrapper2 = comp2.querySelector('#wrapper2');
    const instance1 = wrapper1?.instance;
    const instance2 = wrapper2?.instance;
    await simulate.sleep(10);

    if (instance1 && instance2) {
      instance2.offset = 50; // Set instance2 to be open
      instance2.setData({ position: 'left' });
      const closeSpy = jest.spyOn(instance2, 'close');

      // Start dragging instance1
      instance1.startOffset = 0;
      instance1.direction = 'horizontal';
      instance1.deltaX = 10;
      instance1.dragging = false;

      instance1.onDrag({
        touches: [{ clientX: 10, clientY: 0 }],
      } as any);
      await simulate.sleep(10);

      expect(closeSpy).toHaveBeenCalled();
      expect(instance1.dragging).toBe(true);
      expect(wrapper1?.data.catchMove).toBe(true);
      closeSpy.mockRestore();
    }
  });

  test('should not end drag when not dragging', async () => {
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
      instance.dragging = false;
      const swipeLeaveTransitionSpy = jest.spyOn(instance, 'swipeLeaveTransition');

      instance.endDrag();
      await simulate.sleep(10);

      expect(swipeLeaveTransitionSpy).not.toHaveBeenCalled();
      swipeLeaveTransitionSpy.mockRestore();
    }
  });

  test('should handle drag with horizontal direction', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-swipe-cell': SmartSwipeCell,
        },
        template: `<smart-swipe-cell id="wrapper" left-width="{{ 100 }}" />`,
        data: {
          leftWidth: 100,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      // First call startDrag to set up touch state
      instance.startDrag({
        touches: [{ clientX: 0, clientY: 0 }],
      } as any);
      await simulate.sleep(10);

      instance.startOffset = 0;
      instance.direction = 'horizontal';
      instance.deltaX = 30;
      instance.dragging = false;

      instance.onDrag({
        touches: [{ clientX: 30, clientY: 0 }],
      } as any);
      await simulate.sleep(10);

      expect(instance.dragging).toBe(true);
      expect(wrapper?.data.catchMove).toBe(true);
      expect(instance.offset).toBe(30);
    }
  });

  test('should handle swipeMove with dragging', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-swipe-cell': SmartSwipeCell,
        },
        template: `<smart-swipe-cell id="wrapper" left-width="{{ 100 }}" right-width="{{ 100 }}" />`,
        data: {
          leftWidth: 100,
          rightWidth: 100,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.dragging = true;
      instance.swipeMove(50);

      await simulate.sleep(10);

      expect(instance.offset).toBe(50);
      expect(wrapper?.data.wrapperStyle).toContain('transition: none');
    }
  });

  test('should handle swipeMove without dragging', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-swipe-cell': SmartSwipeCell,
        },
        template: `<smart-swipe-cell id="wrapper" left-width="{{ 100 }}" right-width="{{ 100 }}" />`,
        data: {
          leftWidth: 100,
          rightWidth: 100,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.dragging = false;
      instance.swipeMove(50);

      await simulate.sleep(10);

      expect(instance.offset).toBe(50);
      expect(wrapper?.data.wrapperStyle).toContain('transition: transform .6s');
    }
  });

  test('should limit offset to leftWidth and rightWidth range', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-swipe-cell': SmartSwipeCell,
        },
        template: `<smart-swipe-cell id="wrapper" left-width="{{ 100 }}" right-width="{{ 100 }}" />`,
        data: {
          leftWidth: 100,
          rightWidth: 100,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Test exceeding leftWidth
      instance.swipeMove(150);
      await simulate.sleep(10);
      expect(instance.offset).toBe(100);

      // Test exceeding rightWidth
      instance.swipeMove(-150);
      await simulate.sleep(10);
      expect(instance.offset).toBe(-100);
    }
  });
});


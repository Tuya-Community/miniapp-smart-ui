import path from 'path';
import simulate from 'miniprogram-simulate';

describe('action-sheet', () => {
  const SmartActionSheet = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-action-sheet',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  test('should emit select event when action item is clicked', async () => {
    const actions = [
      { name: '选项1' },
      { name: '选项2' },
    ];
    let selectItem: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-action-sheet': SmartActionSheet,
        },
        template: `
          <smart-action-sheet
            id="wrapper"
            show="{{ true }}"
            actions="{{ actions }}"
            bind:select="onSelect"
          />
        `,
        data: {
          actions,
        },
        methods: {
          onSelect(event: any) {
            selectItem = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const buttons = wrapper?.querySelectorAll('.smart-action-sheet__item');
    
    if (buttons && buttons[0]) {
      buttons[0].dispatchEvent('tap', {
        currentTarget: {
          dataset: { index: 0 },
        },
      });
      await simulate.sleep(10);
      expect(selectItem).toEqual(actions[0]);
    }
  });

  test('should emit close event when closeOnClickAction is true', async () => {
    const actions = [{ name: '选项1' }];
    let closeCalled = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-action-sheet': SmartActionSheet,
        },
        template: `
          <smart-action-sheet
            id="wrapper"
            show="{{ true }}"
            actions="{{ actions }}"
            close-on-click-action="{{ true }}"
            bind:close="onClose"
          />
        `,
        data: {
          actions,
        },
        methods: {
          onClose() {
            closeCalled = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const buttons = wrapper?.querySelectorAll('.smart-action-sheet__item');
    
    if (buttons && buttons[0]) {
      buttons[0].dispatchEvent('tap', {
        currentTarget: {
          dataset: { index: 0 },
        },
      });
      await simulate.sleep(10);
      expect(closeCalled).toBe(true);
    }
  });

  test('should not emit close event when closeOnClickAction is false', async () => {
    const actions = [{ name: '选项1' }];
    let closeCalled = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-action-sheet': SmartActionSheet,
        },
        template: `
          <smart-action-sheet
            id="wrapper"
            show="{{ true }}"
            actions="{{ actions }}"
            close-on-click-action="{{ false }}"
            bind:close="onClose"
          />
        `,
        data: {
          actions,
        },
        methods: {
          onClose() {
            closeCalled = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const buttons = wrapper?.querySelectorAll('.smart-action-sheet__item');
    
    if (buttons && buttons[0]) {
      buttons[0].dispatchEvent('tap', {
        currentTarget: {
          dataset: { index: 0 },
        },
      });
      await simulate.sleep(10);
      expect(closeCalled).toBe(false);
    }
  });

  test('should not emit select when item does not exist', async () => {
    const actions = [{ name: '选项1' }];
    let selectCalled = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-action-sheet': SmartActionSheet,
        },
        template: `
          <smart-action-sheet
            id="wrapper"
            show="{{ true }}"
            actions="{{ actions }}"
            bind:select="onSelect"
          />
        `,
        data: {
          actions,
        },
        methods: {
          onSelect() {
            selectCalled = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      // Directly call onSelect with invalid index
      instance.onSelect({
        currentTarget: {
          dataset: { index: 999 },
        },
      } as any);
      await simulate.sleep(10);
      expect(selectCalled).toBe(false);
    }
  });

  test('should emit cancel event', async () => {
    let cancelCalled = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-action-sheet': SmartActionSheet,
        },
        template: `
          <smart-action-sheet
            id="wrapper"
            show="{{ true }}"
            cancel-text="取消"
            bind:cancel="onCancel"
          />
        `,
        methods: {
          onCancel() {
            cancelCalled = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const cancelBtn = wrapper?.querySelector('.smart-action-sheet__cancel');
    
    if (cancelBtn) {
      cancelBtn.dispatchEvent('tap');
      await simulate.sleep(10);
      expect(cancelCalled).toBe(true);
    }
  });

  test('should emit confirm event', async () => {
    let confirmCalled = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-action-sheet': SmartActionSheet,
        },
        template: `
          <smart-action-sheet
            id="wrapper"
            show="{{ true }}"
            confirm-text="确认"
            bind:confirm="onConfirm"
          />
        `,
        methods: {
          onConfirm() {
            confirmCalled = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const confirmBtn = wrapper?.querySelector('.smart-action-sheet__confirm');
    
    if (confirmBtn) {
      confirmBtn.dispatchEvent('tap');
      await simulate.sleep(10);
      expect(confirmCalled).toBe(true);
    }
  });

  test('should emit close event', async () => {
    let closeCalled = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-action-sheet': SmartActionSheet,
        },
        template: `
          <smart-action-sheet
            id="wrapper"
            show="{{ true }}"
            bind:close="onClose"
          />
        `,
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
    
    if (instance) {
      instance.onClose();
      await simulate.sleep(10);
      expect(closeCalled).toBe(true);
    }
  });

  test('should emit click-overlay and close events when overlay is clicked', async () => {
    let clickOverlayCalled = false;
    let closeCalled = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-action-sheet': SmartActionSheet,
        },
        template: `
          <smart-action-sheet
            id="wrapper"
            show="{{ true }}"
            bind:click-overlay="onClickOverlay"
            bind:close="onClose"
          />
        `,
        methods: {
          onClickOverlay() {
            clickOverlayCalled = true;
          },
          onClose() {
            closeCalled = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      instance.onClickOverlay();
      await simulate.sleep(10);
      expect(clickOverlayCalled).toBe(true);
      expect(closeCalled).toBe(true);
    }
  });

  test('should emit before-enter event', async () => {
    let beforeEnterCalled = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-action-sheet': SmartActionSheet,
        },
        template: `
          <smart-action-sheet
            id="wrapper"
            show="{{ true }}"
            bind:before-enter="onBeforeEnter"
          />
        `,
        methods: {
          onBeforeEnter() {
            beforeEnterCalled = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      instance.onBeforeEnter();
      await simulate.sleep(10);
      expect(beforeEnterCalled).toBe(true);
    }
  });

  test('should emit enter event', async () => {
    let enterCalled = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-action-sheet': SmartActionSheet,
        },
        template: `
          <smart-action-sheet
            id="wrapper"
            show="{{ true }}"
            bind:enter="onEnter"
          />
        `,
        methods: {
          onEnter() {
            enterCalled = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      instance.onEnter();
      await simulate.sleep(10);
      expect(enterCalled).toBe(true);
    }
  });

  test('should emit after-enter event', async () => {
    let afterEnterCalled = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-action-sheet': SmartActionSheet,
        },
        template: `
          <smart-action-sheet
            id="wrapper"
            show="{{ true }}"
            bind:after-enter="onAfterEnter"
          />
        `,
        methods: {
          onAfterEnter() {
            afterEnterCalled = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      instance.onAfterEnter();
      await simulate.sleep(10);
      expect(afterEnterCalled).toBe(true);
    }
  });

  test('should emit before-leave event', async () => {
    let beforeLeaveCalled = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-action-sheet': SmartActionSheet,
        },
        template: `
          <smart-action-sheet
            id="wrapper"
            show="{{ true }}"
            bind:before-leave="onBeforeLeave"
          />
        `,
        methods: {
          onBeforeLeave() {
            beforeLeaveCalled = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      instance.onBeforeLeave();
      await simulate.sleep(10);
      expect(beforeLeaveCalled).toBe(true);
    }
  });

  test('should emit leave event', async () => {
    let leaveCalled = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-action-sheet': SmartActionSheet,
        },
        template: `
          <smart-action-sheet
            id="wrapper"
            show="{{ true }}"
            bind:leave="onLeave"
          />
        `,
        methods: {
          onLeave() {
            leaveCalled = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      instance.onLeave();
      await simulate.sleep(10);
      expect(leaveCalled).toBe(true);
    }
  });

  test('should emit after-leave event', async () => {
    let afterLeaveCalled = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-action-sheet': SmartActionSheet,
        },
        template: `
          <smart-action-sheet
            id="wrapper"
            show="{{ true }}"
            bind:after-leave="onAfterLeave"
          />
        `,
        methods: {
          onAfterLeave() {
            afterLeaveCalled = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      instance.onAfterLeave();
      await simulate.sleep(10);
      expect(afterLeaveCalled).toBe(true);
    }
  });
});


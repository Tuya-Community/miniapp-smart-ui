import path from 'path';
import simulate from 'miniprogram-simulate';

describe('bottom-sheet', () => {
  const SmartBottomSheet = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-bottom-sheet',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  beforeEach(() => {
    // Mock getSystemInfoSync
    const originalGetSystemInfoSync = wx.getSystemInfoSync;
    wx.getSystemInfoSync = jest.fn(() => ({
      windowHeight: 800,
      platform: 'ios',
    })) as any;

    // Mock ty.getThemeInfo via wx
    const WX: any = wx;
    WX.getThemeInfo = jest.fn(() => ({}));
  });

  test('should render with default props', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-bottom-sheet': SmartBottomSheet,
        },
        template: `<smart-bottom-sheet id="wrapper" show="{{ true }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.show).toBe(true);
    expect(wrapper?.data.round).toBe(true);
    expect(wrapper?.data.zIndex).toBe(100);
    expect(wrapper?.data.draggable).toBe(false);
    expect(wrapper?.data.overlay).toBe(true);
    expect(wrapper?.data.closeOnClickOverlay).toBe(true);
    expect(wrapper?.data.showClose).toBe(true);
    expect(wrapper?.data.iconSize).toBe(24);
    expect(wrapper?.data.defaultDragPosition).toBe('middle');
  });

  test('should render with title', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-bottom-sheet': SmartBottomSheet,
        },
        template: `<smart-bottom-sheet id="wrapper" show="{{ true }}" title="Test Title" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.title).toBe('Test Title');
  });

  test('should show close icon when title and showClose are true', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-bottom-sheet': SmartBottomSheet,
        },
        template: `<smart-bottom-sheet id="wrapper" show="{{ true }}" title="Test Title" show-close="{{ true }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.title).toBe('Test Title');
    expect(wrapper?.data.showClose).toBe(true);
  });

  test('should not show close icon when showClose is false', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-bottom-sheet': SmartBottomSheet,
        },
        template: `<smart-bottom-sheet id="wrapper" show="{{ true }}" title="Test Title" show-close="{{ false }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.showClose).toBe(false);
  });

  test('should use custom iconColor', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-bottom-sheet': SmartBottomSheet,
        },
        template: `<smart-bottom-sheet id="wrapper" show="{{ true }}" title="Test Title" icon-color="#FF0000" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.iconColor).toBe('#FF0000');
    expect(wrapper?.data.xmarkIconColor).toBe('#FF0000');
  });

  test('should use custom iconSize', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-bottom-sheet': SmartBottomSheet,
        },
        template: `<smart-bottom-sheet id="wrapper" show="{{ true }}" title="Test Title" icon-size="{{ 32 }}" />`,
        data: {
          iconSize: 32,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.iconSize).toBe(32);
  });

  test('should emit close event when close icon is clicked', async () => {
    let closeCalled = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-bottom-sheet': SmartBottomSheet,
        },
        template: `
          <smart-bottom-sheet
            id="wrapper"
            show="{{ true }}"
            title="Test Title"
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
          'smart-bottom-sheet': SmartBottomSheet,
        },
        template: `
          <smart-bottom-sheet
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
          'smart-bottom-sheet': SmartBottomSheet,
        },
        template: `
          <smart-bottom-sheet
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
          'smart-bottom-sheet': SmartBottomSheet,
        },
        template: `
          <smart-bottom-sheet
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

  test('should update currentHeight when enter event is triggered with draggable', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-bottom-sheet': SmartBottomSheet,
        },
        template: `
          <smart-bottom-sheet
            id="wrapper"
            show="{{ true }}"
            draggable="{{ true }}"
            mid-drag-height="{{ 400 }}"
            default-drag-position="middle"
          />
        `,
        data: {
          draggable: true,
          midDragHeight: 400,
          defaultDragPosition: 'middle',
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      instance.onEnter();
      await simulate.sleep(10);
      expect(wrapper?.data.currentHeight).toBe(400);
    }
  });

  test('should emit after-enter event', async () => {
    let afterEnterCalled = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-bottom-sheet': SmartBottomSheet,
        },
        template: `
          <smart-bottom-sheet
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
          'smart-bottom-sheet': SmartBottomSheet,
        },
        template: `
          <smart-bottom-sheet
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
          'smart-bottom-sheet': SmartBottomSheet,
        },
        template: `
          <smart-bottom-sheet
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
          'smart-bottom-sheet': SmartBottomSheet,
        },
        template: `
          <smart-bottom-sheet
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

  test('should get drag position as middle', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-bottom-sheet': SmartBottomSheet,
        },
        template: `
          <smart-bottom-sheet
            id="wrapper"
            show="{{ true }}"
            default-drag-position="middle"
            mid-drag-height="{{ 400 }}"
          />
        `,
        data: {
          defaultDragPosition: 'middle',
          midDragHeight: 400,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      const position = instance.getDragPosition();
      expect(position).toBe(400);
    }
  });

  test('should get drag position as min', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-bottom-sheet': SmartBottomSheet,
        },
        template: `
          <smart-bottom-sheet
            id="wrapper"
            show="{{ true }}"
            default-drag-position="min"
            min-drag-height="{{ 100 }}"
          />
        `,
        data: {
          defaultDragPosition: 'min',
          minDragHeight: 100,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      const position = instance.getDragPosition();
      expect(position).toBe(100);
    }
  });

  test('should get drag position as max', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-bottom-sheet': SmartBottomSheet,
        },
        template: `
          <smart-bottom-sheet
            id="wrapper"
            show="{{ true }}"
            default-drag-position="max"
            max-drag-height="{{ 600 }}"
          />
        `,
        data: {
          defaultDragPosition: 'max',
          maxDragHeight: 600,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      const position = instance.getDragPosition();
      expect(position).toBe(600);
    }
  });

  test('should initialize instanceId when provided', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-bottom-sheet': SmartBottomSheet,
        },
        template: `
          <smart-bottom-sheet
            id="wrapper"
            show="{{ true }}"
            instance-id="custom-instance-id"
          />
        `,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.instanceId).toBe('custom-instance-id');
    expect(wrapper?.data.curInstanceId).toBe('custom-instance-id');
  });

  test('should generate instanceId when not provided', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-bottom-sheet': SmartBottomSheet,
        },
        template: `
          <smart-bottom-sheet
            id="wrapper"
            show="{{ true }}"
          />
        `,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.curInstanceId).toBeTruthy();
    expect(wrapper?.data.curInstanceId).toContain('smart-ui-bottom-sheet_');
  });

  test('should use default xmarkIconColor when theme info is not available', async () => {
    const WX: any = wx;
    WX.getThemeInfo = jest.fn(() => null);

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-bottom-sheet': SmartBottomSheet,
        },
        template: `
          <smart-bottom-sheet
            id="wrapper"
            show="{{ true }}"
            title="Test Title"
          />
        `,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.xmarkIconColor).toBe('rgba(0, 0, 0, 0.5)');
  });

  test('should set windowHeight from system info', async () => {
    const originalGetSystemInfoSync = wx.getSystemInfoSync;
    wx.getSystemInfoSync = jest.fn(() => ({
      windowHeight: 1000,
      platform: 'android',
    })) as any;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-bottom-sheet': SmartBottomSheet,
        },
        template: `
          <smart-bottom-sheet
            id="wrapper"
            show="{{ true }}"
          />
        `,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    // windowHeight should be set from system info
    expect(wrapper?.data.windowHeight).toBeTruthy();
    expect(typeof wrapper?.data.windowHeight).toBe('number');
    
    wx.getSystemInfoSync = originalGetSystemInfoSync;
  });

  test('should handle draggable prop', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-bottom-sheet': SmartBottomSheet,
        },
        template: `
          <smart-bottom-sheet
            id="wrapper"
            show="{{ true }}"
            draggable="{{ true }}"
          />
        `,
        data: {
          draggable: true,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.draggable).toBe(true);
  });

  test('should handle round prop', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-bottom-sheet': SmartBottomSheet,
        },
        template: `
          <smart-bottom-sheet
            id="wrapper"
            show="{{ true }}"
            round="{{ false }}"
          />
        `,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.round).toBe(false);
  });

  test('should handle zIndex prop', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-bottom-sheet': SmartBottomSheet,
        },
        template: `
          <smart-bottom-sheet
            id="wrapper"
            show="{{ true }}"
            z-index="{{ 200 }}"
          />
        `,
        data: {
          zIndex: 200,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.zIndex).toBe(200);
  });

  test('should handle overlay prop', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-bottom-sheet': SmartBottomSheet,
        },
        template: `
          <smart-bottom-sheet
            id="wrapper"
            show="{{ true }}"
            overlay="{{ false }}"
          />
        `,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.overlay).toBe(false);
  });

  test('should handle closeOnClickOverlay prop', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-bottom-sheet': SmartBottomSheet,
        },
        template: `
          <smart-bottom-sheet
            id="wrapper"
            show="{{ true }}"
            close-on-click-overlay="{{ false }}"
          />
        `,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.closeOnClickOverlay).toBe(false);
  });

  test('should handle rootPortal prop', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-bottom-sheet': SmartBottomSheet,
        },
        template: `
          <smart-bottom-sheet
            id="wrapper"
            show="{{ true }}"
            root-portal="{{ true }}"
          />
        `,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.rootPortal).toBe(true);
  });

  test('should handle contentHeight prop', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-bottom-sheet': SmartBottomSheet,
        },
        template: `
          <smart-bottom-sheet
            id="wrapper"
            show="{{ true }}"
            content-height="{{ 500 }}"
          />
        `,
        data: {
          contentHeight: 500,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.contentHeight).toBe(500);
  });

  test('should handle maxHeight prop', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-bottom-sheet': SmartBottomSheet,
        },
        template: `
          <smart-bottom-sheet
            id="wrapper"
            show="{{ true }}"
            max-height="{{ 600 }}"
          />
        `,
        data: {
          maxHeight: 600,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.maxHeight).toBe(600);
  });
});


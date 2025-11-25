import path from 'path';
import simulate from 'miniprogram-simulate';

describe('dropdown-item', () => {
  const SmartDropdownItem = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-dropdown-item',
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
    }) as any;

    // Mock ty.getThemeInfo
    const WX: any = wx;
    WX.getThemeInfo = jest.fn(() => ({
      '--app-M1': '#3678E3',
    }));

    return () => {
      wx.nextTick = originalNextTick;
    };
  });

  test('should emit open event', async () => {
    let openEmitted = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dropdown-item': SmartDropdownItem,
        },
        template: `<smart-dropdown-item id="wrapper" bind:open="onOpen" />`,
        methods: {
          onOpen() {
            openEmitted = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onOpen();
      await simulate.sleep(10);

      expect(openEmitted).toBe(true);
    }
  });

  test('should emit opened event', async () => {
    let openedEmitted = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dropdown-item': SmartDropdownItem,
        },
        template: `<smart-dropdown-item id="wrapper" bind:opened="onOpened" />`,
        methods: {
          onOpened() {
            openedEmitted = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onOpened();
      await simulate.sleep(10);

      expect(openedEmitted).toBe(true);
    }
  });

  test('should emit close event', async () => {
    let closeEmitted = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dropdown-item': SmartDropdownItem,
        },
        template: `<smart-dropdown-item id="wrapper" bind:close="onClose" />`,
        methods: {
          onClose() {
            closeEmitted = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onClose();
      await simulate.sleep(10);

      expect(closeEmitted).toBe(true);
    }
  });

  test('should emit closed event and hide wrapper', async () => {
    let closedEmitted = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dropdown-item': SmartDropdownItem,
        },
        template: `<smart-dropdown-item id="wrapper" bind:closed="onClosed" />`,
        methods: {
          onClosed() {
            closedEmitted = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ showWrapper: true });
      instance.onClosed();
      await simulate.sleep(10);

      expect(closedEmitted).toBe(true);
      expect(wrapper?.data.showWrapper).toBe(false);
    }
  });


  test('should not toggle when show is same as current state', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dropdown-item': SmartDropdownItem,
        },
        template: `<smart-dropdown-item id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ showPopup: false });
      instance.toggle(false);
      await simulate.sleep(10);

      // Should not change
      expect(wrapper?.data.showPopup).toBe(false);
    }
  });


  test('should handle before-toggle when useBeforeToggle is false', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dropdown-item': SmartDropdownItem,
        },
        template: `<smart-dropdown-item id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ useBeforeToggle: false });

      const result = await instance.onBeforeToggle(true);

      expect(result).toBe(true);
    }
  });

  test('should handle before-toggle when useBeforeToggle is true', async () => {
    let beforeToggleEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dropdown-item': SmartDropdownItem,
        },
        template: `<smart-dropdown-item id="wrapper" use-before-toggle="{{ true }}" bind:before-toggle="onBeforeToggle" />`,
        data: {
          useBeforeToggle: true,
        },
        methods: {
          onBeforeToggle(event: any) {
            beforeToggleEvent = event.detail;
            // Call callback to allow toggle
            event.detail.callback(true);
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const promise = instance.onBeforeToggle(true);
      await simulate.sleep(10);

      expect(beforeToggleEvent).toBeTruthy();
      expect(beforeToggleEvent.status).toBe(true);
      expect(typeof beforeToggleEvent.callback).toBe('function');

      const result = await promise;
      expect(result).toBe(true);
    }
  });

  test('should update checkMarkIconColor from theme info', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dropdown-item': SmartDropdownItem,
        },
        template: `<smart-dropdown-item id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    // checkMarkIconColor should be set from theme info or default
    expect(wrapper?.data.checkMarkIconColor).toBeTruthy();
  });
});


import path from 'path';
import simulate from 'miniprogram-simulate';

describe('popup', () => {
  const SmartPopup = simulate.load(path.resolve(__dirname, '../index'), 'smart-popup', {
    rootPath: path.resolve(__dirname, '../../'),
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render with default props', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-popup': SmartPopup,
        },
        template: `<smart-popup id="wrapper" show="{{ true }}" />`,
        data: {
          show: true,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.position).toBe('center');
    expect(wrapper?.data.overlay).toBe(true);
  });

  test('should emit close event when close icon is clicked', async () => {
    let closeEmitted = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-popup': SmartPopup,
        },
        template: `<smart-popup id="wrapper" show="{{ true }}" closeable bind:close="onClose" />`,
        data: {
          show: true,
        },
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
      // Spy on $emit to verify it's called
      const emitSpy = jest.spyOn(instance, '$emit');

      instance.onClickCloseIcon();
      await simulate.sleep(10);

      expect(closeEmitted).toBe(true);
      expect(emitSpy).toHaveBeenCalledWith('close');

      emitSpy.mockRestore();
    }
  });

  test('should emit click-overlay and close events when overlay is clicked', async () => {
    let clickOverlayEmitted = false;
    let closeEmitted = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-popup': SmartPopup,
        },
        template: `<smart-popup id="wrapper" show="{{ true }}" close-on-click-overlay bind:click-overlay="onClickOverlay" bind:close="onClose" />`,
        data: {
          show: true,
        },
        methods: {
          onClickOverlay() {
            clickOverlayEmitted = true;
          },
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
      // Spy on $emit to verify it's called
      const emitSpy = jest.spyOn(instance, '$emit');

      instance.setData({ closeOnClickOverlay: true });
      instance.onClickOverlay();
      await simulate.sleep(10);

      expect(clickOverlayEmitted).toBe(true);
      expect(closeEmitted).toBe(true);
      expect(emitSpy).toHaveBeenCalledWith('click-overlay');
      expect(emitSpy).toHaveBeenCalledWith('close');

      emitSpy.mockRestore();
    }
  });

  test('should only emit click-overlay when closeOnClickOverlay is false', async () => {
    let clickOverlayEmitted = false;
    let closeEmitted = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-popup': SmartPopup,
        },
        template: `<smart-popup id="wrapper" show="{{ true }}" close-on-click-overlay="{{ false }}" bind:click-overlay="onClickOverlay" bind:close="onClose" />`,
        data: {
          show: true,
        },
        methods: {
          onClickOverlay() {
            clickOverlayEmitted = true;
          },
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
      // Spy on $emit to verify it's called
      const emitSpy = jest.spyOn(instance, '$emit');

      instance.setData({ closeOnClickOverlay: false });
      instance.onClickOverlay();
      await simulate.sleep(10);

      expect(clickOverlayEmitted).toBe(true);
      expect(closeEmitted).toBe(false);
      expect(emitSpy).toHaveBeenCalledWith('click-overlay');
      expect(emitSpy).not.toHaveBeenCalledWith('close');
      expect(emitSpy).toHaveBeenCalledTimes(1);

      emitSpy.mockRestore();
    }
  });

  test('should set duration to 0 when transition is none', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-popup': SmartPopup,
        },
        template: `<smart-popup id="wrapper" show="{{ true }}" transition="none" />`,
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
      // Set initial duration
      instance.setData({ transition: 'none', duration: 300 });

      // Call observeClass to trigger transition === 'none' branch
      instance.observeClass();
      await simulate.sleep(10);

      // Verify duration is set to 0 and originDuration is saved
      expect(wrapper?.data.duration).toBe(0);
      expect(instance.originDuration).toBe(300);
      expect(wrapper?.data.name).toBe('none');
    }
  });

  test('should restore originDuration when transition changes from none to other', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-popup': SmartPopup,
        },
        template: `<smart-popup id="wrapper" show="{{ true }}" transition="none" />`,
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
      // First set transition to 'none' to trigger the first branch
      instance.setData({ transition: 'none', duration: 300 });
      instance.observeClass();
      await simulate.sleep(10);

      expect(wrapper?.data.duration).toBe(0);
      expect(instance.originDuration).toBe(300);
      expect(wrapper?.data.name).toBe('none');

      // Then change transition to 'fade' to trigger the else if branch (originDuration != null)
      instance.setData({ transition: 'fade' });
      instance.observeClass();
      await simulate.sleep(10);

      // Verify originDuration is restored
      expect(wrapper?.data.duration).toBe(300);
      expect(wrapper?.data.name).toBe('fade');
    }
  });

  test('should use position when transition is not provided', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-popup': SmartPopup,
        },
        template: `<smart-popup id="wrapper" show="{{ true }}" position="bottom" />`,
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
      instance.setData({ position: 'bottom', transition: '' });
      instance.observeClass();
      await simulate.sleep(10);

      expect(wrapper?.data.name).toBe('bottom');
    }
  });

  test('should use transition when provided', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-popup': SmartPopup,
        },
        template: `<smart-popup id="wrapper" show="{{ true }}" transition="fade" position="bottom" />`,
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
      instance.setData({ transition: 'fade', position: 'bottom' });
      instance.observeClass();
      await simulate.sleep(10);

      expect(wrapper?.data.name).toBe('fade');
    }
  });

  test('should call observeClass on created', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-popup': SmartPopup,
        },
        template: `<smart-popup id="wrapper" show="{{ true }}" />`,
        data: {
          show: true,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    // observeClass should be called in created, so name should be set
    expect(wrapper?.data.name).toBeDefined();
  });

  test('safeAreaInsetBottomMin should default to 0', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-popup': SmartPopup,
        },
        template: `<smart-popup id="wrapper" show="{{ true }}" position="bottom" safe-area-inset-bottom="{{ true }}" />`,
        data: {
          show: true,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.safeAreaInsetBottomMin).toBe(0);
  });

  test('should apply CSS env(safe-area-inset-bottom) + 16px floored by min when safeAreaInsetBottom is true', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-popup': SmartPopup,
        },
        template: `<smart-popup id="wrapper" show="{{ true }}" position="bottom" safe-area-inset-bottom="{{ true }}" safe-area-inset-bottom-min="{{ 16 }}" />`,
        data: {
          show: true,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper: any = comp.querySelector('#wrapper');
    await simulate.sleep(50);

    const html = wrapper?.dom?.innerHTML || '';
    expect(html).toContain(
      'margin-bottom:max(calc(env(safe-area-inset-bottom) + 16px), 16px)'
    );
  });

  test('should not apply safe-area margin when safeAreaInsetBottom is false', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-popup': SmartPopup,
        },
        template: `<smart-popup id="wrapper" show="{{ true }}" position="bottom" safe-area-inset-bottom="{{ false }}" />`,
        data: {
          show: true,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper: any = comp.querySelector('#wrapper');
    await simulate.sleep(50);

    const html = wrapper?.dom?.innerHTML || '';
    expect(html).not.toContain('env(safe-area-inset-bottom)');
  });
});

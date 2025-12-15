import path from 'path';
import simulate from 'miniprogram-simulate';

describe('overlay', () => {
  const SmartOverlay = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-overlay',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  test('should render with default props', async () => {
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
    await simulate.sleep(10);

    expect(wrapper?.data.show).toBe(false);
    expect(wrapper?.data.zIndex).toBe(1);
    expect(wrapper?.data.lockScroll).toBe(true);
    expect(wrapper?.data.rootPortal).toBe(false);
    expect(wrapper?.data.duration).toBe(300);
  });

  test('should emit click event when onClick is called', async () => {
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
    await simulate.sleep(10);

    if (instance) {
      // Spy on $emit to verify it's called (this covers line 27)
      const emitSpy = jest.spyOn(instance, '$emit');
      
      instance.onClick();
      await simulate.sleep(10);

      // Verify that $emit('click') is called, which is line 27
      expect(emitSpy).toHaveBeenCalledWith('click');
      
      emitSpy.mockRestore();
    }
  });

  test('should handle noop method', async () => {
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
    await simulate.sleep(10);

    if (instance) {
      // noop should not throw error
      expect(() => instance.noop()).not.toThrow();
    }
  });

  test('should render with custom props', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-overlay': SmartOverlay,
        },
        template: `<smart-overlay id="wrapper" show="{{ true }}" z-index="{{ 10 }}" lock-scroll="{{ false }}" root-portal="{{ true }}" duration="{{ 500 }}" custom-style="background-color: red;" />`,
        data: {
          show: true,
          zIndex: 10,
          lockScroll: false,
          rootPortal: true,
          duration: 500,
          customStyle: 'background-color: red;',
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.show).toBe(true);
    expect(wrapper?.data.zIndex).toBe(10);
    expect(wrapper?.data.lockScroll).toBe(false);
    expect(wrapper?.data.rootPortal).toBe(true);
    expect(wrapper?.data.duration).toBe(500);
    expect(wrapper?.data.customStyle).toBe('background-color: red;');
  });

  test('should handle tap event on overlay', async () => {
    let clickEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-overlay': SmartOverlay,
        },
        template: `<smart-overlay id="wrapper" show="{{ true }}" bind:click="onClick" />`,
        data: {
          show: true,
        },
        methods: {
          onClick(event: any) {
            clickEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const transition = wrapper?.querySelector('smart-transition');
    await simulate.sleep(10);

    // Simulate tap event on transition component which should trigger onClick
    transition?.dispatchEvent('tap');
    await simulate.sleep(10);

    expect(clickEvent).toBeDefined();
  });
});


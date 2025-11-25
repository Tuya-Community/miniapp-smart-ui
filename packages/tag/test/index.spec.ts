import path from 'path';
import simulate from 'miniprogram-simulate';

describe('tag', () => {
  const SmartTag = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-tag',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  test('should render with default props', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-tag': SmartTag,
        },
        template: `<smart-tag id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.type).toBe('default');
    expect(wrapper?.data.closeColor).toBe('#fff');
  });

  test('should render with custom type', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-tag': SmartTag,
        },
        template: `<smart-tag id="wrapper" type="primary" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.type).toBe('primary');
  });

  test('should render with size prop', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-tag': SmartTag,
        },
        template: `<smart-tag id="wrapper" size="large" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.size).toBe('large');
  });

  test('should render with mark prop', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-tag': SmartTag,
        },
        template: `<smart-tag id="wrapper" mark="{{ true }}" />`,
        data: {
          mark: true,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.mark).toBe(true);
  });

  test('should render with color prop', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-tag': SmartTag,
        },
        template: `<smart-tag id="wrapper" color="#ff0000" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.color).toBe('#ff0000');
  });

  test('should render with plain prop', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-tag': SmartTag,
        },
        template: `<smart-tag id="wrapper" plain="{{ true }}" />`,
        data: {
          plain: true,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.plain).toBe(true);
  });

  test('should render with round prop', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-tag': SmartTag,
        },
        template: `<smart-tag id="wrapper" round="{{ true }}" />`,
        data: {
          round: true,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.round).toBe(true);
  });

  test('should render with textColor prop', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-tag': SmartTag,
        },
        template: `<smart-tag id="wrapper" text-color="#00ff00" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.textColor).toBe('#00ff00');
  });

  test('should render with closeable prop', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-tag': SmartTag,
        },
        template: `<smart-tag id="wrapper" closeable="{{ true }}" />`,
        data: {
          closeable: true,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.closeable).toBe(true);
  });

  test('should emit close event when onClose is called', async () => {
    let closeEmitted = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-tag': SmartTag,
        },
        template: `<smart-tag id="wrapper" closeable="{{ true }}" bind:close="onClose" />`,
        data: {
          closeable: true,
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
      instance.onClose();
      await simulate.sleep(10);

      expect(closeEmitted).toBe(true);
    }
  });

  test('should emit close event when close icon is clicked', async () => {
    let closeEmitted = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-tag': SmartTag,
        },
        template: `<smart-tag id="wrapper" closeable="{{ true }}" bind:close="onClose" />`,
        data: {
          closeable: true,
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
    await simulate.sleep(10);

    // Find the close icon and click it
    const closeIcon = wrapper?.querySelector('.smart-tag__close');
    if (closeIcon) {
      closeIcon.dispatchEvent('tap');
      await simulate.sleep(10);

      expect(closeEmitted).toBe(true);
    }
  });
});


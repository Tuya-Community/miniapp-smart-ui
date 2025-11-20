import path from 'path';
import simulate from 'miniprogram-simulate';

describe('button', () => {
  const SmartButton = simulate.load(
    path.resolve(__dirname, '../../button/index'),
    'smart-button',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  test('should emit click event', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" bind:click="onClick" />`,
        data: {
          tapValue: 0,
        },
        methods: {
          onClick() {
            this.setData({
              tapValue: this.data.tapValue + 1,
            });
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const btn = wrapper?.querySelector('.smart-button');
    btn?.dispatchEvent('tap');
    await simulate.sleep(10);
    expect(comp.data.tapValue).toEqual(1);
  });

  test('should not emit click event when disabled', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" disabled bind:click="onClick" />`,
        data: {
          tapValue: 0,
        },
        methods: {
          onClick() {
            this.setData({
              tapValue: this.data.tapValue + 1,
            });
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const btn = wrapper?.querySelector('.smart-button');
    btn?.dispatchEvent('tap');
    await simulate.sleep(10);
    expect(comp.data.tapValue).toEqual(0);
  });

  test('should render with different types', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `
          <smart-button id="default" type="default" />
          <smart-button id="primary" type="primary" />
          <smart-button id="success" type="success" />
          <smart-button id="warning" type="warning" />
          <smart-button id="danger" type="danger" />
        `,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const defaultBtn = comp.querySelector('#default');
    const primaryBtn = comp.querySelector('#primary');
    const successBtn = comp.querySelector('#success');
    const warningBtn = comp.querySelector('#warning');
    const dangerBtn = comp.querySelector('#danger');

    await simulate.sleep(10);
    expect(defaultBtn?.data.type).toBe('default');
    expect(primaryBtn?.data.type).toBe('primary');
    expect(successBtn?.data.type).toBe('success');
    expect(warningBtn?.data.type).toBe('warning');
    expect(dangerBtn?.data.type).toBe('danger');
  });

  test('should render with different sizes', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `
          <smart-button id="large" size="large" />
          <smart-button id="normal" size="normal" />
          <smart-button id="small" size="small" />
          <smart-button id="mini" size="mini" />
        `,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const largeBtn = comp.querySelector('#large');
    const normalBtn = comp.querySelector('#normal');
    const smallBtn = comp.querySelector('#small');
    const miniBtn = comp.querySelector('#mini');

    await simulate.sleep(10);
    expect(largeBtn?.data.size).toBe('large');
    expect(normalBtn?.data.size).toBe('normal');
    expect(smallBtn?.data.size).toBe('small');
    expect(miniBtn?.data.size).toBe('mini');
  });

  test('should render with loading state', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" loading="{{ true }}" loading-text="加载中..." />`,
        data: {
          loading: true,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.loading).toBe(true);
    expect(wrapper?.data.loadingText).toBe('加载中...');
  });

  test('should render with icon', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" icon="star" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.icon).toBe('star');
  });

  test('should render with right icon', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" right-icon="arrow" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.rightIcon).toBe('arrow');
  });

  test('should render with plain style', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" plain="{{ true }}" />`,
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

  test('should render with block style', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" block="{{ true }}" />`,
        data: {
          block: true,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.block).toBe(true);
  });

  test('should render with round style', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" round="{{ true }}" />`,
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

  test('should render with square style', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" square="{{ true }}" />`,
        data: {
          square: true,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.square).toBe(true);
  });

  test('should render with hairline style', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" hairline="{{ true }}" />`,
        data: {
          hairline: true,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.hairline).toBe(true);
  });

  test('should render with custom color', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" color="#ff0000" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.color).toBe('#ff0000');
  });

  test('should render with custom loading type', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" loading="{{ true }}" loading-type="spinner" />`,
        data: {
          loading: true,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.loadingType).toBe('spinner');
  });

  test('should render with custom loading size', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" loading="{{ true }}" loading-size="30px" />`,
        data: {
          loading: true,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.loadingSize).toBe('30px');
  });

  test('should render with formType', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" form-type="submit" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.formType).toBe('submit');
  });

  test('should render with custom style', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" custom-style="background-color: red;" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.customStyle).toBe('background-color: red;');
  });

  test('should render with text style', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" text-style="font-size: 16px;" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.textStyle).toBe('font-size: 16px;');
  });

  test('should render with custom class prefix', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" class-prefix="custom-icon" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.classPrefix).toBe('custom-icon');
  });

  test('should render with dataset', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" dataset="{{ { key: 'value' } }}" />`,
        data: {
          dataset: { key: 'value' },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.dataset).toEqual({ key: 'value' });
  });

  test('should emit click event with event detail', async () => {
    let clickEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" bind:click="onClick" />`,
        methods: {
          onClick(event: any) {
            clickEvent = event;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const btn = wrapper?.querySelector('.smart-button');
    const mockEvent = { detail: { test: 'data' } };
    btn?.dispatchEvent('tap', mockEvent);
    await simulate.sleep(10);
    expect(clickEvent).toBeTruthy();
  });
});

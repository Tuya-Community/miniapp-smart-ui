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
});

import path from 'path';
import simulate from 'miniprogram-simulate';

describe('switch', () => {
  const SmartSwitch = simulate.load(
    path.resolve(__dirname, '../../switch/index'),
    'smart-switch',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  test('should allow to custom active-value and inactive-value', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-switch': SmartSwitch,
        },
        template: `
          <smart-switch
            id="wrapper"
            checked="{{ checked }}"
            active-color="#07c160"
            inactive-color="#ee0a24"
            active-value="on"
            inactive-value="off"
            bind:change="onChange"
          />
        `,
        data: {
          checked: 'on',
        },
        methods: {
          onChange({ detail }) {
            this.setData({ checked: detail });
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const btn = wrapper?.querySelector('.smart-switch');
    expect((btn as any).toJSON()).toMatchSnapshot();
    btn?.dispatchEvent('tap');
    await simulate.sleep(10);
    expect((btn as any).toJSON()).toMatchSnapshot();
    expect(comp.data.checked).toEqual('off');
  });

  test('should not emit events when disabled', async () => {
    let inputEvent: any = null;
    let changeEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-switch': SmartSwitch,
        },
        template: `
          <smart-switch
            id="wrapper"
            checked="{{ checked }}"
            disabled
            bind:input="onInput"
            bind:change="onChange"
          />
        `,
        data: {
          checked: false,
        },
        methods: {
          onInput(event: any) {
            inputEvent = event.detail;
          },
          onChange(event: any) {
            changeEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onClick();
      await simulate.sleep(10);

      expect(inputEvent).toBeNull();
      expect(changeEvent).toBeNull();
      expect(comp.data.checked).toBe(false);
    }
  });

  test('should not emit events when loading', async () => {
    let inputEvent: any = null;
    let changeEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-switch': SmartSwitch,
        },
        template: `
          <smart-switch
            id="wrapper"
            checked="{{ checked }}"
            loading
            bind:input="onInput"
            bind:change="onChange"
          />
        `,
        data: {
          checked: false,
        },
        methods: {
          onInput(event: any) {
            inputEvent = event.detail;
          },
          onChange(event: any) {
            changeEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onClick();
      await simulate.sleep(10);

      expect(inputEvent).toBeNull();
      expect(changeEvent).toBeNull();
      expect(comp.data.checked).toBe(false);
    }
  });

  test('should not emit events when both disabled and loading', async () => {
    let inputEvent: any = null;
    let changeEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-switch': SmartSwitch,
        },
        template: `
          <smart-switch
            id="wrapper"
            checked="{{ checked }}"
            disabled
            loading
            bind:input="onInput"
            bind:change="onChange"
          />
        `,
        data: {
          checked: false,
        },
        methods: {
          onInput(event: any) {
            inputEvent = event.detail;
          },
          onChange(event: any) {
            changeEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onClick();
      await simulate.sleep(10);

      expect(inputEvent).toBeNull();
      expect(changeEvent).toBeNull();
      expect(comp.data.checked).toBe(false);
    }
  });
});

import path from 'path';
import simulate from 'miniprogram-simulate';

describe('normal-slider', () => {
  const SmartNormalSlider = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-normal-slider',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  test('should handle bindend', async () => {
    let endEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-normal-slider': SmartNormalSlider,
        },
        template: `<smart-normal-slider id="slider" bind:end="onEnd" />`,
        methods: {
          onEnd(event: any) {
            endEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const slider = comp.querySelector('#slider');
    const instance = slider?.instance;
    await simulate.sleep(10);

    if (instance) {
      const mockEvent = {
        detail: { value: 50 },
      };
      instance.bindend(mockEvent);
      await simulate.sleep(10);

      expect(endEvent).toEqual({ value: 50 });
    }
  });

  test('should handle bindend with null event', async () => {
    let endEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-normal-slider': SmartNormalSlider,
        },
        template: `<smart-normal-slider id="slider" bind:end="onEnd" />`,
        methods: {
          onEnd(event: any) {
            endEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const slider = comp.querySelector('#slider');
    const instance = slider?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.bindend(null);
      await simulate.sleep(10);

      expect(endEvent).toBeUndefined();
    }
  });

  test('should handle bindmove', async () => {
    let changeEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-normal-slider': SmartNormalSlider,
        },
        template: `<smart-normal-slider id="slider" bind:change="onChange" />`,
        methods: {
          onChange(event: any) {
            changeEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const slider = comp.querySelector('#slider');
    const instance = slider?.instance;
    await simulate.sleep(10);

    if (instance) {
      const mockEvent = {
        detail: { value: 75 },
      };
      instance.bindmove(mockEvent);
      await simulate.sleep(10);

      expect(changeEvent).toEqual({ value: 75 });
    }
  });

  test('should handle bindmove with null event', async () => {
    let changeEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-normal-slider': SmartNormalSlider,
        },
        template: `<smart-normal-slider id="slider" bind:change="onChange" />`,
        methods: {
          onChange(event: any) {
            changeEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const slider = comp.querySelector('#slider');
    const instance = slider?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.bindmove(null);
      await simulate.sleep(10);

      expect(changeEvent).toBeUndefined();
    }
  });

  test('should handle bindstart', async () => {
    let startEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-normal-slider': SmartNormalSlider,
        },
        template: `<smart-normal-slider id="slider" bind:start="onStart" />`,
        methods: {
          onStart(event: any) {
            startEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const slider = comp.querySelector('#slider');
    const instance = slider?.instance;
    await simulate.sleep(10);

    if (instance) {
      const mockEvent = {
        detail: { value: 25 },
      };
      instance.bindstart(mockEvent);
      await simulate.sleep(10);

      expect(startEvent).toEqual({ value: 25 });
    }
  });

  test('should handle bindstart with null event', async () => {
    let startEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-normal-slider': SmartNormalSlider,
        },
        template: `<smart-normal-slider id="slider" bind:start="onStart" />`,
        methods: {
          onStart(event: any) {
            startEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const slider = comp.querySelector('#slider');
    const instance = slider?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.bindstart(null);
      await simulate.sleep(10);

      expect(startEvent).toBeUndefined();
    }
  });
});


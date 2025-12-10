import path from 'path';
import simulate from 'miniprogram-simulate';

describe('image', () => {
  const SmartImage = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-image',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  test('should handle onLoad event', async () => {
    let loadEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-image': SmartImage,
        },
        template: `<smart-image id="image" bind:load="onLoad" />`,
        methods: {
          onLoad(event: any) {
            loadEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#image');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onLoad({
        detail: { width: 100, height: 200 },
      });
      await simulate.sleep(10);

      expect(wrapper?.data.loading).toBe(false);
      expect(loadEvent).toBeTruthy();
      expect(loadEvent.width).toBe(100);
      expect(loadEvent.height).toBe(200);
    }
  });

  test('should handle onError event', async () => {
    let errorEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-image': SmartImage,
        },
        template: `<smart-image id="image" bind:error="onError" />`,
        methods: {
          onError(event: any) {
            errorEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#image');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onError({
        detail: { errMsg: 'load image error' },
      });
      await simulate.sleep(10);

      expect(wrapper?.data.loading).toBe(false);
      expect(wrapper?.data.error).toBe(true);
      expect(errorEvent).toBeTruthy();
      expect(errorEvent.errMsg).toBe('load image error');
    }
  });

  test('should handle onClick event', async () => {
    let clickEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-image': SmartImage,
        },
        template: `<smart-image id="image" bind:click="onClick" />`,
        methods: {
          onClick(event: any) {
            clickEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#image');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onClick({
        detail: { x: 100, y: 200 },
      });
      await simulate.sleep(10);

      expect(clickEvent).toBeTruthy();
      expect(clickEvent.x).toBe(100);
      expect(clickEvent.y).toBe(200);
    }
  });
});


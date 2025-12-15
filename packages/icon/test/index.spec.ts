import path from 'path';
import simulate from 'miniprogram-simulate';

describe('icon', () => {
  const SmartIcon = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-icon',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  test('should handle onClick event', async () => {
    let clickEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-icon': SmartIcon,
        },
        template: `<smart-icon id="icon" bind:click="onClick" />`,
        methods: {
          onClick(event: any) {
            clickEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#icon');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const mockEvent = {
        detail: { x: 100, y: 200 },
      };
      instance.onClick(mockEvent);
      await simulate.sleep(10);

      expect(clickEvent).toBeTruthy();
      expect(clickEvent.detail.x).toBe(100);
    }
  });
});


import path from 'path';
import simulate from 'miniprogram-simulate';

describe('nav-bar', () => {
  const SmartNavBar = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-nav-bar',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  test('should handle onClickLeft', async () => {
    let clickLeftEvent = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-nav-bar': SmartNavBar,
        },
        template: `<smart-nav-bar id="nav-bar" bind:click-left="onClickLeft" />`,
        methods: {
          onClickLeft() {
            clickLeftEvent = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const navBar = comp.querySelector('#nav-bar');
    const instance = navBar?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onClickLeft();
      await simulate.sleep(10);

      expect(clickLeftEvent).toBe(true);
    }
  });

  test('should handle onClickRight', async () => {
    let clickRightEvent = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-nav-bar': SmartNavBar,
        },
        template: `<smart-nav-bar id="nav-bar" bind:click-right="onClickRight" />`,
        methods: {
          onClickRight() {
            clickRightEvent = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const navBar = comp.querySelector('#nav-bar');
    const instance = navBar?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onClickRight();
      await simulate.sleep(10);

      expect(clickRightEvent).toBe(true);
    }
  });

  test('should handle onClickTitle', async () => {
    let clickTitleEvent = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-nav-bar': SmartNavBar,
        },
        template: `<smart-nav-bar id="nav-bar" bind:click-title="onClickTitle" />`,
        methods: {
          onClickTitle() {
            clickTitleEvent = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const navBar = comp.querySelector('#nav-bar');
    const instance = navBar?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onClickTitle();
      await simulate.sleep(10);

      expect(clickTitleEvent).toBe(true);
    }
  });

  test('should handle onClickRightIcon', async () => {
    let clickRightIconEvent = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-nav-bar': SmartNavBar,
        },
        template: `<smart-nav-bar id="nav-bar" bind:click-right-icon="onClickRightIcon" />`,
        methods: {
          onClickRightIcon() {
            clickRightIconEvent = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const navBar = comp.querySelector('#nav-bar');
    const instance = navBar?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onClickRightIcon();
      await simulate.sleep(10);

      expect(clickRightIconEvent).toBe(true);
    }
  });

  test('should handle onClickLeftIcon', async () => {
    let clickLeftIconEvent = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-nav-bar': SmartNavBar,
        },
        template: `<smart-nav-bar id="nav-bar" bind:click-left-icon="onClickLeftIcon" />`,
        methods: {
          onClickLeftIcon() {
            clickLeftIconEvent = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const navBar = comp.querySelector('#nav-bar');
    const instance = navBar?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onClickLeftIcon();
      await simulate.sleep(10);

      expect(clickLeftIconEvent).toBe(true);
    }
  });

  test('should handle onClickLeftText', async () => {
    let clickLeftTextEvent = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-nav-bar': SmartNavBar,
        },
        template: `<smart-nav-bar id="nav-bar" bind:click-left-text="onClickLeftText" />`,
        methods: {
          onClickLeftText() {
            clickLeftTextEvent = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const navBar = comp.querySelector('#nav-bar');
    const instance = navBar?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onClickLeftText();
      await simulate.sleep(10);

      expect(clickLeftTextEvent).toBe(true);
    }
  });

  test('should handle onClickRightText', async () => {
    let clickRightTextEvent = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-nav-bar': SmartNavBar,
        },
        template: `<smart-nav-bar id="nav-bar" bind:click-right-text="onClickRightText" />`,
        methods: {
          onClickRightText() {
            clickRightTextEvent = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const navBar = comp.querySelector('#nav-bar');
    const instance = navBar?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onClickRightText();
      await simulate.sleep(10);

      expect(clickRightTextEvent).toBe(true);
    }
  });
});


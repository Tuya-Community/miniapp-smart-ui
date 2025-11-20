import path from 'path';
import simulate from 'miniprogram-simulate';

describe('cell', () => {
  const SmartCell = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-cell',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  beforeEach(() => {
    // Mock wx navigation methods
    const originalNavigateTo = wx.navigateTo;
    const originalRedirectTo = wx.redirectTo;
    const originalSwitchTab = wx.switchTab;
    const originalReLaunch = wx.reLaunch;
    const originalNavigateBack = wx.navigateBack;

    wx.navigateTo = jest.fn() as any;
    wx.redirectTo = jest.fn() as any;
    wx.switchTab = jest.fn() as any;
    wx.reLaunch = jest.fn() as any;
    wx.navigateBack = jest.fn() as any;

    return () => {
      wx.navigateTo = originalNavigateTo;
      wx.redirectTo = originalRedirectTo;
      wx.switchTab = originalSwitchTab;
      wx.reLaunch = originalReLaunch;
      wx.navigateBack = originalNavigateBack;
    };
  });

  test('should emit click event', async () => {
    let clickEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cell': SmartCell,
        },
        template: `<smart-cell id="wrapper" bind:click="onClick" />`,
        methods: {
          onClick(event: any) {
            clickEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const cell = wrapper?.querySelector('.smart-cell');
    cell?.dispatchEvent('tap', { detail: { test: 'data' } });
    await simulate.sleep(10);
    expect(clickEvent).toEqual({ test: 'data' });
  });

  test('should jump to link when url is provided', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cell': SmartCell,
        },
        template: `<smart-cell id="wrapper" url="/pages/test/index" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    const cell = wrapper?.querySelector('.smart-cell');
    
    if (instance && cell) {
      cell.dispatchEvent('tap');
      await simulate.sleep(10);
      expect(wx.navigateTo).toHaveBeenCalledWith({ url: '/pages/test/index' });
    }
  });

  test('should use redirectTo when linkType is redirectTo', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cell': SmartCell,
        },
        template: `<smart-cell id="wrapper" url="/pages/test/index" link-type="redirectTo" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    const cell = wrapper?.querySelector('.smart-cell');
    
    if (instance && cell) {
      cell.dispatchEvent('tap');
      await simulate.sleep(10);
      expect(wx.redirectTo).toHaveBeenCalledWith({ url: '/pages/test/index' });
    }
  });

  test('should use switchTab when linkType is switchTab', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cell': SmartCell,
        },
        template: `<smart-cell id="wrapper" url="/pages/index/index" link-type="switchTab" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    const cell = wrapper?.querySelector('.smart-cell');
    
    if (instance && cell) {
      cell.dispatchEvent('tap');
      await simulate.sleep(10);
      expect(wx.switchTab).toHaveBeenCalledWith({ url: '/pages/index/index' });
    }
  });

  test('should use reLaunch when linkType is reLaunch', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cell': SmartCell,
        },
        template: `<smart-cell id="wrapper" url="/pages/index/index" link-type="reLaunch" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    const cell = wrapper?.querySelector('.smart-cell');
    
    if (instance && cell) {
      cell.dispatchEvent('tap');
      await simulate.sleep(10);
      expect(wx.reLaunch).toHaveBeenCalledWith({ url: '/pages/index/index' });
    }
  });

  test('should render with title', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cell': SmartCell,
        },
        template: `<smart-cell id="wrapper" title="标题" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.title).toBe('标题');
  });

  test('should render with value', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cell': SmartCell,
        },
        template: `<smart-cell id="wrapper" value="内容" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.value).toBe('内容');
  });

  test('should render with label', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cell': SmartCell,
        },
        template: `<smart-cell id="wrapper" label="标签" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.label).toBe('标签');
  });

  test('should render with icon', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cell': SmartCell,
        },
        template: `<smart-cell id="wrapper" icon="star" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.icon).toBe('star');
  });

  test('should render with isLink', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cell': SmartCell,
        },
        template: `<smart-cell id="wrapper" is-link="{{ true }}" />`,
        data: {
          isLink: true,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.isLink).toBe(true);
  });

  test('should render with required', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cell': SmartCell,
        },
        template: `<smart-cell id="wrapper" required="{{ true }}" />`,
        data: {
          required: true,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.required).toBe(true);
  });

  test('should render with clickable', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cell': SmartCell,
        },
        template: `<smart-cell id="wrapper" clickable="{{ true }}" />`,
        data: {
          clickable: true,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.clickable).toBe(true);
  });

  test('should render with border', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cell': SmartCell,
        },
        template: `<smart-cell id="wrapper" border="{{ true }}" />`,
        data: {
          border: true,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.border).toBe(true);
  });

  test('should render without border', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cell': SmartCell,
        },
        template: `<smart-cell id="wrapper" border="{{ false }}" />`,
        data: {
          border: false,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.border).toBe(false);
  });

  test('should render with arrow direction', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cell': SmartCell,
        },
        template: `<smart-cell id="wrapper" arrow-direction="up" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.arrowDirection).toBe('up');
    expect(wrapper?.data.arrowIcon).toBeTruthy();
  });

  test('should render with custom style', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cell': SmartCell,
        },
        template: `<smart-cell id="wrapper" custom-style="color: red;" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.customStyle).toBe('color: red;');
  });

  test('should render with title style', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cell': SmartCell,
        },
        template: `<smart-cell id="wrapper" title-style="font-size: 16px;" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.titleStyle).toBe('font-size: 16px;');
  });

  test('should render with title width', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cell': SmartCell,
        },
        template: `<smart-cell id="wrapper" title-width="100px" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.titleWidth).toBe('100px');
  });

  test('should not jump to link when url is not provided', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cell': SmartCell,
        },
        template: `<smart-cell id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const cell = wrapper?.querySelector('.smart-cell');
    
    if (cell) {
      cell.dispatchEvent('tap');
      await simulate.sleep(10);
      expect(wx.navigateTo).not.toHaveBeenCalled();
      expect(wx.redirectTo).not.toHaveBeenCalled();
      expect(wx.switchTab).not.toHaveBeenCalled();
      expect(wx.reLaunch).not.toHaveBeenCalled();
    }
  });

  test('should render with useLabelSlot', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cell': SmartCell,
        },
        template: `<smart-cell id="wrapper" use-label-slot="{{ true }}" />`,
        data: {
          useLabelSlot: true,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.useLabelSlot).toBe(true);
  });
});


import path from 'path';
import simulate from 'miniprogram-simulate';

describe('sidebar-item', () => {
  const SmartSidebarItem = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-sidebar-item',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  // Helper to mock getRelationNodes after component is created
  const mockGetRelationNodes = (instance: any, parent: any) => {
    instance.getRelationNodes = jest.fn(() => parent ? [parent] : []);
  };

  test('should render with default props', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-sidebar-item': SmartSidebarItem,
        },
        template: `<smart-sidebar-item id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.dot).toBe(false);
    expect(wrapper?.data.badge).toBe(null);
    expect(wrapper?.data.info).toBe(null);
    expect(wrapper?.data.title).toBe('');
    expect(wrapper?.data.disabled).toBe(false);
  });

  test('should render with custom props', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-sidebar-item': SmartSidebarItem,
        },
        template: `<smart-sidebar-item id="wrapper" dot="{{ true }}" badge="99" title="Test Title" disabled="{{ true }}" />`,
        data: {
          dot: true,
          badge: '99',
          title: 'Test Title',
          disabled: true,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.dot).toBe(true);
    expect(wrapper?.data.badge).toBe('99');
    expect(wrapper?.data.title).toBe('Test Title');
    expect(wrapper?.data.disabled).toBe(true);
  });

  test('should not handle onClick when parent does not exist', async () => {
    let clickEmitted = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-sidebar-item': SmartSidebarItem,
        },
        template: `<smart-sidebar-item id="wrapper" bind:click="onClick" />`,
        methods: {
          onClick() {
            clickEmitted = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Mock getRelationNodes to return empty array (no parent)
      mockGetRelationNodes(instance, null);
      
      instance.onClick();
      await simulate.sleep(10);
      
      // Should not emit click event when parent is null
      expect(clickEmitted).toBe(false);
    }
  });

  test('should not handle onClick when disabled', async () => {
    let clickEmitted = false;
    let changeEmitted = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-sidebar-item': SmartSidebarItem,
        },
        template: `<smart-sidebar-item id="wrapper" disabled="{{ true }}" bind:click="onClick" />`,
        data: {
          disabled: true,
        },
        methods: {
          onClick() {
            clickEmitted = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Mock parent
      const mockParent = {
        children: [instance],
        setActive: jest.fn(() => Promise.resolve()),
        $emit: jest.fn((event: string) => {
          if (event === 'change') {
            changeEmitted = true;
          }
        }),
      };
      mockGetRelationNodes(instance, mockParent);
      
      instance.onClick();
      await simulate.sleep(10);
      
      // Should not emit events when disabled
      expect(clickEmitted).toBe(false);
      expect(changeEmitted).toBe(false);
      expect(mockParent.setActive).not.toHaveBeenCalled();
    }
  });

  test('should handle onClick and emit click and change events', async () => {
    let clickEvent: any = null;
    let changeEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-sidebar-item': SmartSidebarItem,
        },
        template: `<smart-sidebar-item id="wrapper" bind:click="onClick" />`,
        methods: {
          onClick(event: any) {
            clickEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Mock parent
      const mockParent = {
        children: [instance, { index: 1 }],
        setActive: jest.fn(() => Promise.resolve()),
        $emit: jest.fn((event: string, detail: any) => {
          if (event === 'change') {
            changeEvent = detail;
          }
        }),
      };
      mockGetRelationNodes(instance, mockParent);
      
      // Spy on $emit to verify it's called
      const emitSpy = jest.spyOn(instance, '$emit');
      
      instance.onClick();
      await simulate.sleep(10);
      
      expect(mockParent.setActive).toHaveBeenCalledWith(0);
      expect(clickEvent).toBe(0);
      expect(changeEvent).toBe(0);
      expect(emitSpy).toHaveBeenCalledWith('click', 0);
      expect(mockParent.$emit).toHaveBeenCalledWith('change', 0);
      
      emitSpy.mockRestore();
    }
  });

  test('should handle onClick when item is at different index', async () => {
    let clickEvent: any = null;
    let changeEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-sidebar-item': SmartSidebarItem,
        },
        template: `<smart-sidebar-item id="wrapper" bind:click="onClick" />`,
        methods: {
          onClick(event: any) {
            clickEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Mock parent - item is at index 2
      const mockParent = {
        children: [{ index: 0 }, { index: 1 }, instance],
        setActive: jest.fn(() => Promise.resolve()),
        $emit: jest.fn((event: string, detail: any) => {
          if (event === 'change') {
            changeEvent = detail;
          }
        }),
      };
      mockGetRelationNodes(instance, mockParent);
      
      instance.onClick();
      await simulate.sleep(10);
      
      expect(mockParent.setActive).toHaveBeenCalledWith(2);
      expect(clickEvent).toBe(2);
      expect(changeEvent).toBe(2);
    }
  });

  test('should handle setActive method', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-sidebar-item': SmartSidebarItem,
        },
        template: `<smart-sidebar-item id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Spy on setData to verify it's called
      const setDataSpy = jest.spyOn(instance, 'setData');
      
      await instance.setActive(true);
      
      expect(setDataSpy).toHaveBeenCalledWith({ selected: true });
      expect(instance.data.selected).toBe(true);
      
      setDataSpy.mockRestore();
    }
  });

  test('should handle setActive with false', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-sidebar-item': SmartSidebarItem,
        },
        template: `<smart-sidebar-item id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      await instance.setActive(false);
      
      expect(instance.data.selected).toBe(false);
    }
  });

  test('should handle onClick when parent.setActive returns promise', async () => {
    let clickEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-sidebar-item': SmartSidebarItem,
        },
        template: `<smart-sidebar-item id="wrapper" bind:click="onClick" />`,
        methods: {
          onClick(event: any) {
            clickEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Mock parent with async setActive
      let resolvePromise: any;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      
      const mockParent = {
        children: [instance],
        setActive: jest.fn(() => promise),
        $emit: jest.fn(),
      };
      mockGetRelationNodes(instance, mockParent);
      
      const onClickPromise = instance.onClick();
      
      // Verify setActive was called
      expect(mockParent.setActive).toHaveBeenCalledWith(0);
      
      // Resolve the promise
      resolvePromise();
      await onClickPromise;
      await simulate.sleep(10);
      
      // Verify events were emitted after promise resolved
      expect(clickEvent).toBe(0);
      expect(mockParent.$emit).toHaveBeenCalledWith('change', 0);
    }
  });
});


import path from 'path';
import simulate from 'miniprogram-simulate';

describe('tree-select', () => {
  const SmartTreeSelect = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-tree-select',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  test('should emit click-item event when item is selected', async () => {
    let clickItemEvent: any = null;
    const items = [
      {
        text: '浙江',
        options: [
          { text: '杭州', id: 1 },
          { text: '温州', id: 2 },
        ],
      },
    ];

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-tree-select': SmartTreeSelect,
        },
        template: `<smart-tree-select id="wrapper" items="{{ items }}" bind:click-item="onClickItem" />`,
        data: {
          items,
        },
        methods: {
          onClickItem(event: any) {
            clickItemEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onSelectItem({
        currentTarget: {
          dataset: {
            item: { text: '杭州', id: 1 },
          },
        },
      });
      await simulate.sleep(10);
      expect(clickItemEvent).toEqual({ text: '杭州', id: 1 });
    }
  });

  test('should not emit click-item event when item is disabled', async () => {
    let clickItemEvent: any = null;
    const items = [
      {
        text: '浙江',
        options: [
          { text: '杭州', id: 1, disabled: true },
        ],
      },
    ];

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-tree-select': SmartTreeSelect,
        },
        template: `<smart-tree-select id="wrapper" items="{{ items }}" bind:click-item="onClickItem" />`,
        data: {
          items,
        },
        methods: {
          onClickItem(event: any) {
            clickItemEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onSelectItem({
        currentTarget: {
          dataset: {
            item: { text: '杭州', id: 1, disabled: true },
          },
        },
      });
      await simulate.sleep(10);
      expect(clickItemEvent).toBeNull();
    }
  });

  test('should not emit click-item event when max is reached and item is not selected', async () => {
    let clickItemEvent: any = null;
    const items = [
      {
        text: '浙江',
        options: [
          { text: '杭州', id: 1 },
          { text: '温州', id: 2 },
        ],
      },
    ];

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-tree-select': SmartTreeSelect,
        },
        template: `<smart-tree-select id="wrapper" items="{{ items }}" active-id="{{ activeId }}" max="{{ 1 }}" bind:click-item="onClickItem" />`,
        data: {
          items,
          activeId: [1], // Already selected one item
        },
        methods: {
          onClickItem(event: any) {
            clickItemEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Try to select second item when max is 1
      instance.onSelectItem({
        currentTarget: {
          dataset: {
            item: { text: '温州', id: 2 },
          },
        },
      });
      await simulate.sleep(10);
      // Should not emit because max is reached
      expect(clickItemEvent).toBeNull();
    }
  });

  test('should emit click-item event when max is reached but item is already selected', async () => {
    let clickItemEvent: any = null;
    const items = [
      {
        text: '浙江',
        options: [
          { text: '杭州', id: 1 },
        ],
      },
    ];

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-tree-select': SmartTreeSelect,
        },
        template: `<smart-tree-select id="wrapper" items="{{ items }}" active-id="{{ activeId }}" max="{{ 1 }}" bind:click-item="onClickItem" />`,
        data: {
          items,
          activeId: [1], // Item is already selected
        },
        methods: {
          onClickItem(event: any) {
            clickItemEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onSelectItem({
        currentTarget: {
          dataset: {
            item: { text: '杭州', id: 1 },
          },
        },
      });
      await simulate.sleep(10);
      // Should emit because item is already selected
      expect(clickItemEvent).toEqual({ text: '杭州', id: 1 });
    }
  });

  test('should emit click-nav event when nav is clicked', async () => {
    let clickNavEvent: any = null;
    const items = [
      {
        text: '浙江',
        options: [
          { text: '杭州', id: 1 },
        ],
      },
      {
        text: '江苏',
        options: [
          { text: '南京', id: 2 },
        ],
      },
    ];

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-tree-select': SmartTreeSelect,
        },
        template: `<smart-tree-select id="wrapper" items="{{ items }}" bind:click-nav="onClickNav" />`,
        data: {
          items,
        },
        methods: {
          onClickNav(event: any) {
            clickNavEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onClickNav({
        detail: 1,
      });
      await simulate.sleep(10);
      expect(clickNavEvent).toEqual({ index: 1 });
    }
  });

  test('should not emit click-nav event when nav is disabled', async () => {
    let clickNavEvent: any = null;
    const items = [
      {
        text: '浙江',
        disabled: true,
        options: [
          { text: '杭州', id: 1 },
        ],
      },
    ];

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-tree-select': SmartTreeSelect,
        },
        template: `<smart-tree-select id="wrapper" items="{{ items }}" bind:click-nav="onClickNav" />`,
        data: {
          items,
        },
        methods: {
          onClickNav(event: any) {
            clickNavEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Try to trigger click-nav, but nav is disabled
      instance.onClickNav({
        detail: 0,
      });
      await simulate.sleep(10);
      // Should not emit because nav is disabled
      expect(clickNavEvent).toBeNull();
    }
  });

  test('should update subItems when items change', async () => {
    const items = [
      {
        text: '浙江',
        options: [
          { text: '杭州', id: 1 },
        ],
      },
    ];

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-tree-select': SmartTreeSelect,
        },
        template: `<smart-tree-select id="wrapper" items="{{ items }}" main-active-index="{{ mainActiveIndex }}" />`,
        data: {
          items,
          mainActiveIndex: 0,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.subItems).toEqual([{ text: '杭州', id: 1 }]);
  });

  test('should update subItems when mainActiveIndex changes', async () => {
    const items = [
      {
        text: '浙江',
        options: [
          { text: '杭州', id: 1 },
        ],
      },
      {
        text: '江苏',
        options: [
          { text: '南京', id: 2 },
        ],
      },
    ];

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-tree-select': SmartTreeSelect,
        },
        template: `<smart-tree-select id="wrapper" items="{{ items }}" main-active-index="{{ mainActiveIndex }}" />`,
        data: {
          items,
          mainActiveIndex: 0,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.subItems).toEqual([{ text: '杭州', id: 1 }]);

    // Change mainActiveIndex
    comp.setData({ mainActiveIndex: 1 });
    await simulate.sleep(10);

    expect(wrapper?.data.subItems).toEqual([{ text: '南京', id: 2 }]);
  });
});


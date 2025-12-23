import path from 'path';
import simulate from 'miniprogram-simulate';

describe('cascader', () => {
  const SmartCascader = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-cascader',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  beforeEach(() => {
    // Mock wx.nextTick
    const originalNextTick = wx.nextTick;
    wx.nextTick = jest.fn((callback: any) => {
      if (callback) {
        callback();
      }
    }) as any;

    return () => {
      wx.nextTick = originalNextTick;
    };
  });

  const mockOptions = [
    {
      text: '浙江',
      value: '330000',
      options: [
        {
          text: '杭州',
          value: '330100',
          options: [
            { text: '西湖区', value: '330106' },
            { text: '余杭区', value: '330110' },
          ],
        },
        {
          text: '温州',
          value: '330300',
          options: [
            { text: '鹿城区', value: '330302' },
            { text: '龙湾区', value: '330303' },
          ],
        },
      ],
    },
    {
      text: '福建',
      value: '350000',
      options: [
        {
          text: '福州',
          value: '350100',
          options: [
            { text: '鼓楼区', value: '350102' },
            { text: '台江区', value: '350103' },
          ],
        },
      ],
    },
  ];

  test('should render with default props', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cascader': SmartCascader,
        },
        template: `<smart-cascader id="wrapper" options="{{ options }}" />`,
        data: {
          options: mockOptions,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.options).toEqual(mockOptions);
    expect(wrapper?.data.activeTab).toBe(0);
    expect(wrapper?.data.closeable).toBe(true);
    expect(wrapper?.data.ellipsis).toBe(true);
    expect(wrapper?.data.showHeader).toBe(true);
    expect(wrapper?.data.swipeable).toBe(false);
  });

  test('should render with title', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cascader': SmartCascader,
        },
        template: `<smart-cascader id="wrapper" title="选择地区" options="{{ options }}" />`,
        data: {
          options: mockOptions,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.title).toBe('选择地区');
  });

  test('should render with placeholder', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cascader': SmartCascader,
        },
        template: `<smart-cascader id="wrapper" placeholder="请选择" options="{{ options }}" />`,
        data: {
          options: mockOptions,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.placeholder).toBe('请选择');
  });

  test('should initialize tabs from options', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cascader': SmartCascader,
        },
        template: `<smart-cascader id="wrapper" options="{{ options }}" />`,
        data: {
          options: mockOptions,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.tabs).toBeDefined();
    expect(wrapper?.data.tabs.length).toBeGreaterThan(0);
    expect(wrapper?.data.tabs[0].options).toEqual(mockOptions);
  });

  test('should update tabs when value is provided', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cascader': SmartCascader,
        },
        template: `<smart-cascader id="wrapper" value="{{ value }}" options="{{ options }}" />`,
        data: {
          value: '330106',
          options: mockOptions,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.tabs).toBeDefined();
    // Should have tabs for each level of the selected value
    expect(wrapper?.data.tabs.length).toBeGreaterThan(1);
  });

  test('should emit close event when close button is clicked', async () => {
    let closeEmitted = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cascader': SmartCascader,
        },
        template: `<smart-cascader id="wrapper" options="{{ options }}" bind:close="onClose" />`,
        data: {
          options: mockOptions,
        },
        methods: {
          onClose() {
            closeEmitted = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      instance.onClose();
      await simulate.sleep(10);
      
      expect(closeEmitted).toBe(true);
    }
  });

  test('should emit change event when option is selected', async () => {
    let changeEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cascader': SmartCascader,
        },
        template: `<smart-cascader id="wrapper" options="{{ options }}" bind:change="onChange" />`,
        data: {
          options: mockOptions,
        },
        methods: {
          onChange(event: any) {
            changeEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      const option = mockOptions[0];
      instance.onSelect({
        currentTarget: {
          dataset: {
            option,
            tabIndex: 0,
          },
        },
      });
      await simulate.sleep(10);
      
      expect(changeEvent).toBeTruthy();
      expect(changeEvent.value).toBe(option.value);
      expect(changeEvent.tabIndex).toBe(0);
    }
  });

  test('should emit finish event when final option is selected', async () => {
    let finishEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cascader': SmartCascader,
        },
        template: `<smart-cascader id="wrapper" options="{{ options }}" bind:finish="onFinish" />`,
        data: {
          options: mockOptions,
        },
        methods: {
          onFinish(event: any) {
            finishEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      // Select a final option (one without nested options)
      const finalOption = mockOptions[0].options![0].options![0];
      instance.setData({
        tabs: [
          { options: mockOptions, selected: mockOptions[0] },
          { options: mockOptions[0].options!, selected: mockOptions[0].options![0] },
          { options: mockOptions[0].options![0].options!, selected: null },
        ],
      });
      
      instance.onSelect({
        currentTarget: {
          dataset: {
            option: finalOption,
            tabIndex: 2,
          },
        },
      });
      await simulate.sleep(10);
      
      expect(finishEvent).toBeTruthy();
      expect(finishEvent.value).toBe(finalOption.value);
    }
  });

  test('should not emit change event when option is disabled', async () => {
    let changeEmitted = false;

    const disabledOptions = [
      {
        text: '浙江',
        value: '330000',
        disabled: true,
        options: [
          { text: '杭州', value: '330100' },
        ],
      },
    ];

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cascader': SmartCascader,
        },
        template: `<smart-cascader id="wrapper" options="{{ options }}" bind:change="onChange" />`,
        data: {
          options: disabledOptions,
        },
        methods: {
          onChange() {
            changeEmitted = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      instance.onSelect({
        currentTarget: {
          dataset: {
            option: disabledOptions[0],
            tabIndex: 0,
          },
        },
      });
      await simulate.sleep(10);
      
      expect(changeEmitted).toBe(false);
    }
  });

  test('should handle click-tab event', async () => {
    let tabClickEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cascader': SmartCascader,
        },
        template: `<smart-cascader id="wrapper" options="{{ options }}" bind:click-tab="onClickTab" />`,
        data: {
          options: mockOptions,
        },
        methods: {
          onClickTab(event: any) {
            tabClickEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      instance.onClickTab({
        detail: {
          index: 1,
          title: '杭州',
        },
      });
      await simulate.sleep(10);
      
      expect(tabClickEvent).toBeTruthy();
      expect(tabClickEvent.tabIndex).toBe(1);
      expect(tabClickEvent.title).toBe('杭州');
      expect(wrapper?.data.activeTab).toBe(1);
    }
  });

  test('should update tabs when options change', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cascader': SmartCascader,
        },
        template: `<smart-cascader id="wrapper" options="{{ options }}" />`,
        data: {
          options: mockOptions,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    const newOptions = [
      {
        text: '北京',
        value: '110000',
        options: [
          { text: '东城区', value: '110101', options: [] },
        ],
      },
    ];
    
    comp.setData({ options: newOptions });
    await simulate.sleep(10);
    
    expect(wrapper?.data.tabs[0].options).toEqual(newOptions);
  });

  test('should update value when value prop changes', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cascader': SmartCascader,
        },
        template: `<smart-cascader id="wrapper" value="{{ value }}" options="{{ options }}" />`,
        data: {
          value: '',
          options: mockOptions,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    comp.setData({ value: '330106' });
    await simulate.sleep(10);
    
    expect(wrapper?.data.tabs.length).toBeGreaterThan(1);
  });

  test('should render with custom active color', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cascader': SmartCascader,
        },
        template: `<smart-cascader id="wrapper" active-color="#ff0000" options="{{ options }}" />`,
        data: {
          options: mockOptions,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.activeColor).toBe('#ff0000');
  });

  test('should render with swipeable enabled', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cascader': SmartCascader,
        },
        template: `<smart-cascader id="wrapper" swipeable="{{ true }}" options="{{ options }}" />`,
        data: {
          options: mockOptions,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.swipeable).toBe(true);
  });

  test('should render without close button when closeable is false', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cascader': SmartCascader,
        },
        template: `<smart-cascader id="wrapper" closeable="{{ false }}" options="{{ options }}" />`,
        data: {
          options: mockOptions,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.closeable).toBe(false);
  });

  test('should render without header when showHeader is false', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cascader': SmartCascader,
        },
        template: `<smart-cascader id="wrapper" show-header="{{ false }}" options="{{ options }}" />`,
        data: {
          options: mockOptions,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.showHeader).toBe(false);
  });

  test('should handle empty options', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cascader': SmartCascader,
        },
        template: `<smart-cascader id="wrapper" options="{{ options }}" />`,
        data: {
          options: [],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    // Should not crash with empty options
    expect(wrapper?.data.options).toEqual([]);
  });

  test('should return early in updateValue when value already exists in tabs (line 84)', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cascader': SmartCascader,
        },
        template: `<smart-cascader id="wrapper" value="{{ value }}" options="{{ options }}" />`,
        data: {
          value: '330106',
          options: mockOptions,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);
    
    // Set up tabs with selected values
    if (instance) {
      instance.setData({
        tabs: [
          { options: mockOptions, selected: mockOptions[0] },
          { options: mockOptions[0].options!, selected: mockOptions[0].options![0] },
          { options: mockOptions[0].options![0].options!, selected: mockOptions[0].options![0].options![0] },
        ],
      });
      await simulate.sleep(10);
      
      // Try to update value to an existing value - should return early (line 84)
      const tabsBefore = wrapper?.data.tabs;
      instance.updateValue('330106');
      await simulate.sleep(10);
      
      // Tabs should remain unchanged
      expect(wrapper?.data.tabs).toEqual(tabsBefore);
    }
  });

  test('should add next tab when optionsCursor exists after selectedOptions (line 137)', async () => {
    // Create options where the selected value is not a leaf node (has children)
    const optionsWithNonLeafValue = [
      {
        text: '浙江',
        value: '330000',
        options: [
          {
            text: '杭州',
            value: '330100',
            options: [
              { text: '西湖区', value: '330106' },
              { text: '余杭区', value: '330110' },
            ],
          },
        ],
      },
    ];

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cascader': SmartCascader,
        },
        template: `<smart-cascader id="wrapper" value="{{ value }}" options="{{ options }}" />`,
        data: {
          value: '330100', // Select 杭州, which has options (not a leaf node)
          options: optionsWithNonLeafValue,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    // When value is set to a non-leaf node, updateTabs should add a tab with the remaining options (line 137)
    // The selectedOptions will be [浙江, 杭州], and optionsCursor will be 杭州的options, so a new tab should be added
    expect(wrapper?.data.tabs).toBeDefined();
    const tabs = wrapper?.data.tabs;
    
    // Should have tabs for the selected path plus a next tab with remaining options
    expect(tabs.length).toBeGreaterThan(2); // [浙江(selected), 杭州(selected), 杭州的options(not selected)]
    
    // The last tab should have options but no selected value
    if (tabs && tabs.length > 2) {
      expect(tabs[tabs.length - 1].selected).toBeNull();
      expect(tabs[tabs.length - 1].options).toBeDefined();
    }
  });

  test('should slice tabs when selecting option with existing next tabs (line 190)', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cascader': SmartCascader,
        },
        template: `<smart-cascader id="wrapper" options="{{ options }}" />`,
        data: {
          options: mockOptions,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);
    
    if (instance) {
      // Set up tabs with multiple levels already selected
      instance.setData({
        tabs: [
          { options: mockOptions, selected: mockOptions[0] },
          { options: mockOptions[0].options!, selected: mockOptions[0].options![0] },
          { options: mockOptions[0].options![0].options!, selected: mockOptions[0].options![0].options![0] },
        ],
        activeTab: 2,
      });
      await simulate.sleep(10);
      
      // Select an option at tabIndex 0, which should slice tabs to remove later tabs (line 190)
      instance.onSelect({
        currentTarget: {
          dataset: {
            option: mockOptions[1], // Select a different first-level option
            tabIndex: 0,
          },
        },
      });
      await simulate.sleep(10);
      
      // Tabs should be sliced to only include up to tabIndex + 1
      expect(wrapper?.data.tabs.length).toBeLessThanOrEqual(2);
    }
  });

  test('should update existing next tab instead of pushing when tabs[tabIndex + 1] exists (line 200)', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-cascader': SmartCascader,
        },
        template: `<smart-cascader id="wrapper" options="{{ options }}" />`,
        data: {
          options: mockOptions,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);
    
    if (instance) {
      // Manually set up tabs with multiple levels to ensure tabs[tabIndex + 1] exists
      // This simulates the scenario where we have: [浙江(selected), 浙江的options(selected), 杭州的options(not selected)]
      instance.setData({
        tabs: [
          { options: mockOptions, selected: mockOptions[0] },
          { options: mockOptions[0].options!, selected: mockOptions[0].options![0] },
          { options: mockOptions[0].options![0].options!, selected: null }, // This tab already exists
        ],
        activeTab: 1,
      });
      await simulate.sleep(10);
      
      const tabsLengthBefore = wrapper?.data.tabs.length;
      
      // Now select a different option at tabIndex 1 that has options
      // Since tabs[tabIndex + 1] (tabs[2]) already exists, it should update it (line 200) instead of pushing
      const newOption = {
        text: '温州',
        value: '330300',
        options: [
          { text: '鹿城区', value: '330302' },
          { text: '龙湾区', value: '330303' },
        ],
      };
      
      instance.onSelect({
        currentTarget: {
          dataset: {
            option: newOption, // Select 温州 which has options
            tabIndex: 1,
          },
        },
      });
      await simulate.sleep(10);
      
      // Should update existing tab[2], not add new one (line 200)
      expect(wrapper?.data.tabs.length).toBe(tabsLengthBefore);
      expect(wrapper?.data.tabs[2].options).toEqual(newOption.options);
    }
  });
});


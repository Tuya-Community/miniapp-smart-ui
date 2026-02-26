import path from 'path';
import simulate from 'miniprogram-simulate';

// Mock version module - must mock version first
jest.mock('../../common/version', () => {
  const actual = jest.requireActual('../../common/version');
  return {
    ...actual,
    canIUseModel: jest.fn(() => false),
    getSystemInfoSync: jest.fn(() => ({
      SDKVersion: '2.8.0',
    })),
  };
});

import { canIUseModel } from '../../common/version';

describe('rate', () => {
  const SmartRate = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-rate',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  beforeEach(() => {
    // Reset mock to return false by default
    (canIUseModel as jest.Mock).mockReturnValue(false);

    // Mock wx.createSelectorQuery
    const originalCreateSelectorQuery = wx.createSelectorQuery;
    wx.createSelectorQuery = jest.fn(() => {
      const query: any = {
        in: jest.fn(() => {
          return query;
        }),
        selectAll: jest.fn((selector: string) => {
          query.selector = selector;
          return query;
        }),
        boundingClientRect: jest.fn(() => {
          return query;
        }),
        exec: jest.fn((callback: any) => {
          // Mock rect data
          const mockRects = [
            { dataset: { score: 0 }, left: 0, right: 20 },
            { dataset: { score: 1 }, left: 20, right: 40 },
            { dataset: { score: 2 }, left: 40, right: 60 },
            { dataset: { score: 3 }, left: 60, right: 80 },
            { dataset: { score: 4 }, left: 80, right: 100 },
          ];
          callback([mockRects]);
        }),
      };
      return query;
    }) as any;

    // Mock wx.nextTick
    const originalNextTick = wx.nextTick;
    wx.nextTick = jest.fn((callback: () => void) => {
      if (callback) {
        callback();
      }
    }) as any;

    return () => {
      wx.createSelectorQuery = originalCreateSelectorQuery;
      wx.nextTick = originalNextTick;
    };
  });

  test('should emit input and change events when item is selected', async () => {
    let inputEvent: any = null;
    let changeEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-rate': SmartRate,
        },
        template: `<smart-rate id="wrapper" bind:input="onInput" bind:change="onChange" />`,
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
      instance.onSelect({
        currentTarget: {
          dataset: {
            score: 2,
          },
        },
      });
      await simulate.sleep(10);

      expect(wrapper?.data.innerValue).toBe(3);
      expect(inputEvent).toBe(3);
      expect(changeEvent).toBe(3);
    }
  });

  test('should not emit events when disabled', async () => {
    let inputEvent: any = null;
    let changeEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-rate': SmartRate,
        },
        template: `<smart-rate id="wrapper" disabled bind:input="onInput" bind:change="onChange" />`,
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
      instance.onSelect({
        currentTarget: {
          dataset: {
            score: 2,
          },
        },
      });
      await simulate.sleep(10);

      expect(inputEvent).toBeNull();
      expect(changeEvent).toBeNull();
    }
  });

  test('should not emit events when readonly', async () => {
    let inputEvent: any = null;
    let changeEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-rate': SmartRate,
        },
        template: `<smart-rate id="wrapper" readonly bind:input="onInput" bind:change="onChange" />`,
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
      instance.onSelect({
        currentTarget: {
          dataset: {
            score: 2,
          },
        },
      });
      await simulate.sleep(10);

      expect(inputEvent).toBeNull();
      expect(changeEvent).toBeNull();
    }
  });

  test('should handle touch move when touchable', async () => {
    let inputEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-rate': SmartRate,
        },
        template: `<smart-rate id="wrapper" bind:input="onInput" />`,
        methods: {
          onInput(event: any) {
            inputEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onTouchMove({
        touches: [
          {
            clientX: 50, // Between 40 and 60, should select score 2
          },
        ],
      });
      await simulate.sleep(50); // Wait for getAllRect promise

      // Should have selected score 2 (which becomes value 3)
      expect(inputEvent).toBe(3);
    }
  });

  test('should not handle touch move when not touchable', async () => {
    let inputEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-rate': SmartRate,
        },
        template: `<smart-rate id="wrapper" touchable="{{ false }}" bind:input="onInput" />`,
        data: {
          touchable: false,
        },
        methods: {
          onInput(event: any) {
            inputEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onTouchMove({
        touches: [
          {
            clientX: 50,
          },
        ],
      });
      await simulate.sleep(50);

      // Should not have emitted event
      expect(inputEvent).toBeNull();
    }
  });

  test('should update innerValue when value prop changes', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-rate': SmartRate,
        },
        template: `<smart-rate id="wrapper" value="{{ value }}" />`,
        data: {
          value: 0,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.innerValue).toBe(0);

    comp.setData({ value: 3 });
    await simulate.sleep(10);

    expect(wrapper?.data.innerValue).toBe(3);
  });

  test('should update innerCountArray when count prop changes', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-rate': SmartRate,
        },
        template: `<smart-rate id="wrapper" count="{{ count }}" />`,
        data: {
          count: 5,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.innerCountArray.length).toBe(5);

    comp.setData({ count: 10 });
    await simulate.sleep(10);

    expect(wrapper?.data.innerCountArray.length).toBe(10);
  });

  test('should set value when canIUseModel returns true', async () => {
    // Mock canIUseModel to return true
    (canIUseModel as jest.Mock).mockReturnValueOnce(true);

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-rate': SmartRate,
        },
        template: `<smart-rate id="wrapper" value="{{ value }}" />`,
        data: {
          value: 0,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.onSelect({
        currentTarget: {
          dataset: {
            score: 2,
          },
        },
      });
      await simulate.sleep(10);

      // When canIUseModel returns true, value should be set
      expect(wrapper?.data.value).toBe(3);
      expect(wrapper?.data.innerValue).toBe(3);
    }
  });
});


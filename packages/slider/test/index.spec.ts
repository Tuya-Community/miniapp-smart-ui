import path from 'path';
import simulate from 'miniprogram-simulate';

// Mock dependencies - must mock version first since utils depends on it
jest.mock('../../common/version', () => {
  const actual = jest.requireActual('../../common/version');
  return {
    ...actual,
    canIUseModel: jest.fn(() => true),
    getSystemInfoSync: jest.fn(() => ({
      platform: 'devtools',
      environment: 'miniprogram',
      SDKVersion: '2.10.0',
    })),
  };
});

jest.mock('../../common/utils', () => {
  const actual = jest.requireActual('../../common/utils');
  return {
    ...actual,
    getRect: jest.fn(),
    nextTick: jest.fn((callback: () => void) => {
      if (callback) {
        callback();
      }
    }),
  };
});

import { getRect } from '../../common/utils';
import { canIUseModel } from '../../common/version';

describe('slider', () => {
  const SmartSlider = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-slider',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock getRect to return a promise with rect data
    (getRect as jest.Mock).mockResolvedValue({
      width: 200,
      height: 20,
      left: 0,
      top: 0,
    });
    (canIUseModel as jest.Mock).mockReturnValue(true);
  });

  test('should render with default props', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-slider': SmartSlider,
        },
        template: `<smart-slider id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.value).toBe(0);
  });

  test('should handle touchstart event', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-slider': SmartSlider,
        },
        template: `<smart-slider id="wrapper" value="{{ 50 }}" />`,
        data: {
          value: 50,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ value: 50, min: 0, max: 100, step: 1 });
      const mockEvent = {
        currentTarget: {
          dataset: {},
        },
        touches: [{ clientX: 100, clientY: 10 }],
      } as any;
      instance.onTouchStart(mockEvent);
      await simulate.sleep(10);

      expect(instance.dragStatus).toBe('start');
      expect(instance.startX).toBe(100);
      expect(instance.startY).toBe(10);
    }
  });

  test('should handle touchstart event with index', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-slider': SmartSlider,
        },
        template: `<smart-slider id="wrapper" range="{{ true }}" value="{{ [20, 80] }}" />`,
        data: {
          value: [20, 80],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ range: true, value: [20, 80] });
      const mockEvent = {
        currentTarget: {
          dataset: { index: 0 },
        },
        touches: [{ clientX: 50, clientY: 10 }],
      } as any;
      instance.onTouchStart(mockEvent);
      await simulate.sleep(10);

      expect(instance.buttonIndex).toBe(0);
      expect(instance.dragStatus).toBe('start');
    }
  });

  test('should not handle touchstart when disabled', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-slider': SmartSlider,
        },
        template: `<smart-slider id="wrapper" disabled value="{{ 50 }}" />`,
        data: {
          value: 50,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ disabled: true, value: 50 });
      const originalDragStatus = instance.dragStatus;
      const mockEvent = {
        currentTarget: {
          dataset: {},
        },
        touches: [{ clientX: 100, clientY: 10 }],
      } as any;
      instance.onTouchStart(mockEvent);
      await simulate.sleep(10);

      // Should not change dragStatus when disabled
      expect(instance.dragStatus).toBe(originalDragStatus);
    }
  });

  test('should handle touchmove event', async () => {
    let dragStartEmitted = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-slider': SmartSlider,
        },
        template: `<smart-slider id="wrapper" value="{{ 50 }}" bind:drag-start="onDragStart" />`,
        data: {
          value: 50,
        },
        methods: {
          onDragStart() {
            dragStartEmitted = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ value: 50, min: 0, max: 100, step: 1 });
      // First trigger touchStart to set startX/startY
      instance.onTouchStart({
        currentTarget: { dataset: {} },
        touches: [{ clientX: 100, clientY: 10 }],
      } as any);
      await simulate.sleep(10);

      // Now trigger touchMove
      const mockEvent = {
        touches: [{ clientX: 150, clientY: 10 }], // Move 50px to the right
      } as any;
      instance.onTouchMove(mockEvent);
      await simulate.sleep(50); // Wait for getRect promise

      expect(dragStartEmitted).toBe(true);
      expect(instance.dragStatus).toBe('moving');
    }
  });

  test('should handle touchmove event with range', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-slider': SmartSlider,
        },
        template: `<smart-slider id="wrapper" range="{{ true }}" value="{{ [20, 80] }}" />`,
        data: {
          value: [20, 80],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ range: true, value: [20, 80], min: 0, max: 100, step: 1 });
      // First trigger touchStart
      instance.onTouchStart({
        currentTarget: { dataset: { index: 0 } },
        touches: [{ clientX: 100, clientY: 10 }],
      } as any);
      await simulate.sleep(10);

      // Now trigger touchMove
      const mockEvent = {
        touches: [{ clientX: 130, clientY: 10 }], // Move 30px to the right
      } as any;
      instance.onTouchMove(mockEvent);
      await simulate.sleep(50); // Wait for getRect promise

      expect(instance.dragStatus).toBe('moving');
    }
  });

  test('should handle touchmove event with vertical', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-slider': SmartSlider,
        },
        template: `<smart-slider id="wrapper" vertical value="{{ 50 }}" />`,
        data: {
          value: 50,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ vertical: true, value: 50, min: 0, max: 100, step: 1 });
      // First trigger touchStart
      instance.onTouchStart({
        currentTarget: { dataset: {} },
        touches: [{ clientX: 10, clientY: 20 }],
      } as any);
      await simulate.sleep(10);

      // Now trigger touchMove (move 30px up)
      const mockEvent = {
        touches: [{ clientX: 10, clientY: -10 }],
      } as any;
      instance.onTouchMove(mockEvent);
      await simulate.sleep(50); // Wait for getRect promise

      expect(instance.dragStatus).toBe('moving');
    }
  });

  test('should not handle touchmove when disabled', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-slider': SmartSlider,
        },
        template: `<smart-slider id="wrapper" disabled value="{{ 50 }}" />`,
        data: {
          value: 50,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ disabled: true, value: 50 });
      const originalDragStatus = instance.dragStatus;
      const mockEvent = {
        touches: [{ clientX: 150, clientY: 10 }],
      } as any;
      instance.onTouchMove(mockEvent);
      await simulate.sleep(10);

      // Should not change dragStatus when disabled
      expect(instance.dragStatus).toBe(originalDragStatus);
    }
  });

  test('should handle touchend event', async () => {
    let dragEndEmitted = false;
    let changeEmitted = false;
    let changeValue: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-slider': SmartSlider,
        },
        template: `<smart-slider id="wrapper" value="{{ 50 }}" bind:drag-end="onDragEnd" bind:change="onChange" />`,
        data: {
          value: 50,
        },
        methods: {
          onDragEnd() {
            dragEndEmitted = true;
          },
          onChange(event: any) {
            changeEmitted = true;
            changeValue = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ value: 50, min: 0, max: 100, step: 1 });
      instance.dragStatus = 'moving';
      instance.newValue = 75;

      instance.onTouchEnd();
      await simulate.sleep(10);

      expect(dragEndEmitted).toBe(true);
      expect(changeEmitted).toBe(true);
      expect(instance.dragStatus).toBe('end');
    }
  });

  test('should not handle touchend when not moving', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-slider': SmartSlider,
        },
        template: `<smart-slider id="wrapper" value="{{ 50 }}" />`,
        data: {
          value: 50,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ value: 50 });
      instance.dragStatus = 'start'; // Not moving

      instance.onTouchEnd();
      await simulate.sleep(10);

      // Should not change to 'end' when not moving
      expect(instance.dragStatus).toBe('start');
    }
  });

  test('should not handle touchend when disabled', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-slider': SmartSlider,
        },
        template: `<smart-slider id="wrapper" disabled value="{{ 50 }}" />`,
        data: {
          value: 50,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ disabled: true, value: 50 });
      const originalDragStatus = instance.dragStatus;
      instance.onTouchEnd();
      await simulate.sleep(10);

      // Should not change dragStatus when disabled
      expect(instance.dragStatus).toBe(originalDragStatus);
    }
  });

  test('should handle click event', async () => {
    let changeEmitted = false;
    let changeValue: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-slider': SmartSlider,
        },
        template: `<smart-slider id="wrapper" value="{{ 50 }}" bind:change="onChange" />`,
        data: {
          value: 50,
        },
        methods: {
          onChange(event: any) {
            changeEmitted = true;
            changeValue = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ value: 50, min: 0, max: 100, step: 1 });
      const mockEvent = {
        touches: [
          {
            clientX: 150, // 75% of 200px width = 75
            clientY: 10,
          },
        ],
      } as any;
      instance.onClick(mockEvent);
      await simulate.sleep(50); // Wait for getRect promise

      expect(changeEmitted).toBe(true);
    }
  });

  test('should handle click event with range - left side', async () => {
    let changeEmitted = false;
    let changeValue: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-slider': SmartSlider,
        },
        template: `<smart-slider id="wrapper" range="{{ true }}" value="{{ [20, 80] }}" bind:change="onChange" />`,
        data: {
          value: [20, 80],
        },
        methods: {
          onChange(event: any) {
            changeEmitted = true;
            changeValue = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ range: true, value: [20, 80], min: 0, max: 100, step: 1 });
      // Click at 30 (middle of [20, 80] is 50, so 30 is on left side)
      const mockEvent = {
        touches: [
          {
            clientX: 60, // 30% of 200px = 30
            clientY: 10,
          },
        ],
      } as any;
      instance.onClick(mockEvent);
      await simulate.sleep(50); // Wait for getRect promise

      expect(changeEmitted).toBe(true);
    }
  });

  test('should handle click event with range - right side', async () => {
    let changeEmitted = false;
    let changeValue: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-slider': SmartSlider,
        },
        template: `<smart-slider id="wrapper" range="{{ true }}" value="{{ [20, 80] }}" bind:change="onChange" />`,
        data: {
          value: [20, 80],
        },
        methods: {
          onChange(event: any) {
            changeEmitted = true;
            changeValue = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ range: true, value: [20, 80], min: 0, max: 100, step: 1 });
      // Click at 70 (middle of [20, 80] is 50, so 70 is on right side)
      const mockEvent = {
        touches: [
          {
            clientX: 140, // 70% of 200px = 70
            clientY: 10,
          },
        ],
      } as any;
      instance.onClick(mockEvent);
      await simulate.sleep(50); // Wait for getRect promise

      expect(changeEmitted).toBe(true);
    }
  });

  test('should handle click event with vertical', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-slider': SmartSlider,
        },
        template: `<smart-slider id="wrapper" vertical value="{{ 50 }}" />`,
        data: {
          value: 50,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ vertical: true, value: 50, min: 0, max: 100, step: 1 });
      const mockEvent = {
        touches: [
          {
            clientX: 10,
            clientY: 10, // 50% of 20px height = 10
          },
        ],
      } as any;
      instance.onClick(mockEvent);
      await simulate.sleep(50); // Wait for getRect promise

      // Should update value
      expect(instance.value).toBeDefined();
    }
  });

  test('should not handle click when disabled', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-slider': SmartSlider,
        },
        template: `<smart-slider id="wrapper" disabled value="{{ 50 }}" />`,
        data: {
          value: 50,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ disabled: true, value: 50 });
      const originalValue = instance.value;
      const mockEvent = {
        touches: [
          {
            clientX: 150,
            clientY: 10,
          },
        ],
      } as any;
      instance.onClick(mockEvent);
      await simulate.sleep(10);

      // Should not change value when disabled
      expect(instance.value).toBe(originalValue);
    }
  });

  test('should handle overlap in handleOverlap', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-slider': SmartSlider,
        },
        template: `<smart-slider id="wrapper" range="{{ true }}" value="{{ [20, 80] }}" />`,
        data: {
          value: [20, 80],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Test with reversed values [80, 20] should become [20, 80]
      const reversed = instance.handleOverlap([80, 20]);
      expect(reversed).toEqual([20, 80]);
    }
  });

  test('should not reverse when values are in order', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-slider': SmartSlider,
        },
        template: `<smart-slider id="wrapper" range="{{ true }}" value="{{ [20, 80] }}" />`,
        data: {
          value: [20, 80],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const ordered = instance.handleOverlap([20, 80]);
      expect(ordered).toEqual([20, 80]);
    }
  });

  test('should emit drag event during drag', async () => {
    let dragEmitted = false;
    let dragValue: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-slider': SmartSlider,
        },
        template: `<smart-slider id="wrapper" value="{{ 50 }}" bind:drag="onDrag" />`,
        data: {
          value: 50,
        },
        methods: {
          onDrag(event: any) {
            dragEmitted = true;
            dragValue = event.detail.value;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ value: 50, min: 0, max: 100, step: 1, vertical: false });
      instance.updateValue(75, false, true); // drag = true
      await simulate.sleep(10);

      expect(dragEmitted).toBe(true);
      expect(dragValue).toBe(75);
    }
  });

  test('should emit change event on end', async () => {
    let changeEmitted = false;
    let changeValue: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-slider': SmartSlider,
        },
        template: `<smart-slider id="wrapper" value="{{ 50 }}" bind:change="onChange" />`,
        data: {
          value: 50,
        },
        methods: {
          onChange(event: any) {
            changeEmitted = true;
            changeValue = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ value: 50, min: 0, max: 100, step: 1, vertical: false });
      instance.updateValue(75, true, false); // end = true
      await simulate.sleep(10);

      expect(changeEmitted).toBe(true);
      expect(changeValue).toBe(75);
    }
  });

  test('should update data value when canIUseModel is true', async () => {
    (canIUseModel as jest.Mock).mockReturnValue(true);

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-slider': SmartSlider,
        },
        template: `<smart-slider id="wrapper" value="{{ 50 }}" />`,
        data: {
          value: 50,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ value: 50, min: 0, max: 100, step: 1 });
      instance.updateValue(75, true, true); // end = true, drag = true
      await simulate.sleep(10);

      // Should update data.value when canIUseModel is true
      expect(wrapper?.data.value).toBe(75);
    }
  });

  test('should not update data value when canIUseModel is false', async () => {
    (canIUseModel as jest.Mock).mockReturnValue(false);

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-slider': SmartSlider,
        },
        template: `<smart-slider id="wrapper" value="{{ 50 }}" />`,
        data: {
          value: 50,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ value: 50, min: 0, max: 100, step: 1 });
      const originalValue = wrapper?.data.value;
      instance.updateValue(75, true, true); // end = true, drag = true
      await simulate.sleep(10);

      // Should not update data.value when canIUseModel is false
      expect(wrapper?.data.value).toBe(originalValue);
    }
  });

  test('should calculate getRange correctly', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-slider': SmartSlider,
        },
        template: `<smart-slider id="wrapper" min="10" max="90" />`,
        data: {
          min: 10,
          max: 90,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ min: 10, max: 90 });
      const range = instance.getRange();
      expect(range).toBe(80); // 90 - 10
    }
  });

  test('should update value when value prop changes', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-slider': SmartSlider,
        },
        template: `<smart-slider id="wrapper" value="{{ value }}" />`,
        data: {
          value: 50,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ value: 75 });
      await simulate.sleep(10);

      expect(instance.value).toBe(75);
    }
  });

  test('should update value with range when value prop changes', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-slider': SmartSlider,
        },
        template: `<smart-slider id="wrapper" range="{{ true }}" value="{{ value }}" />`,
        data: {
          value: [20, 80],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.setData({ range: true, value: [30, 70] });
      await simulate.sleep(10);

      expect(instance.value).toEqual([30, 70]);
    }
  });
});


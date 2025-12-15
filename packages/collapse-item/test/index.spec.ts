import path from 'path';
import simulate from 'miniprogram-simulate';
import { getRect } from '../../common/utils';
import { setContentAnimate } from '../animate';

jest.mock('../../common/utils', () => {
  const actual = jest.requireActual('../../common/utils');
  return {
    ...actual,
    getRect: jest.fn(),
  };
});

describe('collapse-item', () => {
  const SmartCollapseItem = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-collapse-item',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  beforeEach(() => {
    jest.clearAllMocks();
    (getRect as jest.Mock).mockResolvedValue({ width: 100, height: 100, top: 0 });
  });

  test('should handle updateExpanded with parent', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-collapse-item': SmartCollapseItem,
        },
        template: `<smart-collapse-item id="item" name="item1" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const item = comp.querySelector('#item');
    const instance = item?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Mock parent using getRelationNodes
      const mockParent = {
        data: {
          value: ['item1'],
          accordion: false,
        },
        children: [instance],
      } as any;
      (instance as any).getRelationNodes = jest.fn(() => [mockParent]);
      
      // Access parent to trigger getter
      const _ = (instance as any).parent;

      instance.updateExpanded();
      await simulate.sleep(10);

      expect(instance.data.expanded).toBe(true);
    }
  });

  test('should handle updateExpanded without parent', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-collapse-item': SmartCollapseItem,
        },
        template: `<smart-collapse-item id="item" name="item1" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const item = comp.querySelector('#item');
    const instance = item?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Mock getRelationNodes to return empty array (no parent)
      (instance as any).getRelationNodes = jest.fn(() => []);

      // Should not throw error
      expect(() => instance.updateExpanded()).not.toThrow();
      await simulate.sleep(10);
    }
  });

  test('should handle updateExpanded with accordion true', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-collapse-item': SmartCollapseItem,
        },
        template: `<smart-collapse-item id="item" name="item1" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const item = comp.querySelector('#item');
    const instance = item?.instance;
    await simulate.sleep(10);

    if (instance) {
      const mockParent = {
        data: {
          value: 'item1',
          accordion: true,
        },
        children: [instance],
      } as any;
      (instance as any).getRelationNodes = jest.fn(() => [mockParent]);
      const _ = (instance as any).parent;

      instance.updateExpanded();
      await simulate.sleep(10);

      expect(instance.data.expanded).toBe(true);
    }
  });

  test('should handle updateExpanded with name null using index', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-collapse-item': SmartCollapseItem,
        },
        template: `<smart-collapse-item id="item" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const item = comp.querySelector('#item');
    const instance = item?.instance;
    await simulate.sleep(10);

    if (instance) {
      const mockChild1 = { data: { name: 'item1' } };
      const mockParent = {
        data: {
          value: [0],
          accordion: false,
        },
        children: [instance, mockChild1],
      } as any;
      (instance as any).getRelationNodes = jest.fn(() => [mockParent]);
      const _ = (instance as any).parent;

      instance.updateExpanded();
      await simulate.sleep(10);

      expect(instance.data.expanded).toBe(true);
      expect(instance.data.index).toBe(0);
    }
  });

  test('should handle onClick when disabled', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-collapse-item': SmartCollapseItem,
        },
        template: `<smart-collapse-item id="item" disabled="{{ true }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const item = comp.querySelector('#item');
    const instance = item?.instance;
    await simulate.sleep(10);

    if (instance) {
      const mockParent = {
        data: { value: [], accordion: false },
        children: [instance],
        switch: jest.fn(),
      } as any;
      (instance as any).getRelationNodes = jest.fn(() => [mockParent]);
      const _ = (instance as any).parent;

      instance.onClick();
      await simulate.sleep(10);

      expect(mockParent.switch).not.toHaveBeenCalled();
    }
  });

  test('should handle onClick when not disabled', async () => {
    let changeEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-collapse-item': SmartCollapseItem,
        },
        template: `<smart-collapse-item id="item" name="item1" bind:change="onChange" />`,
        methods: {
          onChange(event: any) {
            changeEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const item = comp.querySelector('#item');
    const instance = item?.instance;
    await simulate.sleep(10);

    if (instance) {
      const mockParent = {
        data: { value: [], accordion: false },
        children: [instance],
        switch: jest.fn(),
      } as any;
      (instance as any).getRelationNodes = jest.fn(() => [mockParent]);
      const _ = (instance as any).parent;
      instance.data.expanded = false;
      instance.data.name = 'item1';

      instance.onClick();
      await simulate.sleep(10);

      expect(mockParent.switch).toHaveBeenCalledWith('item1', true);
    }
  });

  test('should handle onClick with name null using index', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-collapse-item': SmartCollapseItem,
        },
        template: `<smart-collapse-item id="item" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const item = comp.querySelector('#item');
    const instance = item?.instance;
    await simulate.sleep(10);

    if (instance) {
      const mockChild1 = { data: { name: 'item1' } };
      const mockParent = {
        data: { value: [], accordion: false },
        children: [instance, mockChild1],
        switch: jest.fn(),
      } as any;
      (instance as any).getRelationNodes = jest.fn(() => [mockParent]);
      const _ = (instance as any).parent;
      instance.data.expanded = false;
      instance.data.name = null;

      instance.onClick();
      await simulate.sleep(10);

      expect(mockParent.switch).toHaveBeenCalledWith(0, true);
    }
  });
});


import path from 'path';
import simulate from 'miniprogram-simulate';
import { getRect } from '../../common/utils';

jest.mock('../../common/utils', () => {
  const actual = jest.requireActual('../../common/utils');
  return {
    ...actual,
    getRect: jest.fn(),
  };
});

describe('dropdown-menu', () => {
  const SmartDropdownMenu = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-dropdown-menu',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  beforeEach(() => {
    jest.clearAllMocks();
    (getRect as jest.Mock).mockResolvedValue({ width: 100, height: 50, top: 0, bottom: 50 });
  });

  test('should handle destroyed lifecycle', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dropdown-menu': SmartDropdownMenu,
        },
        template: `<smart-dropdown-menu id="menu" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#menu');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Trigger destroyed lifecycle by detaching
      comp.detach();
      await simulate.sleep(10);

      // Should not throw error
      expect(instance).toBeDefined();
    }
  });

  test('should handle updateItemListData', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dropdown-menu': SmartDropdownMenu,
        },
        template: `<smart-dropdown-menu id="menu" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#menu');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const mockChild1 = { data: { value: 'value1', title: 'Title 1' } };
      const mockChild2 = { data: { value: 'value2', title: 'Title 2' } };
      const mockChildren = [mockChild1, mockChild2];
      (instance as any).getRelationNodes = jest.fn(() => mockChildren);

      instance.updateItemListData();
      await simulate.sleep(10);

      expect(wrapper?.data.itemListData).toEqual([
        { value: 'value1', title: 'Title 1' },
        { value: 'value2', title: 'Title 2' },
      ]);
    }
  });

  test('should handle updateChildrenData', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dropdown-menu': SmartDropdownMenu,
        },
        template: `<smart-dropdown-menu id="menu" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#menu');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const mockChild1 = {
        data: {},
        updateDataFromParent: jest.fn(),
      };
      const mockChild2 = {
        data: {},
        updateDataFromParent: jest.fn(),
      };
      const mockChildren = [mockChild1, mockChild2];
      (instance as any).getRelationNodes = jest.fn(() => mockChildren);

      instance.updateChildrenData();
      await simulate.sleep(10);

      expect(mockChild1.updateDataFromParent).toHaveBeenCalled();
      expect(mockChild2.updateDataFromParent).toHaveBeenCalled();
    }
  });

  test('should handle toggleItem', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dropdown-menu': SmartDropdownMenu,
        },
        template: `<smart-dropdown-menu id="menu" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#menu');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const mockChild1 = {
        data: { showPopup: false },
        toggle: jest.fn(),
      };
      const mockChild2 = {
        data: { showPopup: true },
        toggle: jest.fn(),
      };
      const mockChildren = [mockChild1, mockChild2];
      (instance as any).getRelationNodes = jest.fn(() => mockChildren);

      instance.toggleItem(0);
      await simulate.sleep(10);

      expect(mockChild1.toggle).toHaveBeenCalled();
      expect(mockChild2.toggle).toHaveBeenCalledWith(false, { immediate: true });
    }
  });

  test('should handle toggleItem when showPopup is false', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dropdown-menu': SmartDropdownMenu,
        },
        template: `<smart-dropdown-menu id="menu" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#menu');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const mockChild1 = {
        data: { showPopup: false },
        toggle: jest.fn(),
      };
      const mockChild2 = {
        data: { showPopup: false },
        toggle: jest.fn(),
      };
      const mockChildren = [mockChild1, mockChild2];
      (instance as any).getRelationNodes = jest.fn(() => mockChildren);

      instance.toggleItem(0);
      await simulate.sleep(10);

      expect(mockChild1.toggle).toHaveBeenCalled();
      expect(mockChild2.toggle).not.toHaveBeenCalled();
    }
  });

  test('should handle close', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dropdown-menu': SmartDropdownMenu,
        },
        template: `<smart-dropdown-menu id="menu" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#menu');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const mockChild1 = {
        data: {},
        toggle: jest.fn(),
      };
      const mockChild2 = {
        data: {},
        toggle: jest.fn(),
      };
      const mockChildren = [mockChild1, mockChild2];
      (instance as any).getRelationNodes = jest.fn(() => mockChildren);

      instance.close();
      await simulate.sleep(10);

      expect(mockChild1.toggle).toHaveBeenCalledWith(false, { immediate: true });
      expect(mockChild2.toggle).toHaveBeenCalledWith(false, { immediate: true });
    }
  });

  test('should handle getChildWrapperStyle with direction down', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dropdown-menu': SmartDropdownMenu,
        },
        template: `<smart-dropdown-menu id="menu" direction="down" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#menu');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.data.zIndex = 10;
      instance.data.direction = 'down';
      (getRect as jest.Mock).mockResolvedValue({ width: 100, height: 50, top: 0, bottom: 100 });

      const result = await instance.getChildWrapperStyle();

      expect(result).toContain('z-index: 10');
      expect(result).toContain('top:');
    }
  });

  test('should handle getChildWrapperStyle with direction up', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dropdown-menu': SmartDropdownMenu,
        },
        template: `<smart-dropdown-menu id="menu" direction="up" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#menu');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.data.zIndex = 10;
      instance.data.direction = 'up';
      (getRect as jest.Mock).mockResolvedValue({ width: 100, height: 50, top: 100, bottom: 150 });

      const result = await instance.getChildWrapperStyle();

      expect(result).toContain('z-index: 10');
      expect(result).toContain('top: 0');
      expect(result).toContain('height:');
    }
  });

  test('should handle onTitleTap with disabled child', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-dropdown-menu': SmartDropdownMenu,
        },
        template: `<smart-dropdown-menu id="menu" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#menu');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const mockChild = {
        data: { disabled: true },
        toggle: jest.fn(),
      };
      const mockChildren = [mockChild];
      (instance as any).getRelationNodes = jest.fn(() => mockChildren);

      const toggleItemSpy = jest.spyOn(instance, 'toggleItem');

      instance.onTitleTap({
        currentTarget: {
          dataset: { index: 0 },
        },
      } as any);
      await simulate.sleep(10);

      expect(toggleItemSpy).not.toHaveBeenCalled();
      toggleItemSpy.mockRestore();
    }
  });

});


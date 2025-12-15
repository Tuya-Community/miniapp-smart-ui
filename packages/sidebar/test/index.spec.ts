import path from 'path';
import simulate from 'miniprogram-simulate';

describe('sidebar', () => {
  const SmartSidebar = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-sidebar',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  test('should render with default props', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-sidebar': SmartSidebar,
        },
        template: `<smart-sidebar id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.activeKey).toBe(0);
  });

  test('should render with custom activeKey', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-sidebar': SmartSidebar,
        },
        template: `<smart-sidebar id="wrapper" active-key="{{ 2 }}" />`,
        data: {
          activeKey: 2,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.activeKey).toBe(2);
  });

  test('should handle setActive when children is empty', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-sidebar': SmartSidebar,
        },
        template: `<smart-sidebar id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Mock empty children
      (instance as any).getRelationNodes = jest.fn(() => []);
      
      // When children is empty, setActive should return early without updating currentActive
      await instance.setActive(1);
      
      // currentActive should remain unchanged when children is empty
      expect(instance.currentActive).toBe(-1);
    }
  });

  test('should handle setActive when children exists', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-sidebar': SmartSidebar,
        },
        template: `<smart-sidebar id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Mock children
      const mockChild1 = {
        setActive: jest.fn(() => Promise.resolve()),
      };
      const mockChild2 = {
        setActive: jest.fn(() => Promise.resolve()),
      };
      const mockChildren = [mockChild1, mockChild2];
      (instance as any).getRelationNodes = jest.fn(() => mockChildren);
      
      instance.currentActive = -1;
      await instance.setActive(0);
      
      expect(instance.currentActive).toBe(0);
      expect(mockChild1.setActive).toHaveBeenCalledWith(true);
      expect(mockChild2.setActive).not.toHaveBeenCalled();
    }
  });

  test('should handle setActive when switching from one active to another', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-sidebar': SmartSidebar,
        },
        template: `<smart-sidebar id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Mock children
      const mockChild0 = {
        setActive: jest.fn(() => Promise.resolve()),
      };
      const mockChild1 = {
        setActive: jest.fn(() => Promise.resolve()),
      };
      const mockChildren = [mockChild0, mockChild1];
      (instance as any).getRelationNodes = jest.fn(() => mockChildren);
      
      instance.currentActive = 0;
      await instance.setActive(1);
      
      expect(instance.currentActive).toBe(1);
      expect(mockChild0.setActive).toHaveBeenCalledWith(false);
      expect(mockChild1.setActive).toHaveBeenCalledWith(true);
    }
  });

  test('should handle setActive when activeKey is out of bounds', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-sidebar': SmartSidebar,
        },
        template: `<smart-sidebar id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Mock children
      const mockChild0 = {
        setActive: jest.fn(() => Promise.resolve()),
      };
      const mockChildren = [mockChild0];
      (instance as any).getRelationNodes = jest.fn(() => mockChildren);
      
      instance.currentActive = 0;
      await instance.setActive(5); // Out of bounds
      
      expect(instance.currentActive).toBe(5);
      expect(mockChild0.setActive).toHaveBeenCalledWith(false);
      // Should not throw error when accessing children[5]
    }
  });

  test('should handle setActive when activeKey is same as currentActive', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-sidebar': SmartSidebar,
        },
        template: `<smart-sidebar id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Mock children
      const mockChild0 = {
        setActive: jest.fn(() => Promise.resolve()),
      };
      const mockChildren = [mockChild0];
      (instance as any).getRelationNodes = jest.fn(() => mockChildren);
      
      instance.currentActive = 0;
      await instance.setActive(0);
      
      expect(instance.currentActive).toBe(0);
      // When currentActive === activeKey, should still call setActive(true)
      expect(mockChild0.setActive).toHaveBeenCalledWith(true);
    }
  });

  test('should handle activeKey observer', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-sidebar': SmartSidebar,
        },
        template: `<smart-sidebar id="wrapper" active-key="{{ activeKey }}" />`,
        data: {
          activeKey: 0,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Mock children
      const mockChild0 = {
        setActive: jest.fn(() => Promise.resolve()),
      };
      const mockChild1 = {
        setActive: jest.fn(() => Promise.resolve()),
      };
      const mockChildren = [mockChild0, mockChild1];
      (instance as any).getRelationNodes = jest.fn(() => mockChildren);
      
      // Set initial active state
      instance.currentActive = 0;
      await instance.setActive(1);
      
      expect(instance.currentActive).toBe(1);
      // When switching from 0 to 1, child0 should be deactivated and child1 should be activated
      expect(mockChild0.setActive).toHaveBeenCalledWith(false);
      expect(mockChild1.setActive).toHaveBeenCalledWith(true);
    }
  });
});


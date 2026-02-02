import path from 'path';
import simulate from 'miniprogram-simulate';

describe('tab', () => {
  const SmartTab = simulate.load(path.resolve(__dirname, '../index'), 'smart-tab', {
    rootPath: path.resolve(__dirname, '../../'),
  });

  const mockGetRelationNodes = (instance: any, parent: any) => {
    instance.getRelationNodes = jest.fn(() => (parent ? [parent] : []));
  };

  test('should render with default props', () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-tab': SmartTab,
        },
        template: '<smart-tab id="wrapper" />',
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');

    expect(wrapper?.data.active).toBe(false);
    expect(wrapper?.data.dot).toBe(false);
    expect(wrapper?.data.info).toBeNull();
    expect(wrapper?.data.title).toBe('');
    expect(wrapper?.data.subtitle).toBe('');
    expect(wrapper?.data.disabled).toBe(false);
    expect(wrapper?.data.name).toBe('');
  });

  test('getComputedName should return name when name is set', () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-tab': SmartTab,
        },
        template: '<smart-tab id="wrapper" name="my-tab" />',
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      mockGetRelationNodes(instance, null);
      expect(instance.getComputedName()).toBe('my-tab');
    }
  });

  test('getComputedName should return index when name is empty', () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-tab': SmartTab,
        },
        template: '<smart-tab id="wrapper" />',
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      const mockParent = {
        children: [{ index: 0 }, instance],
      };
      mockGetRelationNodes(instance, mockParent);
      expect(instance.getComputedName()).toBe(1);
    }
  });

  test('updateRender should set active and shouldRender when parent has inactiveDestroy', () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-tab': SmartTab,
        },
        template: '<smart-tab id="wrapper" />',
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      const mockParent = {
        data: {
          inactiveDestroy: true,
          lazyRender: false,
          animated: false,
        },
      };
      instance.updateRender(true, mockParent);

      expect(instance.data.active).toBe(true);
      expect(instance.data.shouldRender).toBe(true);
      expect(instance.data.shouldShow).toBe(true);
      expect(instance.inited).toBe(true);
    }
  });

  test('updateRender should set shouldRender false when inactive and inactiveDestroy', () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-tab': SmartTab,
        },
        template: '<smart-tab id="wrapper" />',
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      instance.inited = true;
      const mockParent = {
        data: {
          inactiveDestroy: true,
          lazyRender: false,
          animated: false,
        },
      };
      instance.updateRender(false, mockParent);

      expect(instance.data.active).toBe(false);
      expect(instance.data.shouldRender).toBe(false);
      expect(instance.data.shouldShow).toBe(false);
    }
  });

  test('updateRender should set shouldShow when parent animated', () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-tab': SmartTab,
        },
        template: '<smart-tab id="wrapper" />',
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      const mockParent = {
        data: {
          inactiveDestroy: false,
          lazyRender: true,
          animated: true,
        },
      };
      instance.updateRender(false, mockParent);

      expect(instance.data.shouldShow).toBe(true);
    }
  });

  test('update should call parent.updateTabs when parent exists', () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-tab': SmartTab,
        },
        template: '<smart-tab id="wrapper" />',
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      const updateTabs = jest.fn();
      const mockParent = { updateTabs };
      mockGetRelationNodes(instance, mockParent);

      instance.update();

      expect(updateTabs).toHaveBeenCalled();
    }
  });

  test('update should not throw when parent is null', () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-tab': SmartTab,
        },
        template: '<smart-tab id="wrapper" />',
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      mockGetRelationNodes(instance, null);
      expect(() => instance.update()).not.toThrow();
    }
  });
});

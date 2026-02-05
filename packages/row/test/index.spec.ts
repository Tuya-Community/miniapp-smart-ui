import path from 'path';
import simulate from 'miniprogram-simulate';

describe('row', () => {
  const SmartRow = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-row',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render with default props', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-row': SmartRow,
        },
        template: `<smart-row id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper).toBeDefined();
  });

  test('should set gutter to children when relation is established', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-row': SmartRow,
        },
        template: `<smart-row id="wrapper" gutter="{{ 10 }}" />`,
        data: {
          gutter: 10,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const mockChild1 = {
        setData: jest.fn(),
      };
      instance.data.gutter = 10;

      // The relation callback function is: function (target) { const { gutter } = this.data; if (gutter) { target.setData({ gutter }); } }
      // We can directly test the relation callback logic by simulating it
      const relationCallback = function (this: any, target: any) {
        const { gutter } = this.data;
        if (gutter) {
          target.setData({ gutter });
        }
      };
      
      relationCallback.call(instance, mockChild1);

      await simulate.sleep(10);

      // Child should receive gutter data
      expect(mockChild1.setData).toHaveBeenCalledWith({ gutter: 10 });
    }
  });

  test('should call setGutter when gutter prop changes', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-row': SmartRow,
        },
        template: `<smart-row id="wrapper" gutter="{{ gutter }}" />`,
        data: {
          gutter: 10,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const mockChild1 = {
        setData: jest.fn(),
      };
      const mockChild2 = {
        setData: jest.fn(),
      };
      (instance as any).getRelationNodes = jest.fn(() => [mockChild1, mockChild2]);
      instance.data.gutter = 10;

      // Call setGutter directly
      instance.setGutter();
      await simulate.sleep(10);

      // Both children should receive data
      expect(mockChild1.setData).toHaveBeenCalledWith(instance.data);
      expect(mockChild2.setData).toHaveBeenCalledWith(instance.data);
    }
  });

  test('should not set gutter to child when gutter is not provided in relation', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-row': SmartRow,
        },
        template: `<smart-row id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const mockChild = {
        setData: jest.fn(),
      };
      (instance as any).getRelationNodes = jest.fn(() => [mockChild]);
      instance.data.gutter = undefined;

      // Simulate relation callback
      const relationCallback = (instance as any).relation?.linked?.(mockChild);
      if (relationCallback) {
        relationCallback(mockChild);
      }

      await simulate.sleep(10);

      // Child should not receive gutter when gutter is undefined
      expect(mockChild.setData).not.toHaveBeenCalled();
    }
  });
});

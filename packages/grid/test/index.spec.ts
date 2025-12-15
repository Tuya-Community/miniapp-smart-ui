import path from 'path';
import simulate from 'miniprogram-simulate';

describe('grid', () => {
  const SmartGrid = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-grid',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  test('should handle updateChildren', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-grid': SmartGrid,
        },
        template: `<smart-grid id="grid" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#grid');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const mockChild1 = {
        updateStyle: jest.fn(),
      };
      const mockChild2 = {
        updateStyle: jest.fn(),
      };
      const mockChildren = [mockChild1, mockChild2];
      (instance as any).getRelationNodes = jest.fn(() => mockChildren);

      instance.updateChildren();
      await simulate.sleep(10);

      expect(mockChild1.updateStyle).toHaveBeenCalled();
      expect(mockChild2.updateStyle).toHaveBeenCalled();
    }
  });
});


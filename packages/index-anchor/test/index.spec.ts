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

describe('index-anchor', () => {
  const SmartIndexAnchor = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-index-anchor',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  beforeEach(() => {
    jest.clearAllMocks();
    (getRect as jest.Mock).mockResolvedValue({ width: 100, height: 50, top: 100 });
    
    // Mock wx.pageScrollTo
    wx.pageScrollTo = jest.fn() as any;
  });

  test('should handle scrollIntoView', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-index-anchor': SmartIndexAnchor,
        },
        template: `<smart-index-anchor id="anchor" index="A" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const anchor = comp.querySelector('#anchor');
    const anchorInstance = anchor?.instance;
    await simulate.sleep(10);

    if (anchorInstance) {
      // Create a mock parent instance
      // This simulates the parent component (index-bar) that index-anchor relates to
      const mockParent = {
        data: { stickyOffsetTop: 0 },
      } as any;
      
      // Mock getRelationNodes to return parent instance
      // This is how relations work - getRelationNodes returns the parent component
      // The parent property is defined in relation.ts as: get: () => this.getRelationNodes(path)[0]
      (anchorInstance as any).getRelationNodes = jest.fn(() => [mockParent]);
      
      // Access parent to trigger getter with mocked getRelationNodes
      // This is necessary because parent is defined as a getter that calls getRelationNodes
      // We need to access it once to cache it (if needed) or ensure the getter works
      const _ = (anchorInstance as any).parent;

      await anchorInstance.scrollIntoView(50);
      await simulate.sleep(10);

      expect(getRect).toHaveBeenCalledWith(anchorInstance, '.smart-index-anchor-wrapper');
      expect(wx.pageScrollTo).toHaveBeenCalledWith({
        duration: 0,
        scrollTop: 150, // 50 + 100 - 0
      });
    }
  });

  test('should handle scrollIntoView with stickyOffsetTop', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-index-anchor': SmartIndexAnchor,
        },
        template: `<smart-index-anchor id="anchor" index="A" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const anchor = comp.querySelector('#anchor');
    const anchorInstance = anchor?.instance;
    await simulate.sleep(10);

    if (anchorInstance) {
      // Create a mock parent instance with stickyOffsetTop
      const mockParent = {
        data: { stickyOffsetTop: 20 },
      } as any;
      
      // Mock getRelationNodes to return parent instance
      (anchorInstance as any).getRelationNodes = jest.fn(() => [mockParent]);
      
      // Access parent to trigger getter with mocked getRelationNodes
      const _ = (anchorInstance as any).parent;

      await anchorInstance.scrollIntoView(100);
      await simulate.sleep(10);

      expect(wx.pageScrollTo).toHaveBeenCalledWith({
        duration: 0,
        scrollTop: 180, // 100 + 100 - 20
      });
    }
  });
});

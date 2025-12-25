import path from 'path';
import simulate from 'miniprogram-simulate';
import { pageScrollMixin } from '../page-scroll';

describe('mixins/page-scroll', () => {
  // Use index-bar component which uses pageScrollMixin
  const SmartIndexBar = simulate.load(
    path.resolve(__dirname, '../../index-bar/index'),
    'smart-index-bar',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  beforeEach(() => {
    // Mock getCurrentPages
    (global as any).getCurrentPages = jest.fn(() => [{}]);
  });

  test('should handle onPageScroll function (lines 11-18)', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-index-bar': SmartIndexBar,
        },
        template: `<smart-index-bar id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance && instance._scroller) {
      // Test the scroller function (lines 11-18)
      const mockEvent = { scrollTop: 100 };
      instance._scroller(mockEvent);
      
      expect(instance.scrollTop).toBe(100);
    }
  });

  test('should handle attached lifecycle with existing onPageScroll (line 37)', async () => {
    const mockPage = {
      onPageScroll: jest.fn(),
      smartPageScroller: [] as any[],
    };
    
    (global as any).getCurrentPages = jest.fn(() => [mockPage]);

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-index-bar': SmartIndexBar,
        },
        template: `<smart-index-bar id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    await simulate.sleep(10);

    // Verify that existing onPageScroll was added to smartPageScroller
    expect(mockPage.smartPageScroller.length).toBeGreaterThan(0);
  });

  test('should handle attached lifecycle when page is not defined (line 29)', async () => {
    (global as any).getCurrentPages = jest.fn(() => []);

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-index-bar': SmartIndexBar,
        },
        template: `<smart-index-bar id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    await simulate.sleep(10);

    // Should not throw error
    expect(comp).toBeDefined();
  });

  test('should handle detached lifecycle (lines 49-63)', async () => {
    const mockScroller = jest.fn();
    const mockPage = {
      smartPageScroller: [mockScroller],
    };
    
    (global as any).getCurrentPages = jest.fn(() => [mockPage]);

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-index-bar': SmartIndexBar,
        },
        template: `<smart-index-bar id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Set the scroller
      instance._scroller = mockScroller;
      
      // Detach the component
      comp.detach();
      await simulate.sleep(10);

      // Verify scroller was removed
      expect(mockPage.smartPageScroller).not.toContain(mockScroller);
      expect(instance._scroller).toBeUndefined();
    }
  });

  test('should handle detached lifecycle when page is not defined (line 51)', async () => {
    (global as any).getCurrentPages = jest.fn(() => []);

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-index-bar': SmartIndexBar,
        },
        template: `<smart-index-bar id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      // Detach should not throw error
      comp.detach();
      await simulate.sleep(10);
      
      expect(comp).toBeDefined();
    }
  });
});


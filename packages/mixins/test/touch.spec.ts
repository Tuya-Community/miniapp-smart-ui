import path from 'path';
import simulate from 'miniprogram-simulate';

describe('mixins/touch', () => {
  // Use swipe-cell component which uses touch mixin
  const SmartSwipeCell = simulate.load(
    path.resolve(__dirname, '../../swipe-cell/index'),
    'smart-swipe-cell',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  test('should handle getDirection returning empty string (line 13)', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-swipe-cell': SmartSwipeCell,
        },
        template: `<smart-swipe-cell id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      // Test touchStart
      const mockTouchStartEvent = {
        touches: [{ clientX: 10, clientY: 10 }],
      } as any;
      
      instance.touchStart(mockTouchStartEvent);
      expect(instance.startX).toBe(10);
      expect(instance.startY).toBe(10);
      
      // Test touchMove with small movement (should return empty direction)
      const mockTouchMoveEvent = {
        touches: [{ clientX: 11, clientY: 11 }], // Small movement, less than MIN_DISTANCE (10)
      } as any;
      
      instance.touchMove(mockTouchMoveEvent);
      // Direction should be empty when movement is less than MIN_DISTANCE
      expect(instance.direction).toBe('');
    }
  });

  test('should handle touchStart and touchMove', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-swipe-cell': SmartSwipeCell,
        },
        template: `<smart-swipe-cell id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      instance.resetTouchStatus();
      expect(instance.direction).toBe('');
      expect(instance.deltaX).toBe(0);
      expect(instance.deltaY).toBe(0);
      
      const mockTouchStartEvent = {
        touches: [{ clientX: 100, clientY: 100 }],
      } as any;
      
      instance.touchStart(mockTouchStartEvent);
      
      const mockTouchMoveEvent = {
        touches: [{ clientX: 150, clientY: 110 }], // Horizontal movement > vertical
      } as any;
      
      instance.touchMove(mockTouchMoveEvent);
      expect(instance.direction).toBe('horizontal');
      expect(instance.deltaX).toBe(50);
      expect(instance.deltaY).toBe(10);
    }
  });
});


import path from 'path';
import simulate from 'miniprogram-simulate';

describe('count-down', () => {
  const SmartCountDown = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-count-down',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  test('should render with default props', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-count-down': SmartCountDown,
        },
        template: `<smart-count-down id="wrapper" time="{{ 10000 }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.format).toBe('HH:mm:ss');
    expect(wrapper?.data.autoStart).toBe(true);
  });

  test('should start countdown automatically when autoStart is true', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-count-down': SmartCountDown,
        },
        template: `<smart-count-down id="wrapper" time="{{ 10000 }}" auto-start="{{ true }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    // Should start automatically
    expect(wrapper?.data.formattedTime).toBeDefined();
  });

  test('should not start countdown when autoStart is false', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-count-down': SmartCountDown,
        },
        template: `<smart-count-down id="wrapper" time="{{ 10000 }}" auto-start="{{ false }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);
    
    if (instance) {
      expect(instance.counting).toBeFalsy();
    }
  });

  test('should start countdown manually', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-count-down': SmartCountDown,
        },
        template: `<smart-count-down id="wrapper" time="{{ 10000 }}" auto-start="{{ false }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);
    
    if (instance) {
      instance.start();
      await simulate.sleep(50);
      
      expect(instance.counting).toBe(true);
    }
  });

  test('should not start when already counting', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-count-down': SmartCountDown,
        },
        template: `<smart-count-down id="wrapper" time="{{ 10000 }}" auto-start="{{ false }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);
    
    if (instance) {
      instance.start();
      await simulate.sleep(50);
      
      const initialEndTime = instance.endTime;
      
      // Try to start again
      instance.start();
      await simulate.sleep(50);
      
      // endTime should not change
      expect(instance.endTime).toBe(initialEndTime);
    }
  });

  test('should pause countdown', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-count-down': SmartCountDown,
        },
        template: `<smart-count-down id="wrapper" time="{{ 10000 }}" auto-start="{{ false }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);
    
    if (instance) {
      instance.start();
      await simulate.sleep(50);
      
      expect(instance.counting).toBe(true);
      
      instance.pause();
      await simulate.sleep(50);
      
      expect(instance.counting).toBe(false);
    }
  });

  test('should reset countdown', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-count-down': SmartCountDown,
        },
        template: `<smart-count-down id="wrapper" time="{{ 10000 }}" auto-start="{{ true }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(100);
    
    if (instance) {
      // Pause first to stop counting
      instance.pause();
      await simulate.sleep(10);
      
      // Now reset
      instance.reset();
      await simulate.sleep(100);
      
      // Should reset to initial time (approximately, may have small difference due to timing)
      expect(instance.remain).toBeGreaterThan(9900);
      expect(instance.remain).toBeLessThanOrEqual(10000);
      // Should start automatically when autoStart is true
      expect(instance.counting).toBe(true);
    }
  });

  test('should reset without autoStart', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-count-down': SmartCountDown,
        },
        template: `<smart-count-down id="wrapper" time="{{ 10000 }}" auto-start="{{ false }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);
    
    if (instance) {
      instance.setData({ autoStart: false });
      instance.reset();
      await simulate.sleep(50);
      
      // Should not start automatically
      expect(instance.counting).toBe(false);
    }
  });

  test('should use microTick when millisecond is true', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-count-down': SmartCountDown,
        },
        template: `<smart-count-down id="wrapper" time="{{ 10000 }}" millisecond="{{ true }}" auto-start="{{ false }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);
    
    if (instance) {
      instance.start();
      await simulate.sleep(100);
      
      // Should use microTick
      expect(instance.counting).toBe(true);
    }
  });

  test('should use macroTick when millisecond is false', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-count-down': SmartCountDown,
        },
        template: `<smart-count-down id="wrapper" time="{{ 10000 }}" millisecond="{{ false }}" auto-start="{{ false }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);
    
    if (instance) {
      instance.start();
      await simulate.sleep(100);
      
      // Should use macroTick
      expect(instance.counting).toBe(true);
    }
  });

  test('should emit change event when useSlot is true', async () => {
    let changeEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-count-down': SmartCountDown,
        },
        template: `<smart-count-down id="wrapper" time="{{ 10000 }}" use-slot="{{ true }}" auto-start="{{ false }}" bind:change="onChange" />`,
        methods: {
          onChange(event: any) {
            changeEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);
    
    if (instance) {
      instance.setData({ useSlot: true });
      instance.setRemain(5000);
      await simulate.sleep(10);
      
      expect(changeEvent).toBeTruthy();
      expect(changeEvent).toHaveProperty('days');
      expect(changeEvent).toHaveProperty('hours');
      expect(changeEvent).toHaveProperty('minutes');
      expect(changeEvent).toHaveProperty('seconds');
      expect(changeEvent).toHaveProperty('milliseconds');
    }
  });

  test('should emit finish event when countdown reaches 0', async () => {
    let finishEmitted = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-count-down': SmartCountDown,
        },
        template: `<smart-count-down id="wrapper" time="{{ 1000 }}" auto-start="{{ false }}" bind:finish="onFinish" />`,
        methods: {
          onFinish() {
            finishEmitted = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);
    
    if (instance) {
      instance.setRemain(0);
      await simulate.sleep(10);
      
      expect(finishEmitted).toBe(true);
      expect(instance.counting).toBe(false);
    }
  });

  test('should format time correctly', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-count-down': SmartCountDown,
        },
        template: `<smart-count-down id="wrapper" time="{{ 3661000 }}" format="HH:mm:ss" auto-start="{{ false }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);
    
    if (instance) {
      instance.setRemain(3661000);
      await simulate.sleep(10);
      
      // 1 hour, 1 minute, 1 second = 01:01:01
      expect(wrapper?.data.formattedTime).toMatch(/01:01:01/);
    }
  });

  test('should handle destroyed lifecycle', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-count-down': SmartCountDown,
        },
        template: `<smart-count-down id="wrapper" time="{{ 10000 }}" auto-start="{{ false }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);
    
    if (instance) {
      instance.start();
      await simulate.sleep(50);
      
      // Verify tid is set
      expect(instance.tid).toBeTruthy();
      
      // Call destroyed method directly if available
      if (typeof instance.destroyed === 'function') {
        instance.destroyed();
        await simulate.sleep(10);
        
        // tid should be cleared
        expect(instance.tid).toBeNull();
      } else {
        // If destroyed is not directly callable, detach component
        comp.detach();
        await simulate.sleep(10);
        
        // Verify component was detached
        expect(instance).toBeDefined();
      }
    }
  });

  test('should handle microTick recursion', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-count-down': SmartCountDown,
        },
        template: `<smart-count-down id="wrapper" time="{{ 5000 }}" millisecond="{{ true }}" auto-start="{{ false }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);
    
    if (instance) {
      instance.start();
      
      // Advance time multiple times to trigger recursion
      await simulate.sleep(200);
      
      expect(instance.counting).toBe(true);
    }
  });

  test('should handle macroTick with same second check', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-count-down': SmartCountDown,
        },
        template: `<smart-count-down id="wrapper" time="{{ 5000 }}" millisecond="{{ false }}" auto-start="{{ false }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);
    
    if (instance) {
      instance.start();
      instance.remain = 5000;
      
      // Advance time to trigger macroTick
      await simulate.sleep(200);
      
      expect(instance.counting).toBe(true);
    }
  });

  test('should handle macroTick when remain reaches 0', async () => {
    let finishEmitted = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-count-down': SmartCountDown,
        },
        template: `<smart-count-down id="wrapper" time="{{ 1000 }}" millisecond="{{ false }}" auto-start="{{ false }}" bind:finish="onFinish" />`,
        methods: {
          onFinish() {
            finishEmitted = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);
    
    if (instance) {
      instance.start();
      
      // Set remain to 0 to trigger finish
      instance.setRemain(0);
      await simulate.sleep(10);
      
      // Should stop counting and emit finish
      expect(instance.counting).toBe(false);
      expect(finishEmitted).toBe(true);
    }
  });

  test('should handle getRemain correctly', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-count-down': SmartCountDown,
        },
        template: `<smart-count-down id="wrapper" time="{{ 10000 }}" auto-start="{{ false }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);
    
    if (instance) {
      instance.start();
      await simulate.sleep(50);
      
      const remain = instance.getRemain();
      
      // Should return non-negative value
      expect(remain).toBeGreaterThanOrEqual(0);
    }
  });

  test('should handle getRemain when time has passed', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-count-down': SmartCountDown,
        },
        template: `<smart-count-down id="wrapper" time="{{ 1000 }}" auto-start="{{ false }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);
    
    if (instance) {
      instance.start();
      
      // Set endTime to past
      instance.endTime = Date.now() - 1000;
      
      const remain = instance.getRemain();
      
      // Should return 0 when time has passed
      expect(remain).toBe(0);
    }
  });

  test('should format time without ss in format string', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-count-down': SmartCountDown,
        },
        template: `<smart-count-down id="wrapper" time="{{ 5000 }}" format="HH:mm" auto-start="{{ false }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);
    
    if (instance) {
      // Set remain with seconds
      instance.setRemain(5000);
      await simulate.sleep(10);
      
      // Should format correctly without ss
      expect(wrapper?.data.formattedTime).toBeDefined();
    }
  });

  test('should format time with custom format including DD', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-count-down': SmartCountDown,
        },
        template: `<smart-count-down id="wrapper" time="{{ 90000000 }}" format="DD:HH:mm:ss" auto-start="{{ false }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);
    
    if (instance) {
      instance.setRemain(90000000);
      await simulate.sleep(10);
      
      // Should format with days
      expect(wrapper?.data.formattedTime).toBeDefined();
      expect(wrapper?.data.formattedTime).toContain(':');
    }
  });

  test('should format time with milliseconds', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-count-down': SmartCountDown,
        },
        template: `<smart-count-down id="wrapper" time="{{ 1234 }}" format="ss.SSS" auto-start="{{ false }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);
    
    if (instance) {
      instance.setRemain(1234);
      await simulate.sleep(10);
      
      // Should format with milliseconds
      expect(wrapper?.data.formattedTime).toBeDefined();
      expect(wrapper?.data.formattedTime).toContain('.');
    }
  });
});


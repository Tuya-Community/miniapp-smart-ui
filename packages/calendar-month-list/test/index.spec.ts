import path from 'path';
import simulate from 'miniprogram-simulate';

describe('calendar-month-list', () => {
  const SmartCalendarMonthList = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-calendar-month-list',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  beforeEach(() => {
    // Mock ty.vibrateShort
    global.ty = {
      vibrateShort: jest.fn(),
    } as any;
  });

  test('should render with default props', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar-month-list': SmartCalendarMonthList,
        },
        template: `<smart-calendar-month-list id="wrapper" date="{{ date }}" />`,
        data: {
          date: new Date(2024, 0, 15).getTime(),
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.months).toBeDefined();
    expect(Array.isArray(wrapper?.data.months)).toBe(true);
  });

  test('should handle onClick with enabled month', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar-month-list': SmartCalendarMonthList,
        },
        template: `<smart-calendar-month-list id="wrapper" date="{{ date }}" />`,
        data: {
          date: new Date(2024, 0, 15).getTime(),
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance && wrapper?.data.months && wrapper.data.months.length > 0) {
      const emitSpy = jest.spyOn(instance, '$emit');
      const mockEvent = {
        currentTarget: {
          dataset: {
            index: 0,
          },
        },
      } as any;
      
      instance.onClick(mockEvent);
      
      expect(emitSpy).toHaveBeenCalled();
      expect(global.ty.vibrateShort).toHaveBeenCalledWith({ type: 'light' });
      emitSpy.mockRestore();
    }
  });

  test('should handle onClick with disabled month', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar-month-list': SmartCalendarMonthList,
        },
        template: `<smart-calendar-month-list id="wrapper" date="{{ date }}" min-date="{{ minDate }}" max-date="{{ maxDate }}" />`,
        data: {
          date: new Date(2024, 0, 15).getTime(),
          minDate: new Date(2024, 5, 1).getTime(),
          maxDate: new Date(2024, 6, 31).getTime(),
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance && wrapper?.data.months && wrapper.data.months.length > 0) {
      const emitSpy = jest.spyOn(instance, '$emit');
      const mockEvent = {
        currentTarget: {
          dataset: {
            index: 0,
          },
        },
      } as any;
      
      instance.onClick(mockEvent);
      
      expect(emitSpy).not.toHaveBeenCalled();
      emitSpy.mockRestore();
    }
  });

  test('should handle onClick when readonly', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar-month-list': SmartCalendarMonthList,
        },
        template: `<smart-calendar-month-list id="wrapper" date="{{ date }}" readonly="{{ true }}" />`,
        data: {
          date: new Date(2024, 0, 15).getTime(),
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance && wrapper?.data.months && wrapper.data.months.length > 0) {
      const emitSpy = jest.spyOn(instance, '$emit');
      const mockEvent = {
        currentTarget: {
          dataset: {
            index: 0,
          },
        },
      } as any;
      
      instance.onClick(mockEvent);
      
      expect(emitSpy).not.toHaveBeenCalled();
      emitSpy.mockRestore();
    }
  });

  test('should handle visibleIndex observer', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar-month-list': SmartCalendarMonthList,
        },
        template: `<smart-calendar-month-list id="wrapper" date="{{ date }}" visible-index="{{ visibleIndex }}" />`,
        data: {
          date: new Date(2024, 0, 15).getTime(),
          visibleIndex: 0,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.months).toBeDefined();
    
    // Change visibleIndex
    comp.setData({ visibleIndex: 1 });
    await simulate.sleep(10);
    
    expect(wrapper?.data.months).toBeDefined();
  });

  test('should handle getMonthList with different visibleIndex', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar-month-list': SmartCalendarMonthList,
        },
        template: `<smart-calendar-month-list id="wrapper" date="{{ date }}" visible-index="{{ visibleIndex }}" />`,
        data: {
          date: new Date(2024, 0, 15).getTime(),
          visibleIndex: 0,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const emitSpy = jest.spyOn(instance, '$emit');
      instance.getMonthList(1);
      await simulate.sleep(10);
      
      expect(emitSpy).toHaveBeenCalledWith('changemonthtitle', expect.any(Number));
      emitSpy.mockRestore();
    }
  });
});


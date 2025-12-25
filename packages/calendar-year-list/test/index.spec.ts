import path from 'path';
import simulate from 'miniprogram-simulate';

describe('calendar-year-list', () => {
  const SmartCalendarYearList = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-calendar-year-list',
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
          'smart-calendar-year-list': SmartCalendarYearList,
        },
        template: `<smart-calendar-year-list id="wrapper" date="{{ date }}" />`,
        data: {
          date: new Date(2024, 0, 15).getTime(),
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.years).toBeDefined();
    expect(Array.isArray(wrapper?.data.years)).toBe(true);
  });

  test('should handle onClick with enabled year', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar-year-list': SmartCalendarYearList,
        },
        template: `<smart-calendar-year-list id="wrapper" date="{{ date }}" />`,
        data: {
          date: new Date(2024, 0, 15).getTime(),
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance && wrapper?.data.years && wrapper.data.years.length > 0) {
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

  test('should handle onClick with disabled year', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar-year-list': SmartCalendarYearList,
        },
        template: `<smart-calendar-year-list id="wrapper" date="{{ date }}" min-date="{{ minDate }}" max-date="{{ maxDate }}" />`,
        data: {
          date: new Date(2024, 0, 15).getTime(),
          minDate: new Date(2025, 0, 1).getTime(),
          maxDate: new Date(2026, 11, 31).getTime(),
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance && wrapper?.data.years && wrapper.data.years.length > 0) {
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
          'smart-calendar-year-list': SmartCalendarYearList,
        },
        template: `<smart-calendar-year-list id="wrapper" date="{{ date }}" readonly="{{ true }}" />`,
        data: {
          date: new Date(2024, 0, 15).getTime(),
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance && wrapper?.data.years && wrapper.data.years.length > 0) {
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

  test('should handle date observer', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar-year-list': SmartCalendarYearList,
        },
        template: `<smart-calendar-year-list id="wrapper" date="{{ date }}" />`,
        data: {
          date: new Date(2024, 0, 15).getTime(),
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.years).toBeDefined();
    
    // Change date
    comp.setData({ date: new Date(2025, 0, 15).getTime() });
    await simulate.sleep(10);
    
    expect(wrapper?.data.currentYear).toBe(2025);
  });

  test('should handle visibleIndex observer', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar-year-list': SmartCalendarYearList,
        },
        template: `<smart-calendar-year-list id="wrapper" date="{{ date }}" visible-index="{{ visibleIndex }}" />`,
        data: {
          date: new Date(2024, 0, 15).getTime(),
          visibleIndex: 0,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.years).toBeDefined();
    
    // Change visibleIndex
    comp.setData({ visibleIndex: 1 });
    await simulate.sleep(10);
    
    expect(wrapper?.data.years).toBeDefined();
  });

  test('should handle getYearList with different visibleIndex', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar-year-list': SmartCalendarYearList,
        },
        template: `<smart-calendar-year-list id="wrapper" date="{{ date }}" visible-index="{{ visibleIndex }}" />`,
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
      instance.getYearList();
      await simulate.sleep(10);
      
      expect(wrapper?.data.years).toBeDefined();
    }
  });

  test('should handle calcYear', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar-year-list': SmartCalendarYearList,
        },
        template: `<smart-calendar-year-list id="wrapper" date="{{ date }}" />`,
        data: {
          date: new Date(2024, 0, 15).getTime(),
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      instance.calcYear();
      await simulate.sleep(10);
      
      expect(wrapper?.data.currentYear).toBe(2024);
    }
  });
});


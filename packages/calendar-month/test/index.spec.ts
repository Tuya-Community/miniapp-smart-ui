import path from 'path';
import simulate from 'miniprogram-simulate';

describe('calendar-month', () => {
  const SmartCalendarMonth = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-calendar-month',
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
          'smart-calendar-month': SmartCalendarMonth,
        },
        template: `<smart-calendar-month id="wrapper" date="{{ date }}" />`,
        data: {
          date: new Date(2024, 0, 15).getTime(),
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.days).toBeDefined();
    expect(Array.isArray(wrapper?.data.days)).toBe(true);
  });

  test('should handle onClick with enabled day', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar-month': SmartCalendarMonth,
        },
        template: `<smart-calendar-month id="wrapper" date="{{ date }}" min-date="{{ minDate }}" max-date="{{ maxDate }}" />`,
        data: {
          date: new Date(2024, 0, 15).getTime(),
          minDate: new Date(2024, 0, 1).getTime(),
          maxDate: new Date(2024, 0, 31).getTime(),
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance && wrapper?.data.days && wrapper.data.days.length > 0) {
      // Find a non-disabled day
      const enabledDayIndex = wrapper.data.days.findIndex((day: any) => day.type !== 'disabled');
      if (enabledDayIndex >= 0) {
        const emitSpy = jest.spyOn(instance, '$emit');
        const mockEvent = {
          currentTarget: {
            dataset: {
              index: enabledDayIndex,
            },
          },
        } as any;
        
        instance.onClick(mockEvent);
        
        expect(emitSpy).toHaveBeenCalled();
        expect(global.ty.vibrateShort).toHaveBeenCalledWith({ type: 'light' });
        emitSpy.mockRestore();
      }
    }
  });

  test('should handle onClick with disabled day', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar-month': SmartCalendarMonth,
        },
        template: `<smart-calendar-month id="wrapper" date="{{ date }}" min-date="{{ minDate }}" max-date="{{ maxDate }}" />`,
        data: {
          date: new Date(2024, 0, 15).getTime(),
          minDate: new Date(2024, 0, 20).getTime(),
          maxDate: new Date(2024, 0, 25).getTime(),
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance && wrapper?.data.days && wrapper.data.days.length > 0) {
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

  test('should handle dayClassMap with different formats', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar-month': SmartCalendarMonth,
        },
        template: `<smart-calendar-month id="wrapper" date="{{ date }}" day-class-map="{{ dayClassMap }}" />`,
        data: {
          date: new Date(2024, 0, 15).getTime(),
          dayClassMap: {
            '2024-1-15': 'custom-class-1',
            '2024-01-15': 'custom-class-2',
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.days).toBeDefined();
  });

  test('should handle formatter', async () => {
    const formatter = jest.fn((config) => {
      config.text = `Custom ${config.text}`;
      return config;
    });

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar-month': SmartCalendarMonth,
        },
        template: `<smart-calendar-month id="wrapper" date="{{ date }}" min-date="{{ minDate }}" max-date="{{ maxDate }}" formatter="{{ formatter }}" />`,
        data: {
          date: new Date(2024, 0, 15).getTime(),
          minDate: new Date(2024, 0, 1).getTime(),
          maxDate: new Date(2024, 0, 31).getTime(),
          formatter,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(50);
    
    // Trigger setDays by changing date
    comp.setData({ date: new Date(2024, 0, 16).getTime() });
    await simulate.sleep(50);
    
    expect(formatter).toHaveBeenCalled();
  });

  test('should handle getMultipleDayType with non-array currentDate', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar-month': SmartCalendarMonth,
        },
        template: `<smart-calendar-month id="wrapper" date="{{ date }}" type="multiple" current-date="{{ currentDate }}" />`,
        data: {
          date: new Date(2024, 0, 15).getTime(),
          currentDate: new Date(2024, 0, 15).getTime(),
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance && wrapper?.data.days && wrapper.data.days.length > 0) {
      const day = wrapper.data.days[0].date;
      const result = instance.getMultipleDayType(day);
      expect(result).toBe('');
    }
  });

  test('should handle getMultipleDayType with multiple selected days', async () => {
    const selectedDates = [
      new Date(2024, 0, 15).getTime(),
      new Date(2024, 0, 16).getTime(),
      new Date(2024, 0, 17).getTime(),
    ];

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar-month': SmartCalendarMonth,
        },
        template: `<smart-calendar-month id="wrapper" date="{{ date }}" type="multiple" current-date="{{ currentDate }}" />`,
        data: {
          date: new Date(2024, 0, 15).getTime(),
          currentDate: selectedDates,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const middleDay = new Date(2024, 0, 16);
      const result = instance.getMultipleDayType(middleDay);
      expect(result).toBe('multiple-middle');
    }
  });

  test('should handle getRangeDayType with no startDay', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar-month': SmartCalendarMonth,
        },
        template: `<smart-calendar-month id="wrapper" date="{{ date }}" type="range" current-date="{{ currentDate }}" />`,
        data: {
          date: new Date(2024, 0, 15).getTime(),
          currentDate: [],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance && wrapper?.data.days && wrapper.data.days.length > 0) {
      const day = wrapper.data.days[0].date;
      const result = instance.getRangeDayType(day);
      expect(result).toBe('');
    }
  });

  test('should handle getDayType with week type', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar-month': SmartCalendarMonth,
        },
        template: `<smart-calendar-month id="wrapper" date="{{ date }}" type="week" current-date="{{ currentDate }}" />`,
        data: {
          date: new Date(2024, 0, 15).getTime(),
          currentDate: [new Date(2024, 0, 15).getTime(), new Date(2024, 0, 21).getTime()],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.days).toBeDefined();
  });

  test('should handle getMultipleDayType with start type', async () => {
    const selectedDates = [
      new Date(2024, 0, 15).getTime(),
      new Date(2024, 0, 16).getTime(),
    ];

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar-month': SmartCalendarMonth,
        },
        template: `<smart-calendar-month id="wrapper" date="{{ date }}" type="multiple" current-date="{{ currentDate }}" />`,
        data: {
          date: new Date(2024, 0, 15).getTime(),
          currentDate: selectedDates,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const startDay = new Date(2024, 0, 15);
      const result = instance.getMultipleDayType(startDay);
      expect(result).toBe('start');
    }
  });

  test('should handle getMultipleDayType with end type', async () => {
    const selectedDates = [
      new Date(2024, 0, 15).getTime(),
      new Date(2024, 0, 16).getTime(),
    ];

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar-month': SmartCalendarMonth,
        },
        template: `<smart-calendar-month id="wrapper" date="{{ date }}" type="multiple" current-date="{{ currentDate }}" />`,
        data: {
          date: new Date(2024, 0, 15).getTime(),
          currentDate: selectedDates,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const endDay = new Date(2024, 0, 16);
      const result = instance.getMultipleDayType(endDay);
      expect(result).toBe('end');
    }
  });

  test('should handle getMultipleDayType with multiple-selected type', async () => {
    const selectedDates = [
      new Date(2024, 0, 15).getTime(),
    ];

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar-month': SmartCalendarMonth,
        },
        template: `<smart-calendar-month id="wrapper" date="{{ date }}" type="multiple" current-date="{{ currentDate }}" />`,
        data: {
          date: new Date(2024, 0, 15).getTime(),
          currentDate: selectedDates,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const singleDay = new Date(2024, 0, 15);
      const result = instance.getMultipleDayType(singleDay);
      expect(result).toBe('multiple-selected');
    }
  });

  test('should handle getRangeDayType with start and end', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar-month': SmartCalendarMonth,
        },
        template: `<smart-calendar-month id="wrapper" date="{{ date }}" type="range" current-date="{{ currentDate }}" allow-same-day="{{ allowSameDay }}" />`,
        data: {
          date: new Date(2024, 0, 15).getTime(),
          currentDate: [new Date(2024, 0, 15).getTime(), new Date(2024, 0, 20).getTime()],
          allowSameDay: false,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance && wrapper?.data.days && wrapper.data.days.length > 0) {
      const startDay = new Date(2024, 0, 15);
      const result = instance.getRangeDayType(startDay);
      expect(result).toBe('start');
    }
  });

  test('should handle getRangeDayType with middle', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar-month': SmartCalendarMonth,
        },
        template: `<smart-calendar-month id="wrapper" date="{{ date }}" type="range" current-date="{{ currentDate }}" />`,
        data: {
          date: new Date(2024, 0, 15).getTime(),
          currentDate: [new Date(2024, 0, 15).getTime(), new Date(2024, 0, 20).getTime()],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const middleDay = new Date(2024, 0, 17);
      const result = instance.getRangeDayType(middleDay);
      expect(result).toBe('middle');
    }
  });

  test('should handle getRangeDayType with only startDay', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar-month': SmartCalendarMonth,
        },
        template: `<smart-calendar-month id="wrapper" date="{{ date }}" type="range" current-date="{{ currentDate }}" />`,
        data: {
          date: new Date(2024, 0, 15).getTime(),
          currentDate: [new Date(2024, 0, 15).getTime()],
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const startDay = new Date(2024, 0, 15);
      const result = instance.getRangeDayType(startDay);
      expect(result).toBe('start');
    }
  });

  test('should handle getRangeDayType with allowSameDay', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar-month': SmartCalendarMonth,
        },
        template: `<smart-calendar-month id="wrapper" date="{{ date }}" type="range" current-date="{{ currentDate }}" allow-same-day="{{ allowSameDay }}" />`,
        data: {
          date: new Date(2024, 0, 15).getTime(),
          currentDate: [new Date(2024, 0, 15).getTime(), new Date(2024, 0, 15).getTime()],
          allowSameDay: true,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const sameDay = new Date(2024, 0, 15);
      const result = instance.getRangeDayType(sameDay);
      expect(result).toBe('start-end');
    }
  });


  test('should handle getBottomInfo with range type', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar-month': SmartCalendarMonth,
        },
        template: `<smart-calendar-month id="wrapper" date="{{ date }}" type="range" current-date="{{ currentDate }}" range-start="{{ rangeStart }}" range-end="{{ rangeEnd }}" />`,
        data: {
          date: new Date(2024, 0, 15).getTime(),
          currentDate: [new Date(2024, 0, 15).getTime(), new Date(2024, 0, 20).getTime()],
          rangeStart: '开始',
          rangeEnd: '结束',
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const startInfo = instance.getBottomInfo('start');
      expect(startInfo).toBe('开始');
      const endInfo = instance.getBottomInfo('end');
      expect(endInfo).toBe('结束');
      const startEndInfo = instance.getBottomInfo('start-end');
      expect(startEndInfo).toBe('开始/结束');
    }
  });
});


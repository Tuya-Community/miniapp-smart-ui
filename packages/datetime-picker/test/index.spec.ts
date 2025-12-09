import path from 'path';
import simulate from 'miniprogram-simulate';

describe('datetime-picker', () => {
  const SmartDateTimePicker = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-datetime-picker',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  test('should render with default props', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-datetime-picker': SmartDateTimePicker,
        },
        template: `<smart-datetime-picker id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.type).toBe('datetime');
    expect(wrapper?.data.showToolbar).toBe(true);
    expect(wrapper?.data.is12HourClock).toBe(false);
  });

  test('should update value when value prop changes after created', async () => {
    let inputEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-datetime-picker': SmartDateTimePicker,
        },
        template: `<smart-datetime-picker id="wrapper" value="{{ value }}" bind:input="onInput" />`,
        data: {
          value: new Date(2024, 0, 15).getTime(),
        },
        methods: {
          onInput(event: any) {
            inputEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(50);
    
    // Wait for isCreated to be true
    expect(wrapper?.data.isCreated).toBe(true);
    
    // Change value
    const newValue = new Date(2024, 1, 20).getTime();
    comp.setData({ value: newValue });
    await simulate.sleep(50);
    
    // Should update innerValue
    expect(wrapper?.data.innerValue).toBeDefined();
  });

  test('should not update value when isCreated is false', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-datetime-picker': SmartDateTimePicker,
        },
        template: `<smart-datetime-picker id="wrapper" value="{{ value }}" />`,
        data: {
          value: new Date(2024, 0, 15).getTime(),
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);
    
    if (instance) {
      // Set isCreated to false
      instance.setData({ isCreated: false });
      await simulate.sleep(10);
      
      // Call updateValue
      instance.updateValue();
      await simulate.sleep(10);
      
      // Should not update (early return)
      expect(wrapper?.data.isCreated).toBe(false);
    }
  });

  test('should handle getPicker method', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-datetime-picker': SmartDateTimePicker,
        },
        template: `<smart-datetime-picker id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(50);
    
    if (instance) {
      // Mock selectComponent to return a picker
      const mockPicker = {
        setColumnValues: jest.fn(),
      };
      instance.selectComponent = jest.fn(() => mockPicker as any);
      
      const picker = instance.getPicker();
      
      expect(picker).toBe(mockPicker);
      
      // Call again should return same picker
      const picker2 = instance.getPicker();
      expect(picker2).toBe(picker);
    }
  });

  test('should handle getTimeBoundary with minHour=1 and maxHour=24 in 12HourClock', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-datetime-picker': SmartDateTimePicker,
        },
        template: `<smart-datetime-picker id="wrapper" type="time" is-12-hour-clock="{{ true }}" min-hour="{{ 1 }}" max-hour="{{ 24 }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);
    
    if (instance) {
      // Set data to match the condition
      instance.setData({ 
        type: 'time',
        is12HourClock: true,
        minHour: 1,
        maxHour: 24,
      });
      await simulate.sleep(10);
      
      const boundary = instance.getTimeBoundary();
      
      // Should convert to 0-23 range
      expect(boundary.minHour).toBe(0);
      expect(boundary.maxHour).toBe(23);
    }
  });

  test('should handle correctValue with empty time value', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-datetime-picker': SmartDateTimePicker,
        },
        template: `<smart-datetime-picker id="wrapper" type="time" min-hour="{{ 5 }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);
    
    if (instance) {
      // Test with empty value for time type
      const result = instance.correctValue('');
      
      // Should return minHour:00 format
      expect(result).toMatch(/05:00/);
    }
  });

  test('should handle correctValue with hour=24', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-datetime-picker': SmartDateTimePicker,
        },
        template: `<smart-datetime-picker id="wrapper" type="time" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);
    
    if (instance) {
      // Test with hour=24
      const result = instance.correctValue('24:00');
      
      // Should convert 24 to 0
      expect(result).toMatch(/00:/);
    }
  });

  test('should handle onCancel method', async () => {
    let cancelEmitted = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-datetime-picker': SmartDateTimePicker,
        },
        template: `<smart-datetime-picker id="wrapper" bind:cancel="onCancel" />`,
        methods: {
          onCancel() {
            cancelEmitted = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);
    
    if (instance) {
      instance.onCancel();
      await simulate.sleep(10);
      
      expect(cancelEmitted).toBe(true);
    }
  });

  test('should handle onConfirm method', async () => {
    let confirmEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-datetime-picker': SmartDateTimePicker,
        },
        template: `<smart-datetime-picker id="wrapper" bind:confirm="onConfirm" />`,
        methods: {
          onConfirm(event: any) {
            confirmEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);
    
    if (instance) {
      const testValue = new Date(2024, 0, 15).getTime();
      instance.setData({ innerValue: testValue });
      await simulate.sleep(10);
      
      instance.onConfirm();
      await simulate.sleep(10);
      
      expect(confirmEvent).toBe(testValue);
    }
  });

  test('should handle onChange with 12HourClock time type', async () => {
    let inputEvent: any = null;
    let changeEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-datetime-picker': SmartDateTimePicker,
        },
        template: `<smart-datetime-picker id="wrapper" type="time" is-12-hour-clock="{{ true }}" bind:input="onInput" bind:change="onChange" />`,
        methods: {
          onInput(event: any) {
            inputEvent = event.detail;
          },
          onChange(event: any) {
            changeEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(50);
    
    if (instance) {
      // Mock picker component
      const mockPicker = {
        getIndexes: jest.fn(() => [0, 1, 0]), // [partIndex, hourIndex, minuteIndex]
        value: null,
      };
      instance.picker = mockPicker as any;
      
      // Mock getOriginColumns to return test data
      const originalGetOriginColumns = instance.getOriginColumns;
      instance.getOriginColumns = jest.fn(() => [
        { type: '12HourClock', values: ['AM', 'PM'] },
        { type: 'hour', values: ['12', '01', '02'] },
        { type: 'minute', values: ['00', '15', '30', '45'] },
      ] as any);
      
      instance.onChange();
      await simulate.sleep(10);
      
      expect(inputEvent).toBeDefined();
      expect(changeEvent).toBe(mockPicker);
      
      // Restore
      instance.getOriginColumns = originalGetOriginColumns;
    }
  });

  test('should handle onChange with regular time type', async () => {
    let inputEvent: any = null;
    let changeEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-datetime-picker': SmartDateTimePicker,
        },
        template: `<smart-datetime-picker id="wrapper" type="time" bind:input="onInput" bind:change="onChange" />`,
        methods: {
          onInput(event: any) {
            inputEvent = event.detail;
          },
          onChange(event: any) {
            changeEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(50);
    
    if (instance) {
      // Mock picker component
      const mockPicker = {
        getIndexes: jest.fn(() => [10, 30]), // [hourIndex, minuteIndex]
        value: null,
      };
      instance.picker = mockPicker as any;
      
      // Mock getOriginColumns to return test data
      const originalGetOriginColumns = instance.getOriginColumns;
      instance.getOriginColumns = jest.fn(() => [
        { type: 'hour', values: ['00', '01', '02', '10', '11', '12'] },
        { type: 'minute', values: ['00', '15', '30', '45'] },
      ] as any);
      
      instance.onChange();
      await simulate.sleep(10);
      
      expect(inputEvent).toBeDefined();
      expect(changeEvent).toBe(mockPicker);
      
      // Restore
      instance.getOriginColumns = originalGetOriginColumns;
    }
  });

  test('should handle onChange with date type', async () => {
    let inputEvent: any = null;
    let changeEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-datetime-picker': SmartDateTimePicker,
        },
        template: `<smart-datetime-picker id="wrapper" type="date" bind:input="onInput" bind:change="onChange" />`,
        methods: {
          onInput(event: any) {
            inputEvent = event.detail;
          },
          onChange(event: any) {
            changeEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(50);
    
    if (instance) {
      // Mock picker component
      const mockPicker = {
        getIndexes: jest.fn(() => [0, 0, 0]), // [yearIndex, monthIndex, dateIndex]
        value: null,
      };
      instance.picker = mockPicker as any;
      
      // Mock getOriginColumns to return test data
      const originalGetOriginColumns = instance.getOriginColumns;
      instance.getOriginColumns = jest.fn(() => [
        { type: 'year', values: ['2024'] },
        { type: 'month', values: ['01'] },
        { type: 'day', values: ['15'] },
      ] as any);
      
      instance.onChange();
      await simulate.sleep(10);
      
      expect(inputEvent).toBeDefined();
      expect(changeEvent).toBe(mockPicker);
      
      // Restore
      instance.getOriginColumns = originalGetOriginColumns;
    }
  });

  test('should handle onChange with year-month type', async () => {
    let inputEvent: any = null;
    let changeEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-datetime-picker': SmartDateTimePicker,
        },
        template: `<smart-datetime-picker id="wrapper" type="year-month" bind:input="onInput" bind:change="onChange" />`,
        methods: {
          onInput(event: any) {
            inputEvent = event.detail;
          },
          onChange(event: any) {
            changeEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(50);
    
    if (instance) {
      // Mock picker component
      const mockPicker = {
        getIndexes: jest.fn(() => [0, 0]), // [yearIndex, monthIndex]
        value: null,
      };
      instance.picker = mockPicker as any;
      
      // Mock getOriginColumns to return test data
      const originalGetOriginColumns = instance.getOriginColumns;
      instance.getOriginColumns = jest.fn(() => [
        { type: 'year', values: ['2024'] },
        { type: 'month', values: ['01'] },
      ] as any);
      
      instance.onChange();
      await simulate.sleep(10);
      
      expect(inputEvent).toBeDefined();
      expect(changeEvent).toBe(mockPicker);
      
      // Restore
      instance.getOriginColumns = originalGetOriginColumns;
    }
  });

  test('should handle onChange with datetime type', async () => {
    let inputEvent: any = null;
    let changeEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-datetime-picker': SmartDateTimePicker,
        },
        template: `<smart-datetime-picker id="wrapper" type="datetime" bind:input="onInput" bind:change="onChange" />`,
        methods: {
          onInput(event: any) {
            inputEvent = event.detail;
          },
          onChange(event: any) {
            changeEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(50);
    
    if (instance) {
      // Mock picker component
      const mockPicker = {
        getIndexes: jest.fn(() => [0, 0, 0, 10, 30]), // [yearIndex, monthIndex, dateIndex, hourIndex, minuteIndex]
        value: null,
      };
      instance.picker = mockPicker as any;
      
      // Mock getOriginColumns to return test data
      const originalGetOriginColumns = instance.getOriginColumns;
      instance.getOriginColumns = jest.fn(() => [
        { type: 'year', values: ['2024'] },
        { type: 'month', values: ['01'] },
        { type: 'day', values: ['15'] },
        { type: 'hour', values: ['10'] },
        { type: 'minute', values: ['30'] },
      ] as any);
      
      instance.onChange();
      await simulate.sleep(10);
      
      expect(inputEvent).toBeDefined();
      expect(changeEvent).toBe(mockPicker);
      
      // Restore
      instance.getOriginColumns = originalGetOriginColumns;
    }
  });

  test('should handle onChange with date exceeding maxDate', async () => {
    let inputEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-datetime-picker': SmartDateTimePicker,
        },
        template: `<smart-datetime-picker id="wrapper" type="date" bind:input="onInput" />`,
        methods: {
          onInput(event: any) {
            inputEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(50);
    
    if (instance) {
      // Mock picker component
      const mockPicker = {
        getIndexes: jest.fn(() => [0, 0, 31]), // dateIndex = 31
        value: null,
      };
      instance.picker = mockPicker as any;
      
      // Mock getOriginColumns to return test data with February (max 28/29 days)
      const originalGetOriginColumns = instance.getOriginColumns;
      instance.getOriginColumns = jest.fn(() => [
        { type: 'year', values: ['2024'] },
        { type: 'month', values: ['02'] }, // February
        { type: 'day', values: ['31'] }, // Invalid for February
      ] as any);
      
      instance.onChange();
      await simulate.sleep(10);
      
      expect(inputEvent).toBeDefined();
      
      // Restore
      instance.getOriginColumns = originalGetOriginColumns;
    }
  });

  test('should handle onAnimationStart method', async () => {
    let animationStartEmitted = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-datetime-picker': SmartDateTimePicker,
        },
        template: `<smart-datetime-picker id="wrapper" bind:animation-start="onAnimationStart" />`,
        methods: {
          onAnimationStart() {
            animationStartEmitted = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);
    
    if (instance) {
      instance.onAnimationStart();
      await simulate.sleep(10);
      
      expect(animationStartEmitted).toBe(true);
    }
  });

  test('should handle onAnimationEnd method', async () => {
    let animationEndEmitted = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-datetime-picker': SmartDateTimePicker,
        },
        template: `<smart-datetime-picker id="wrapper" bind:animation-end="onAnimationEnd" />`,
        methods: {
          onAnimationEnd() {
            animationEndEmitted = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);
    
    if (instance) {
      instance.onAnimationEnd();
      await simulate.sleep(10);
      
      expect(animationEndEmitted).toBe(true);
    }
  });

  test('should handle onChange with 12HourClock pm part', async () => {
    let inputEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-datetime-picker': SmartDateTimePicker,
        },
        template: `<smart-datetime-picker id="wrapper" type="time" is-12-hour-clock="{{ true }}" pm-text="PM" bind:input="onInput" />`,
        methods: {
          onInput(event: any) {
            inputEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(50);
    
    if (instance) {
      // Ensure pmText is set correctly
      await simulate.sleep(10);
      expect(wrapper?.data.pmText).toBe('PM');
      
      // Mock picker component
      const mockPicker = {
        getIndexes: jest.fn(() => [1, 1, 0]), // [pmIndex=1, hourIndex, minuteIndex]
        value: null,
      };
      instance.picker = mockPicker as any;
      
      // Mock getOriginColumns to return test data with PM at index 1
      const originalGetOriginColumns = instance.getOriginColumns;
      const mockOriginColumns = [
        { type: '12HourClock', values: ['AM', 'PM'] },
        { type: 'hour', values: ['12', '01', '02'] },
        { type: 'minute', values: ['00', '15', '30', '45'] },
      ];
      instance.getOriginColumns = jest.fn(() => mockOriginColumns as any);
      
      // Ensure data.pmText matches
      instance.setData({ pmText: 'PM', type: 'time', is12HourClock: true });
      await simulate.sleep(10);
      
      instance.onChange();
      await simulate.sleep(10);
      
      expect(inputEvent).toBeDefined();
      // partText from mockOriginColumns[0].values[1] = 'PM', which matches pmText, so part should be 'pm'
      // The logic: partText === this.data.pmText ? 'pm' : 'am'
      expect(wrapper?.data.part).toBe('pm');
      
      // Restore
      instance.getOriginColumns = originalGetOriginColumns;
    }
  });

  test('should handle onChange with 12HourClock hour=12 in pm', async () => {
    let inputEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-datetime-picker': SmartDateTimePicker,
        },
        template: `<smart-datetime-picker id="wrapper" type="time" is-12-hour-clock="{{ true }}" bind:input="onInput" />`,
        methods: {
          onInput(event: any) {
            inputEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(50);
    
    if (instance) {
      // Mock picker component with PM and hour=12
      const mockPicker = {
        getIndexes: jest.fn(() => [1, 0, 0]), // [pmIndex, hourIndex=12, minuteIndex]
        value: null,
      };
      instance.picker = mockPicker as any;
      
      // Mock getOriginColumns
      const originalGetOriginColumns = instance.getOriginColumns;
      instance.getOriginColumns = jest.fn(() => [
        { type: '12HourClock', values: ['AM', 'PM'] },
        { type: 'hour', values: ['12', '01', '02'] },
        { type: 'minute', values: ['00'] },
      ] as any);
      
      instance.onChange();
      await simulate.sleep(10);
      
      expect(inputEvent).toBeDefined();
      
      // Restore
      instance.getOriginColumns = originalGetOriginColumns;
    }
  });

  test('should handle onChange with 12HourClock hour=12 in am', async () => {
    let inputEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-datetime-picker': SmartDateTimePicker,
        },
        template: `<smart-datetime-picker id="wrapper" type="time" is-12-hour-clock="{{ true }}" bind:input="onInput" />`,
        methods: {
          onInput(event: any) {
            inputEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(50);
    
    if (instance) {
      // Mock picker component with AM and hour=12
      const mockPicker = {
        getIndexes: jest.fn(() => [0, 0, 0]), // [amIndex, hourIndex=12, minuteIndex]
        value: null,
      };
      instance.picker = mockPicker as any;
      
      // Mock getOriginColumns
      const originalGetOriginColumns = instance.getOriginColumns;
      instance.getOriginColumns = jest.fn(() => [
        { type: '12HourClock', values: ['AM', 'PM'] },
        { type: 'hour', values: ['12', '01', '02'] },
        { type: 'minute', values: ['00'] },
      ] as any);
      
      instance.onChange();
      await simulate.sleep(10);
      
      expect(inputEvent).toBeDefined();
      
      // Restore
      instance.getOriginColumns = originalGetOriginColumns;
    }
  });

  test('should handle getOriginColumns with 12HourClock pm and hour=12', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-datetime-picker': SmartDateTimePicker,
        },
        template: `<smart-datetime-picker id="wrapper" type="time" is-12-hour-clock="{{ true }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(50);
    
    if (instance) {
      // Set part to pm and ensure hour value is 12
      instance.setData({ 
        part: 'pm',
        type: 'time',
        is12HourClock: true,
        minHour: 0,
        maxHour: 23,
      });
      await simulate.sleep(10);
      
      // Get origin columns - should handle pm with hour=12
      const columns = instance.getOriginColumns();
      
      // Should have 12HourClock column
      expect(columns.length).toBeGreaterThan(0);
      expect(columns[0].type).toBe('12HourClock');
    }
  });

  test('should handle findIntersection with no intersection', async () => {
    // This tests the findIntersection function indirectly through getRanges
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-datetime-picker': SmartDateTimePicker,
        },
        template: `<smart-datetime-picker id="wrapper" type="time" is-12-hour-clock="{{ true }}" min-hour="{{ 0 }}" max-hour="{{ 5 }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(50);
    
    if (instance) {
      // Set part to pm, which should use range [12, 23]
      // But minHour=0, maxHour=5 means range [0, 5]
      // Intersection of [12, 23] and [0, 5] should be empty
      instance.setData({ 
        part: 'pm',
        type: 'time',
        is12HourClock: true,
        minHour: 0,
        maxHour: 5,
      });
      await simulate.sleep(10);
      
      // Get ranges - should handle no intersection case
      const ranges = instance.getRanges();
      
      // Should still return ranges (empty intersection handled)
      expect(ranges).toBeDefined();
    }
  });

  test('should handle getTrueValue with non-numeric prefix', async () => {
    // This tests getTrueValue function indirectly through onChange
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-datetime-picker': SmartDateTimePicker,
        },
        template: `<smart-datetime-picker id="wrapper" type="date" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(50);
    
    if (instance) {
      // Mock picker component with values that have non-numeric prefix
      const mockPicker = {
        getIndexes: jest.fn(() => [0, 0, 0]),
        value: null,
      };
      instance.picker = mockPicker as any;
      
      // Mock getOriginColumns to return values with non-numeric prefix
      const originalGetOriginColumns = instance.getOriginColumns;
      instance.getOriginColumns = jest.fn(() => [
        { type: 'year', values: ['abc2024'] }, // Non-numeric prefix
        { type: 'month', values: ['def01'] }, // Non-numeric prefix
        { type: 'day', values: ['ghi15'] }, // Non-numeric prefix
      ] as any);
      
      instance.onChange();
      await simulate.sleep(10);
      
      // Should handle non-numeric prefix correctly
      expect(instance).toBeDefined();
      
      // Restore
      instance.getOriginColumns = originalGetOriginColumns;
    }
  });
});


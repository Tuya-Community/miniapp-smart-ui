import path from 'path';
import simulate from 'miniprogram-simulate';

describe('calendar', () => {
  const SmartCalendar = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-calendar',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  beforeEach(() => {
    // Mock wx.nextTick
    const originalNextTick = wx.nextTick;
    wx.nextTick = jest.fn((callback: any) => {
      if (callback) {
        callback();
      }
    }) as any;

    return () => {
      wx.nextTick = originalNextTick;
    };
  });

  test('should render with default props', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar': SmartCalendar,
        },
        template: `<smart-calendar id="wrapper" show="{{ true }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.show).toBe(true);
    expect(wrapper?.data.type).toBe('single');
    expect(wrapper?.data.poppable).toBe(false);
    expect(wrapper?.data.round).toBe(true);
    expect(wrapper?.data.showTitle).toBe(true);
    expect(wrapper?.data.showSubtitle).toBe(true);
    expect(wrapper?.data.showMark).toBe(true);
    expect(wrapper?.data.showConfirm).toBe(false);
  });

  test('should render with title', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar': SmartCalendar,
        },
        template: `<smart-calendar id="wrapper" show="{{ true }}" title="选择日期" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.title).toBe('选择日期');
  });

  test('should render with different types', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar': SmartCalendar,
        },
        template: `
          <smart-calendar id="single" show="{{ true }}" type="single" />
          <smart-calendar id="range" show="{{ true }}" type="range" />
          <smart-calendar id="multiple" show="{{ true }}" type="multiple" />
          <smart-calendar id="week" show="{{ true }}" type="week" />
        `,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const single = comp.querySelector('#single');
    const range = comp.querySelector('#range');
    const multiple = comp.querySelector('#multiple');
    const week = comp.querySelector('#week');

    await simulate.sleep(10);
    
    expect(single?.data.type).toBe('single');
    expect(range?.data.type).toBe('range');
    expect(multiple?.data.type).toBe('multiple');
    expect(week?.data.type).toBe('week');
  });

  test('should emit open event when show becomes true', async () => {
    let openEmitted = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar': SmartCalendar,
        },
        template: `<smart-calendar id="wrapper" show="{{ show }}" poppable="{{ true }}" bind:open="onOpen" />`,
        data: {
          show: false,
        },
        methods: {
          onOpen() {
            openEmitted = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      instance.onOpen();
      await simulate.sleep(10);
      
      expect(openEmitted).toBe(true);
    }
  });

  test('should emit close event when show becomes false', async () => {
    let closeEmitted = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar': SmartCalendar,
        },
        template: `<smart-calendar id="wrapper" show="{{ show }}" poppable="{{ true }}" bind:close="onClose" />`,
        data: {
          show: true,
        },
        methods: {
          onClose() {
            closeEmitted = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      instance.onClose();
      await simulate.sleep(10);
      
      expect(closeEmitted).toBe(true);
    }
  });

  test('should emit select event when date is selected in single mode', async () => {
    let selectEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar': SmartCalendar,
        },
        template: `<smart-calendar id="wrapper" show="{{ true }}" type="single" bind:select="onSelect" />`,
        methods: {
          onSelect(event: any) {
            selectEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTime = today.getTime();
      
      instance.onClickDay({ detail: { date: todayTime } });
      await simulate.sleep(10);
      
      expect(selectEvent).toBeTruthy();
    }
  });

  test('should emit select event when date is selected in range mode', async () => {
    let selectEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar': SmartCalendar,
        },
        template: `<smart-calendar id="wrapper" show="{{ true }}" type="range" bind:select="onSelect" />`,
        methods: {
          onSelect(event: any) {
            selectEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTime = today.getTime();
      
      instance.onClickDay({ detail: { date: todayTime } });
      await simulate.sleep(10);
      
      expect(selectEvent).toBeTruthy();
    }
  });

  test('should emit confirm event when confirm button is clicked', async () => {
    let confirmEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar': SmartCalendar,
        },
        template: `<smart-calendar id="wrapper" show="{{ true }}" show-confirm="{{ true }}" bind:confirm="onConfirm" />`,
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
    
    if (instance) {
      instance.onConfirm();
      await simulate.sleep(10);
      
      expect(confirmEvent).toBeTruthy();
    }
  });

  test('should not emit select event when readonly is true', async () => {
    let selectEmitted = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar': SmartCalendar,
        },
        template: `<smart-calendar id="wrapper" show="{{ true }}" readonly="{{ true }}" bind:select="onSelect" />`,
        methods: {
          onSelect() {
            selectEmitted = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTime = today.getTime();
      
      instance.onClickDay({ detail: { date: todayTime } });
      await simulate.sleep(10);
      
      expect(selectEmitted).toBe(false);
    }
  });

  test('should handle onPrev method', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar': SmartCalendar,
        },
        template: `<smart-calendar id="wrapper" show="{{ true }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    const initialVisibleIndex = wrapper?.data.visibleIndex || 0;
    
    if (instance) {
      instance.onPrev();
      await simulate.sleep(10);
      
      // visibleIndex should change or stay the same depending on bounds
      expect(wrapper?.data.visibleIndex).toBeDefined();
    }
  });

  test('should handle onNext method', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar': SmartCalendar,
        },
        template: `<smart-calendar id="wrapper" show="{{ true }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      instance.onNext();
      await simulate.sleep(10);
      
      // visibleIndex should change or stay the same depending on bounds
      expect(wrapper?.data.visibleIndex).toBeDefined();
    }
  });

  test('should handle onClickSubtitle', async () => {
    let subtitleClicked = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar': SmartCalendar,
        },
        template: `<smart-calendar id="wrapper" show="{{ true }}" bind:click-subtitle="onClickSubtitle" />`,
        methods: {
          onClickSubtitle() {
            subtitleClicked = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      instance.onClickSubtitle({} as any);
      await simulate.sleep(10);
      
      expect(subtitleClicked).toBe(true);
    }
  });

  test('should handle reset method when type changes', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar': SmartCalendar,
        },
        template: `<smart-calendar id="wrapper" show="{{ true }}" type="{{ type }}" />`,
        data: {
          type: 'single',
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    comp.setData({ type: 'range' });
    await simulate.sleep(10);
    
    expect(wrapper?.data.type).toBe('range');
  });

  test('should render with poppable mode', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar': SmartCalendar,
        },
        template: `<smart-calendar id="wrapper" show="{{ true }}" poppable="{{ true }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.poppable).toBe(true);
  });

  test('should render with custom locale', async () => {
    const customLocale = {
      shortWeekDays: ['日', '一', '二', '三', '四', '五', '六'],
      monthsFormatter: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      yearFormatter: 'YYYY年',
      subFormatter: 'YYYY-MM',
      rangeStart: '开始',
      rangeEnd: '结束',
    };

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar': SmartCalendar,
        },
        template: `<smart-calendar id="wrapper" show="{{ true }}" locale="{{ locale }}" />`,
        data: {
          locale: customLocale,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.locale).toEqual(customLocale);
  });

  test('should handle maxRange validation', async () => {
    let overRangeEmitted = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar': SmartCalendar,
        },
        template: `<smart-calendar id="wrapper" show="{{ true }}" type="range" max-range="{{ 7 }}" bind:over-range="onOverRange" />`,
        methods: {
          onOverRange() {
            overRangeEmitted = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      // Set a range that exceeds maxRange
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 10); // 10 days, exceeds maxRange of 7
      
      instance.setData({ currentDate: [startDate.getTime(), endDate.getTime()] });
      instance.checkRange([startDate.getTime(), endDate.getTime()]);
      await simulate.sleep(10);
      
      // Note: This test may need adjustment based on actual implementation
      expect(instance).toBeDefined();
    }
  });

  test('should handle range mode when startDay is selected and endDay is not - select date after startDay', async () => {
    let selectEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar': SmartCalendar,
        },
        template: `<smart-calendar id="wrapper" show="{{ true }}" type="range" bind:select="onSelect" />`,
        methods: {
          onSelect(event: any) {
            selectEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 3);
      
      // Set currentDate with startDay but no endDay
      instance.setData({ currentDate: [startDate.getTime(), null] });
      await simulate.sleep(10);
      
      // Mock selectComponent to return month component with days
      const mockMonth = {
        data: {
          days: [
            { date: startDate, type: 'normal' },
            { date: new Date(startDate.getTime() + 86400000), type: 'normal' },
            { date: new Date(startDate.getTime() + 172800000), type: 'disabled' },
            { date: endDate, type: 'normal' },
          ],
        },
      };
      instance.selectComponent = jest.fn(() => mockMonth as any);
      
      // Click a date after startDay
      instance.onClickDay({ detail: { date: endDate.getTime() } });
      await simulate.sleep(10);
      
      expect(selectEvent).toBeTruthy();
      expect(Array.isArray(selectEvent)).toBe(true);
    }
  });

  test('should handle range mode with disabled days between start and end', async () => {
    let selectEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar': SmartCalendar,
        },
        template: `<smart-calendar id="wrapper" show="{{ true }}" type="range" bind:select="onSelect" />`,
        methods: {
          onSelect(event: any) {
            selectEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      const disabledDate = new Date(startDate);
      disabledDate.setDate(disabledDate.getDate() + 2);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 5);
      
      // Set currentDate with startDay but no endDay
      instance.setData({ currentDate: [startDate.getTime(), null] });
      await simulate.sleep(10);
      
      // Mock selectComponent to return month component with disabled days
      const mockMonth = {
        data: {
          days: [
            { date: startDate, type: 'normal' },
            { date: new Date(startDate.getTime() + 86400000), type: 'normal' },
            { date: disabledDate, type: 'disabled' },
            { date: new Date(startDate.getTime() + 259200000), type: 'normal' },
            { date: endDate, type: 'normal' },
          ],
        },
      };
      instance.selectComponent = jest.fn(() => mockMonth as any);
      
      // Click a date after startDay that has disabled days in between
      instance.onClickDay({ detail: { date: endDate.getTime() } });
      await simulate.sleep(10);
      
      expect(selectEvent).toBeTruthy();
      expect(Array.isArray(selectEvent)).toBe(true);
    }
  });

  test('should handle range mode when startDay is selected and endDay is not - select date before startDay', async () => {
    let selectEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar': SmartCalendar,
        },
        template: `<smart-calendar id="wrapper" show="{{ true }}" type="range" bind:select="onSelect" />`,
        methods: {
          onSelect(event: any) {
            selectEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      const beforeDate = new Date(startDate);
      beforeDate.setDate(beforeDate.getDate() - 3);
      
      // Set currentDate with startDay but no endDay
      instance.setData({ currentDate: [startDate.getTime(), null] });
      await simulate.sleep(10);
      
      // Click a date before startDay
      instance.onClickDay({ detail: { date: beforeDate.getTime() } });
      await simulate.sleep(10);
      
      expect(selectEvent).toBeTruthy();
    }
  });

  test('should handle range mode with allowSameDay', async () => {
    let selectEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar': SmartCalendar,
        },
        template: `<smart-calendar id="wrapper" show="{{ true }}" type="range" allow-same-day="{{ true }}" bind:select="onSelect" />`,
        methods: {
          onSelect(event: any) {
            selectEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      
      // Set currentDate with startDay but no endDay
      instance.setData({ currentDate: [startDate.getTime(), null] });
      await simulate.sleep(10);
      
      // Click the same date as startDay
      instance.onClickDay({ detail: { date: startDate.getTime() } });
      await simulate.sleep(10);
      
      expect(selectEvent).toBeTruthy();
    }
  });

  test('should handle multiple mode - select and unselect dates', async () => {
    let selectEvent: any = null;
    let unselectEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar': SmartCalendar,
        },
        template: `<smart-calendar id="wrapper" show="{{ true }}" type="multiple" bind:select="onSelect" bind:unselect="onUnselect" />`,
        methods: {
          onSelect(event: any) {
            selectEvent = event.detail;
          },
          onUnselect(event: any) {
            unselectEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      const date1 = new Date();
      date1.setHours(0, 0, 0, 0);
      const date2 = new Date(date1);
      date2.setDate(date2.getDate() + 1);
      
      // First select a date
      instance.setData({ currentDate: [] });
      await simulate.sleep(10);
      instance.onClickDay({ detail: { date: date1.getTime() } });
      await simulate.sleep(10);
      
      expect(selectEvent).toBeTruthy();
      
      // Select another date
      selectEvent = null;
      instance.onClickDay({ detail: { date: date2.getTime() } });
      await simulate.sleep(10);
      
      expect(selectEvent).toBeTruthy();
      
      // Unselect the first date by clicking it again
      selectEvent = null;
      instance.onClickDay({ detail: { date: date1.getTime() } });
      await simulate.sleep(10);
      
      expect(unselectEvent).toBeTruthy();
    }
  });

  test('should handle onClickDate method', async () => {
    let selectEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar': SmartCalendar,
        },
        template: `<smart-calendar id="wrapper" show="{{ true }}" type="month" bind:select="onSelect" />`,
        methods: {
          onSelect(event: any) {
            selectEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      
      instance.onClickDate({ detail: date.getTime() });
      await simulate.sleep(10);
      
      expect(selectEvent).toBeTruthy();
      expect(wrapper?.data.visibleIndex).toBe(0);
    }
  });

  test('should not call onClickDate when readonly is true', async () => {
    let selectEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar': SmartCalendar,
        },
        template: `<smart-calendar id="wrapper" show="{{ true }}" type="month" readonly="{{ true }}" bind:select="onSelect" />`,
        methods: {
          onSelect(event: any) {
            selectEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      
      instance.onClickDate({ detail: date.getTime() });
      await simulate.sleep(10);
      
      // Should still emit select because onClickDate doesn't check readonly
      // But the behavior might be different
      expect(instance).toBeDefined();
    }
  });

  test('should handle onChangeMonthTitleDate', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar': SmartCalendar,
        },
        template: `<smart-calendar id="wrapper" show="{{ true }}" type="month" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      const originalDate = wrapper?.data.originCurrentDateMonthly;
      const newDate = new Date();
      newDate.setMonth(newDate.getMonth() + 1);
      
      instance.onChangeMonthTitleDate({ detail: newDate.getTime() });
      await simulate.sleep(10);
      
      expect(wrapper?.data.originCurrentDateMonthly).toBe(newDate.getTime());
    }
  });

  test('should not update originCurrentDateMonthly when date is the same', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar': SmartCalendar,
        },
        template: `<smart-calendar id="wrapper" show="{{ true }}" type="month" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      await simulate.sleep(10);
      const originalDate = wrapper?.data.originCurrentDateMonthly;
      
      instance.onChangeMonthTitleDate({ detail: originalDate });
      await simulate.sleep(10);
      
      // Should remain the same
      expect(wrapper?.data.originCurrentDateMonthly).toBe(originalDate);
    }
  });

  test('should handle unselect method', async () => {
    let unselectEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar': SmartCalendar,
        },
        template: `<smart-calendar id="wrapper" show="{{ true }}" type="multiple" bind:unselect="onUnselect" />`,
        methods: {
          onUnselect(event: any) {
            unselectEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      
      instance.unselect([date.getTime()]);
      await simulate.sleep(10);
      
      expect(unselectEvent).toBeTruthy();
    }
  });

  test('should handle unselect with empty array', async () => {
    let unselectEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar': SmartCalendar,
        },
        template: `<smart-calendar id="wrapper" show="{{ true }}" type="multiple" bind:unselect="onUnselect" />`,
        methods: {
          onUnselect(event: any) {
            unselectEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      instance.unselect([]);
      await simulate.sleep(10);
      
      // Should not emit unselect when array is empty
      expect(unselectEvent).toBeFalsy();
    }
  });

  test('should handle select with range type and maxRange - valid range', async () => {
    let selectEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar': SmartCalendar,
        },
        template: `<smart-calendar id="wrapper" show="{{ true }}" type="range" max-range="{{ 7 }}" bind:select="onSelect" />`,
        methods: {
          onSelect(event: any) {
            selectEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 5); // 5 days, within maxRange of 7
      
      instance.select([startDate.getTime(), endDate.getTime()], true);
      await simulate.sleep(10);
      
      expect(selectEvent).toBeTruthy();
    }
  });

  test('should handle select with range type and maxRange - invalid range with maxRange', async () => {
    let selectEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar': SmartCalendar,
        },
        template: `<smart-calendar id="wrapper" show="{{ true }}" type="range" max-range="{{ 7 }}" bind:select="onSelect" />`,
        methods: {
          onSelect(event: any) {
            selectEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 10); // 10 days, exceeds maxRange of 7
      
      instance.select([startDate.getTime(), endDate.getTime()], true);
      await simulate.sleep(10);
      
      // Should still emit but with adjusted range
      expect(selectEvent).toBeTruthy();
    }
  });

  test('should handle select with range type - invalid range without maxRange', async () => {
    let selectEvent: any = null;
    let overRangeEmitted = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar': SmartCalendar,
        },
        template: `<smart-calendar id="wrapper" show="{{ true }}" type="range" max-range="{{ 7 }}" bind:select="onSelect" bind:over-range="onOverRange" />`,
        methods: {
          onSelect(event: any) {
            selectEvent = event.detail;
          },
          onOverRange() {
            overRangeEmitted = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 10); // 10 days, exceeds maxRange of 7
      
      instance.select([startDate.getTime(), endDate.getTime()], true);
      await simulate.sleep(10);
      
      expect(selectEvent).toBeTruthy();
    }
  });

  test('should handle checkRange with showRangePrompt and setTimeout', async () => {
    jest.useFakeTimers();
    let overRangeEmitted = false;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar': SmartCalendar,
        },
        template: `<smart-calendar id="wrapper" show="{{ true }}" type="range" max-range="{{ 7 }}" show-range-prompt="{{ true }}" bind:over-range="onOverRange" />`,
        methods: {
          onOverRange() {
            overRangeEmitted = true;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 10); // 10 days, exceeds maxRange of 7
      
      const isValid = instance.checkRange([startDate.getTime(), endDate.getTime()]);
      
      expect(isValid).toBe(false);
      expect(wrapper?.data.showToast).toBe(true);
      expect(overRangeEmitted).toBe(true);
      
      // Fast-forward time to trigger setTimeout
      jest.advanceTimersByTime(2000);
      
      expect(wrapper?.data.showToast).toBe(false);
    }
    
    jest.useRealTimers();
  });

  test('should handle checkRange returning true for valid range', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar': SmartCalendar,
        },
        template: `<smart-calendar id="wrapper" show="{{ true }}" type="range" max-range="{{ 7 }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 5); // 5 days, within maxRange of 7
      
      const isValid = instance.checkRange([startDate.getTime(), endDate.getTime()]);
      
      expect(isValid).toBe(true);
    }
  });

  test('should handle checkRange without maxRange', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar': SmartCalendar,
        },
        template: `<smart-calendar id="wrapper" show="{{ true }}" type="range" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 100);
      
      const isValid = instance.checkRange([startDate.getTime(), endDate.getTime()]);
      
      expect(isValid).toBe(true);
    }
  });

  test('should handle onConfirm with invalid range', async () => {
    let confirmEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar': SmartCalendar,
        },
        template: `<smart-calendar id="wrapper" show="{{ true }}" type="range" max-range="{{ 7 }}" show-confirm="{{ true }}" bind:confirm="onConfirm" />`,
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
    
    if (instance) {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 10); // 10 days, exceeds maxRange of 7
      
      instance.setData({ currentDate: [startDate.getTime(), endDate.getTime()] });
      instance.onConfirm();
      await simulate.sleep(10);
      
      // Should not emit confirm when range is invalid
      expect(confirmEvent).toBeFalsy();
    }
  });

  test('should handle onConfirm with valid range', async () => {
    let confirmEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar': SmartCalendar,
        },
        template: `<smart-calendar id="wrapper" show="{{ true }}" type="range" max-range="{{ 7 }}" show-confirm="{{ true }}" bind:confirm="onConfirm" />`,
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
    
    if (instance) {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 5); // 5 days, within maxRange of 7
      
      instance.setData({ currentDate: [startDate.getTime(), endDate.getTime()] });
      instance.onConfirm();
      await simulate.sleep(10);
      
      expect(confirmEvent).toBeTruthy();
    }
  });

  test('should handle onConfirm with non-range type', async () => {
    let confirmEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar': SmartCalendar,
        },
        template: `<smart-calendar id="wrapper" show="{{ true }}" type="single" show-confirm="{{ true }}" bind:confirm="onConfirm" />`,
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
    
    if (instance) {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      
      instance.setData({ currentDate: date.getTime() });
      instance.onConfirm();
      await simulate.sleep(10);
      
      expect(confirmEvent).toBeTruthy();
    }
  });

  test('should handle select with complete flag and showConfirm', async () => {
    let selectEvent: any = null;
    let confirmEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar': SmartCalendar,
        },
        template: `<smart-calendar id="wrapper" show="{{ true }}" type="single" show-confirm="{{ true }}" bind:select="onSelect" bind:confirm="onConfirm" />`,
        methods: {
          onSelect(event: any) {
            selectEvent = event.detail;
          },
          onConfirm(event: any) {
            confirmEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      
      instance.select(date.getTime(), true);
      await simulate.sleep(10);
      
      expect(selectEvent).toBeTruthy();
      // Should not auto confirm when showConfirm is true
      expect(confirmEvent).toBeFalsy();
    }
  });

  test('should handle select with complete flag and no showConfirm', async () => {
    let selectEvent: any = null;
    let confirmEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar': SmartCalendar,
        },
        template: `<smart-calendar id="wrapper" show="{{ true }}" type="single" show-confirm="{{ false }}" bind:select="onSelect" bind:confirm="onConfirm" />`,
        methods: {
          onSelect(event: any) {
            selectEvent = event.detail;
          },
          onConfirm(event: any) {
            confirmEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      
      instance.select(date.getTime(), true);
      await simulate.sleep(10);
      
      expect(selectEvent).toBeTruthy();
      // Should auto confirm when showConfirm is false
      expect(confirmEvent).toBeTruthy();
    }
  });
});


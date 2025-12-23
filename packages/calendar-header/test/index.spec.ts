import path from 'path';
import simulate from 'miniprogram-simulate';

describe('calendar-header', () => {
  const SmartCalendarHeader = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-calendar-header',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  test('should render with default props', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar-header': SmartCalendarHeader,
        },
        template: `<smart-calendar-header id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    
    expect(wrapper?.data.title).toBe('Select Date');
    expect(wrapper?.data.rightText).toBe('Save');
    expect(wrapper?.data.showConfirm).toBe(true);
  });

  test('should handle onClickSubtitle', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar-header': SmartCalendarHeader,
        },
        template: `<smart-calendar-header id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const emitSpy = jest.spyOn(instance, '$emit');
      const mockEvent = { detail: {} } as any;
      instance.onClickSubtitle(mockEvent);
      
      expect(emitSpy).toHaveBeenCalledWith('click-subtitle', mockEvent);
      emitSpy.mockRestore();
    }
  });

  test('should handle onPrev', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar-header': SmartCalendarHeader,
        },
        template: `<smart-calendar-header id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const emitSpy = jest.spyOn(instance, '$emit');
      instance.onPrev();
      
      expect(emitSpy).toHaveBeenCalledWith('click-prev');
      emitSpy.mockRestore();
    }
  });

  test('should handle onNext', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar-header': SmartCalendarHeader,
        },
        template: `<smart-calendar-header id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const emitSpy = jest.spyOn(instance, '$emit');
      instance.onNext();
      
      expect(emitSpy).toHaveBeenCalledWith('click-next');
      emitSpy.mockRestore();
    }
  });

  test('should handle onSave', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar-header': SmartCalendarHeader,
        },
        template: `<smart-calendar-header id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    await simulate.sleep(10);

    if (instance) {
      const emitSpy = jest.spyOn(instance, '$emit');
      instance.onSave();
      
      expect(emitSpy).toHaveBeenCalledWith('click-save');
      emitSpy.mockRestore();
    }
  });

  test('should handle initWeekDay', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-calendar-header': SmartCalendarHeader,
        },
        template: `<smart-calendar-header id="wrapper" first-day-of-week="{{ 1 }}" default-weeks="{{ ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] }}" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);

    expect(wrapper?.data.weekdays).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  });
});


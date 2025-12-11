import path from 'path';
import simulate from 'miniprogram-simulate';

describe('popover', () => {
  const SmartPopover = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-popover',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  beforeEach(() => {
    jest.useFakeTimers();
    return () => {
      jest.useRealTimers();
    };
  });

  test('should open when show becomes true', () => {
    let showChangeEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-popover': SmartPopover,
        },
        template: `<smart-popover id="wrapper" show="{{ show }}" bind:show-change="onShowChange" />`,
        data: {
          show: false,
        },
        methods: {
          onShowChange(event: any) {
            showChangeEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      comp.setData({ show: true });
      jest.advanceTimersByTime(100);

      expect(wrapper?.data.currentShow).toBe(true);
      expect(showChangeEvent).toBe(true);
    }
  });

  test('should close when show becomes false', () => {
    let showChangeEvent: any = null;
    let closeEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-popover': SmartPopover,
        },
        template: `<smart-popover id="wrapper" show="{{ show }}" bind:show-change="onShowChange" bind:close="onClose" />`,
        data: {
          show: true,
        },
        methods: {
          onShowChange(event: any) {
            showChangeEvent = event.detail;
          },
          onClose(event: any) {
            closeEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      instance.setData({ currentShow: true });
      comp.setData({ show: false });
      jest.advanceTimersByTime(300);

      expect(wrapper?.data.currentShow).toBe(false);
      expect(showChangeEvent).toBe(false);
      expect(closeEvent).toBe(false);
    }
  });

  test('should auto close after duration', () => {
    let closeEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-popover': SmartPopover,
        },
        template: `<smart-popover id="wrapper" show="{{ true }}" duration="{{ 1000 }}" bind:close="onClose" />`,
        data: {
          show: true,
          duration: 1000,
        },
        methods: {
          onClose(event: any) {
            closeEvent = event.detail;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      instance.onOpen();
      jest.advanceTimersByTime(1000);
      jest.advanceTimersByTime(300);

      expect(closeEvent).toBe(false);
    }
  });

  test('should clear timer when show changes', () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-popover': SmartPopover,
        },
        template: `<smart-popover id="wrapper" show="{{ show }}" duration="{{ 1000 }}" />`,
        data: {
          show: true,
          duration: 1000,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      instance.setData({ cancel_timer: setTimeout(() => {}, 1000) });
      comp.setData({ show: false });

      expect(wrapper?.data.cancel_timer).toBeNull();
    }
  });

  test('should call onOpen when clicked', () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-popover': SmartPopover,
        },
        template: `<smart-popover id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      const onOpenSpy = jest.spyOn(instance, 'onOpen');
      instance.onClick();

      expect(onOpenSpy).toHaveBeenCalled();
      onOpenSpy.mockRestore();
    }
  });

  test('should get button position for right placement', () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-popover': SmartPopover,
        },
        template: `<smart-popover id="wrapper" placement="right" />`,
        data: {
          placement: 'right',
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      instance.getButtonPosition();

      expect(wrapper?.data.transform).toBe('translate(0%, -50%)');
      expect(wrapper?.data.iconRotate).toBe('90deg');
    }
  });

  test('should get button position for left placement', () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-popover': SmartPopover,
        },
        template: `<smart-popover id="wrapper" placement="left" />`,
        data: {
          placement: 'left',
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      instance.getButtonPosition();

      expect(wrapper?.data.transform).toBe('translate(-100%, -50%)');
    }
  });

  test('should get button position for top placement', () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-popover': SmartPopover,
        },
        template: `<smart-popover id="wrapper" placement="top" />`,
        data: {
          placement: 'top',
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      instance.getButtonPosition();

      expect(wrapper?.data.transform).toBe('translate(-50%, -100%)');
    }
  });

  test('should get button position for bottom placement', () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-popover': SmartPopover,
        },
        template: `<smart-popover id="wrapper" placement="bottom" />`,
        data: {
          placement: 'bottom',
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      instance.getButtonPosition();

      expect(wrapper?.data.transform).toBe('translate(-50%, 100%)');
    }
  });

  test('should get button position for rightTop placement', () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-popover': SmartPopover,
        },
        template: `<smart-popover id="wrapper" placement="rightTop" />`,
        data: {
          placement: 'rightTop',
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      instance.getButtonPosition();

      expect(wrapper?.data.transform).toBe('translate(0%,0)');
    }
  });

  test('should get button position for rightBottom placement', () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-popover': SmartPopover,
        },
        template: `<smart-popover id="wrapper" placement="rightBottom" />`,
        data: {
          placement: 'rightBottom',
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      instance.getButtonPosition();

      expect(wrapper?.data.transform).toBe('translate(0%,0)');
    }
  });

  test('should get button position for leftTop placement', () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-popover': SmartPopover,
        },
        template: `<smart-popover id="wrapper" placement="leftTop" />`,
        data: {
          placement: 'leftTop',
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      instance.getButtonPosition();

      expect(wrapper?.data.transform).toBe('translate(-100%, 0)');
    }
  });

  test('should get button position for leftBottom placement', () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-popover': SmartPopover,
        },
        template: `<smart-popover id="wrapper" placement="leftBottom" />`,
        data: {
          placement: 'leftBottom',
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      instance.getButtonPosition();

      expect(wrapper?.data.transform).toBe('translate(-100%, -100%)');
    }
  });

  test('should get button position for topLeft placement', () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-popover': SmartPopover,
        },
        template: `<smart-popover id="wrapper" placement="topLeft" />`,
        data: {
          placement: 'topLeft',
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      instance.getButtonPosition();

      expect(wrapper?.data.transform).toBe('translate(calc(0% - 16px), -100%)');
    }
  });

  test('should get button position for topRight placement', () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-popover': SmartPopover,
        },
        template: `<smart-popover id="wrapper" placement="topRight" />`,
        data: {
          placement: 'topRight',
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      instance.getButtonPosition();

      expect(wrapper?.data.transform).toBe('translate(0, -100%)');
    }
  });

  test('should get button position for bottomLeft placement', () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-popover': SmartPopover,
        },
        template: `<smart-popover id="wrapper" placement="bottomLeft" />`,
        data: {
          placement: 'bottomLeft',
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      instance.getButtonPosition();

      expect(wrapper?.data.transform).toBe('translate(calc(0% - 16px), 100%)');
    }
  });

  test('should get button position for bottomRight placement', () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-popover': SmartPopover,
        },
        template: `<smart-popover id="wrapper" placement="bottomRight" />`,
        data: {
          placement: 'bottomRight',
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      instance.getButtonPosition();

      expect(wrapper?.data.transform).toBe('translate(0, 100%)');
    }
  });

  test('should not open when show is already true', () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-popover': SmartPopover,
        },
        template: `<smart-popover id="wrapper" show="{{ true }}" />`,
        data: {
          show: true,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      instance.setData({ currentShow: true });
      const onOpenSpy = jest.spyOn(instance, 'onOpen');
      comp.setData({ show: true });

      expect(onOpenSpy).not.toHaveBeenCalled();
      onOpenSpy.mockRestore();
    }
  });

  test('should not close when show is already false', () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-popover': SmartPopover,
        },
        template: `<smart-popover id="wrapper" show="{{ false }}" />`,
        data: {
          show: false,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      instance.setData({ currentShow: false });
      const onCloseSpy = jest.spyOn(instance, 'onClose');
      comp.setData({ show: false });

      expect(onCloseSpy).not.toHaveBeenCalled();
      onCloseSpy.mockRestore();
    }
  });

  test('should set showStyle after opening', () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-popover': SmartPopover,
        },
        template: `<smart-popover id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      instance.onOpen();
      jest.advanceTimersByTime(100);

      expect(wrapper?.data.showStyle).toBe('opacity: 1;');
    }
  });

  test('should clear timer in onClose', () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-popover': SmartPopover,
        },
        template: `<smart-popover id="wrapper" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;

    if (instance) {
      const timer = setTimeout(() => {}, 1000);
      instance.setData({ cancel_timer: timer });
      instance.onClose();

      expect(wrapper?.data.cancel_timer).toBeNull();
    }
  });
});


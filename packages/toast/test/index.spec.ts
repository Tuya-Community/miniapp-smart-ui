import path from 'path';
import simulate from 'miniprogram-simulate';
import Toast, { contextRef } from '../toast';
import { getCurrentPage } from '../../common/utils';
import appLog from '../../common/appLog';
import ty from '../../common/ty';

// Mock dependencies
jest.mock('../../common/utils');
jest.mock('../../common/appLog');
jest.mock('../../common/ty', () => ({
  __esModule: true,
  default: {
    nativeDisabled: jest.fn(),
  },
}));

describe('toast', () => {
  const SmartToast = simulate.load(
    path.resolve(__dirname, '../index'),
    'smart-toast',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    contextRef.value = {};
    return () => {
      jest.useRealTimers();
    };
  });

  test('should log error when id is repeated in mounted', () => {
    const mockPage = {} as any;
    (getCurrentPage as jest.Mock).mockReturnValue(mockPage);
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const appLogInfoSpy = jest.spyOn(appLog, 'info');

    // First toast component - simulate it already mounted
    contextRef.value['#toast1'] = mockPage;

    // Second toast component with same id
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-toast': SmartToast,
        },
        template: `<smart-toast id="toast1" />`,
      })
    );
    
    const toast1 = comp.querySelector('#toast1');
    if (toast1 && toast1.instance) {
      toast1.instance.id = 'toast1';
    }
    
    // Attach will trigger ready lifecycle, which should detect repeated id
    comp.attach(document.createElement('parent-wrapper'));

    // The error should be logged when the component mounts with a repeated id
    expect(consoleErrorSpy).toHaveBeenCalledWith('Toast component #toast1 repeated!');
    expect(appLogInfoSpy).toHaveBeenCalledWith('Toast component #toast1 repeated!');

    consoleErrorSpy.mockRestore();
  });

  test('should set contextRef when mounted with id', () => {
    const mockPage = {} as any;
    (getCurrentPage as jest.Mock).mockReturnValue(mockPage);
    const appLogInfoSpy = jest.spyOn(appLog, 'info');

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-toast': SmartToast,
        },
        template: `<smart-toast id="toast1" />`,
      })
    );
    
    const toast1 = comp.querySelector('#toast1');
    if (toast1 && toast1.instance) {
      toast1.instance.id = 'toast1';
    }
    
    // Attach will trigger ready lifecycle
    comp.attach(document.createElement('parent-wrapper'));

    expect(contextRef.value['#toast1']).toBe(mockPage);
    expect(appLogInfoSpy).toHaveBeenCalledWith('Toast #toast1 mounted');
  });

  test('should not set contextRef when mounted without id', () => {
    const mockPage = {} as any;
    (getCurrentPage as jest.Mock).mockReturnValue(mockPage);

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-toast': SmartToast,
        },
        template: `<smart-toast />`,
      })
    );
    
    const toast = comp.querySelector('smart-toast');
    if (toast && toast.instance) {
      toast.instance.id = '';
    }
    
    // Attach will trigger ready lifecycle
    comp.attach(document.createElement('parent-wrapper'));

    // Should not set contextRef when id is empty
    expect(contextRef.value).toEqual({});
  });

  test('should call noop method', () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-toast': SmartToast,
        },
        template: `<smart-toast id="toast1" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const toast = comp.querySelector('#toast1');
    if (toast) {
      expect(() => toast.instance.noop()).not.toThrow();
    }
  });

  test('should show toast with message', () => {
    const mockPage = {
      selectComponent: jest.fn(() => ({
        setData: jest.fn(),
        clear: null,
        timer: null,
      })),
    } as any;
    (getCurrentPage as jest.Mock).mockReturnValue(mockPage);

    Toast('test message');

    expect(mockPage.selectComponent).toHaveBeenCalledWith('#smart-toast');
  });

  test('should show toast with options', () => {
    const mockToast = {
      setData: jest.fn(),
      clear: null,
      timer: null,
    };
    const mockPage = {
      selectComponent: jest.fn(() => mockToast),
    } as any;
    (getCurrentPage as jest.Mock).mockReturnValue(mockPage);

    Toast({ message: 'test', type: 'success' });

    expect(mockToast.setData).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'test',
        type: 'success',
      })
    );
  });

  test('should call ty.nativeDisabled(true) when nativeDisabled is true', () => {
    const mockToast = {
      setData: jest.fn(),
      clear: null,
      timer: null,
    };
    const mockPage = {
      selectComponent: jest.fn(() => mockToast),
    } as any;
    (getCurrentPage as jest.Mock).mockReturnValue(mockPage);

    Toast({ message: 'test', nativeDisabled: true });

    expect(ty.nativeDisabled).toHaveBeenCalledWith(true);
  });

  test('should call ty.nativeDisabled(false) when preDisRef exists and nativeDisabled is false', () => {
    const mockToast = {
      setData: jest.fn(),
      clear: null,
      timer: null,
    };
    const mockPage = {
      selectComponent: jest.fn(() => mockToast),
    } as any;
    (getCurrentPage as jest.Mock).mockReturnValue(mockPage);

    // First toast with nativeDisabled: true
    Toast({ message: 'test1', nativeDisabled: true, selector: '#toast1' });
    jest.clearAllMocks();

    // Second toast with nativeDisabled: false
    Toast({ message: 'test2', nativeDisabled: false, selector: '#toast1' });

    expect(ty.nativeDisabled).toHaveBeenCalledWith(false);
  });

  test('should auto clear after duration', () => {
    const mockToast: any = {
      setData: jest.fn(),
      clear: null,
      timer: null,
    };
    const mockPage = {
      selectComponent: jest.fn(() => mockToast),
    } as any;
    (getCurrentPage as jest.Mock).mockReturnValue(mockPage);

    Toast({ message: 'test', duration: 1000 });

    // clear method should be added by Toast function
    expect(mockToast.clear).toBeTruthy();
    expect(typeof mockToast.clear).toBe('function');

    jest.advanceTimersByTime(1000);

    expect(mockToast.setData).toHaveBeenCalledWith({ show: false });
  });

  test('should not auto clear when duration is 0', () => {
    const mockClear = jest.fn();
    const mockToast = {
      setData: jest.fn(),
      clear: mockClear,
      timer: null,
    };
    const mockPage = {
      selectComponent: jest.fn(() => mockToast),
    } as any;
    (getCurrentPage as jest.Mock).mockReturnValue(mockPage);

    Toast({ message: 'test', duration: 0 });

    jest.advanceTimersByTime(1000);

    expect(mockClear).not.toHaveBeenCalled();
  });

  test('should call onClose when clear is called', () => {
    const onClose = jest.fn();
    const mockToast: any = {
      setData: jest.fn(),
      clear: null,
      timer: null,
    };
    const mockPage = {
      selectComponent: jest.fn(() => mockToast),
    } as any;
    (getCurrentPage as jest.Mock).mockReturnValue(mockPage);

    Toast({ message: 'test', onClose, nativeDisabled: true });

    if (mockToast.clear) {
      mockToast.clear();
      expect(mockToast.setData).toHaveBeenCalledWith({ show: false });
      expect(ty.nativeDisabled).toHaveBeenCalledWith(false);
      expect(onClose).toHaveBeenCalled();
    }
  });

  test('should call Toast.loading', () => {
    const mockToast = {
      setData: jest.fn(),
      clear: null,
      timer: null,
    };
    const mockPage = {
      selectComponent: jest.fn(() => mockToast),
    } as any;
    (getCurrentPage as jest.Mock).mockReturnValue(mockPage);

    Toast.loading('loading message');

    expect(mockToast.setData).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'loading',
        message: 'loading message',
      })
    );
  });

  test('should call Toast.success', () => {
    const mockToast = {
      setData: jest.fn(),
      clear: null,
      timer: null,
    };
    const mockPage = {
      selectComponent: jest.fn(() => mockToast),
    } as any;
    (getCurrentPage as jest.Mock).mockReturnValue(mockPage);

    Toast.success('success message');

    expect(mockToast.setData).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'success',
        message: 'success message',
      })
    );
  });

  test('should call Toast.fail', () => {
    const mockToast = {
      setData: jest.fn(),
      clear: null,
      timer: null,
    };
    const mockPage = {
      selectComponent: jest.fn(() => mockToast),
    } as any;
    (getCurrentPage as jest.Mock).mockReturnValue(mockPage);

    Toast.fail('fail message');

    expect(mockToast.setData).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'fail',
        message: 'fail message',
      })
    );
  });

  test('should call Toast.warn', () => {
    const mockToast = {
      setData: jest.fn(),
      clear: null,
      timer: null,
    };
    const mockPage = {
      selectComponent: jest.fn(() => mockToast),
    } as any;
    (getCurrentPage as jest.Mock).mockReturnValue(mockPage);

    Toast.warn('warn message');

    expect(mockToast.setData).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'warn',
        message: 'warn message',
      })
    );
  });

  test('should call Toast.clear to clear all toasts', () => {
    const mockToast1: any = {
      setData: jest.fn(),
      clear: null,
      timer: null,
    };
    const mockToast2: any = {
      setData: jest.fn(),
      clear: null,
      timer: null,
    };
    const mockPage = {
      selectComponent: jest.fn((selector) => {
        if (selector === '#toast1') return mockToast1;
        if (selector === '#toast2') return mockToast2;
        return null;
      }),
    } as any;
    (getCurrentPage as jest.Mock).mockReturnValue(mockPage);

    Toast({ message: 'test1', selector: '#toast1' });
    Toast({ message: 'test2', selector: '#toast2' });

    // clear methods should be added by Toast function
    expect(mockToast1.clear).toBeTruthy();
    expect(mockToast2.clear).toBeTruthy();

    Toast.clear();

    expect(mockToast1.setData).toHaveBeenCalledWith({ show: false });
    expect(mockToast2.setData).toHaveBeenCalledWith({ show: false });
  });

  test('should set default options', () => {
    Toast.setDefaultOptions({ type: 'loading', duration: 3000 });

    const mockToast = {
      setData: jest.fn(),
      clear: null,
      timer: null,
    };
    const mockPage = {
      selectComponent: jest.fn(() => mockToast),
    } as any;
    (getCurrentPage as jest.Mock).mockReturnValue(mockPage);

    Toast('test message');

    expect(mockToast.setData).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'loading',
        duration: 3000,
      })
    );
  });

  test('should reset default options', () => {
    Toast.setDefaultOptions({ type: 'loading', duration: 3000 });
    Toast.resetDefaultOptions();

    const mockToast = {
      setData: jest.fn(),
      clear: null,
      timer: null,
    };
    const mockPage = {
      selectComponent: jest.fn(() => mockToast),
    } as any;
    (getCurrentPage as jest.Mock).mockReturnValue(mockPage);

    Toast('test message');

    expect(mockToast.setData).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'text',
        duration: 2000,
      })
    );
  });

  test('should use context from contextRef when provided', () => {
    const mockToast = {
      setData: jest.fn(),
      clear: null,
      timer: null,
    };
    const mockPage1 = {
      selectComponent: jest.fn(() => null),
    } as any;
    const mockPage2 = {
      selectComponent: jest.fn(() => mockToast),
    } as any;
    (getCurrentPage as jest.Mock).mockReturnValue(mockPage1);
    contextRef.value['#smart-toast'] = mockPage2;

    Toast('test message');

    expect(mockPage2.selectComponent).toHaveBeenCalledWith('#smart-toast');
  });

  test('should use context function when provided', () => {
    const mockToast = {
      setData: jest.fn(),
      clear: null,
      timer: null,
    };
    const mockPage = {
      selectComponent: jest.fn(() => mockToast),
    } as any;

    Toast({ message: 'test', context: () => mockPage });

    expect(mockPage.selectComponent).toHaveBeenCalledWith('#smart-toast');
  });

  test('should use context object when provided', () => {
    const mockToast = {
      setData: jest.fn(),
      clear: null,
      timer: null,
    };
    const mockPage = {
      selectComponent: jest.fn(() => mockToast),
    } as any;

    Toast({ message: 'test', context: mockPage });

    expect(mockPage.selectComponent).toHaveBeenCalledWith('#smart-toast');
  });

  test('should warn when toast component not found', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const mockPage = {
      selectComponent: jest.fn(() => null),
    } as any;
    (getCurrentPage as jest.Mock).mockReturnValue(mockPage);

    Toast('test message');

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('未找到')
    );

    consoleWarnSpy.mockRestore();
  });
});


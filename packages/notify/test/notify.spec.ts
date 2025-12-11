// Mock wx.getSystemInfoSync before importing
const originalGetSystemInfoSync = wx.getSystemInfoSync;
wx.getSystemInfoSync = jest.fn(() => ({
  statusBarHeight: 20,
})) as any;

import Notify, { contextRef } from '../notify';
import { getCurrentPage } from '../../common/utils';

jest.mock('../../common/utils', () => {
  const actual = jest.requireActual('../../common/utils');
  return {
    ...actual,
    getCurrentPage: jest.fn(),
  };
});

describe('notify API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    contextRef.value = null;
  });

  afterAll(() => {
    wx.getSystemInfoSync = originalGetSystemInfoSync;
  });

  test('should parseOptions with null', () => {
    // This tests parseOptions indirectly through Notify
    const mockNotify = {
      setData: jest.fn(),
      show: jest.fn(),
    };
    const mockPage = {
      selectComponent: jest.fn(() => mockNotify),
    } as any;
    (getCurrentPage as jest.Mock).mockReturnValue(mockPage);

    // @ts-ignore - testing null case
    Notify(null);

    expect(mockNotify.setData).toHaveBeenCalled();
  });

  test('should parseOptions with string', () => {
    const mockNotify = {
      setData: jest.fn(),
      show: jest.fn(),
    };
    const mockPage = {
      selectComponent: jest.fn(() => mockNotify),
    } as any;
    (getCurrentPage as jest.Mock).mockReturnValue(mockPage);

    Notify('test message');

    expect(mockNotify.setData).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'test message',
      })
    );
  });

  test('should parseOptions with object', () => {
    const mockNotify = {
      setData: jest.fn(),
      show: jest.fn(),
    };
    const mockPage = {
      selectComponent: jest.fn(() => mockNotify),
    } as any;
    (getCurrentPage as jest.Mock).mockReturnValue(mockPage);

    Notify({ message: 'test message', type: 'success' });

    expect(mockNotify.setData).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'test message',
        type: 'success',
      })
    );
  });

  test('should use context from options', () => {
    const mockNotify = {
      setData: jest.fn(),
      show: jest.fn(),
    };
    const mockContext = {
      selectComponent: jest.fn(() => mockNotify),
    } as any;

    Notify({
      message: 'test',
      context: mockContext,
    });

    expect(mockContext.selectComponent).toHaveBeenCalled();
    expect(getCurrentPage).not.toHaveBeenCalled();
  });

  test('should use context from function', () => {
    const mockNotify = {
      setData: jest.fn(),
      show: jest.fn(),
    };
    const mockContext = {
      selectComponent: jest.fn(() => mockNotify),
    } as any;

    Notify({
      message: 'test',
      context: () => mockContext,
    });

    expect(mockContext.selectComponent).toHaveBeenCalled();
    expect(getCurrentPage).not.toHaveBeenCalled();
  });

  test('should use contextRef.value when context is not provided', () => {
    const mockNotify = {
      setData: jest.fn(),
      show: jest.fn(),
    };
    const mockContext = {
      selectComponent: jest.fn(() => mockNotify),
    } as any;

    contextRef.value = mockContext;

    Notify({
      message: 'test',
    });

    expect(mockContext.selectComponent).toHaveBeenCalled();
    expect(getCurrentPage).not.toHaveBeenCalled();
  });

  test('should use getCurrentPage when context and contextRef are not available', () => {
    const mockNotify = {
      setData: jest.fn(),
      show: jest.fn(),
    };
    const mockPage = {
      selectComponent: jest.fn(() => mockNotify),
    } as any;
    (getCurrentPage as jest.Mock).mockReturnValue(mockPage);

    contextRef.value = null;

    Notify({
      message: 'test',
    });

    expect(getCurrentPage).toHaveBeenCalled();
    expect(mockPage.selectComponent).toHaveBeenCalled();
  });

  test('should delete context and selector from options', () => {
    const mockNotify = {
      setData: jest.fn(),
      show: jest.fn(),
    };
    const mockPage = {
      selectComponent: jest.fn(() => mockNotify),
    } as any;
    (getCurrentPage as jest.Mock).mockReturnValue(mockPage);

    Notify({
      message: 'test',
      context: mockPage,
      selector: '#custom-selector',
      type: 'success',
    });

    expect(mockNotify.setData).toHaveBeenCalledWith(
      expect.not.objectContaining({
        context: expect.anything(),
        selector: expect.anything(),
      })
    );
    expect(mockNotify.setData).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'test',
        type: 'success',
      })
    );
  });

  test('should return notify instance when found', () => {
    const mockNotify = {
      setData: jest.fn(),
      show: jest.fn(),
    };
    const mockPage = {
      selectComponent: jest.fn(() => mockNotify),
    } as any;
    (getCurrentPage as jest.Mock).mockReturnValue(mockPage);

    const result = Notify('test message');

    expect(result).toBe(mockNotify);
    expect(mockNotify.setData).toHaveBeenCalled();
    expect(mockNotify.show).toHaveBeenCalled();
  });

  test('should warn when notify is not found', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const mockPage = {
      selectComponent: jest.fn(() => null),
    } as any;
    (getCurrentPage as jest.Mock).mockReturnValue(mockPage);

    Notify('test message');

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      '未找到 smart-notify 节点，请确认 selector 及 context 是否正确'
    );

    consoleWarnSpy.mockRestore();
  });

  test('should handle Notify.clear with notify found', () => {
    const mockNotify = {
      hide: jest.fn(),
    };
    const mockPage = {
      selectComponent: jest.fn(() => mockNotify),
    } as any;
    (getCurrentPage as jest.Mock).mockReturnValue(mockPage);

    Notify.clear();

    expect(mockNotify.hide).toHaveBeenCalled();
  });

  test('should handle Notify.clear with notify not found', () => {
    const mockPage = {
      selectComponent: jest.fn(() => null),
    } as any;
    (getCurrentPage as jest.Mock).mockReturnValue(mockPage);

    // Should not throw error
    expect(() => {
      Notify.clear();
    }).not.toThrow();
  });

  test('should handle Notify.clear with custom options', () => {
    const mockNotify = {
      hide: jest.fn(),
    };
    const mockContext = {
      selectComponent: jest.fn(() => mockNotify),
    } as any;

    Notify.clear({
      message: '', // Required by type, but not used in clear
      context: mockContext,
      selector: '#custom-selector',
    });

    expect(mockContext.selectComponent).toHaveBeenCalledWith('#custom-selector');
    expect(mockNotify.hide).toHaveBeenCalled();
  });

  test('should handle Notify.setDefaultOptions', () => {
    const mockNotify = {
      setData: jest.fn(),
      show: jest.fn(),
    };
    const mockPage = {
      selectComponent: jest.fn(() => mockNotify),
    } as any;
    (getCurrentPage as jest.Mock).mockReturnValue(mockPage);

    (Notify.setDefaultOptions as any)({
      type: 'success',
      duration: 2000,
    });

    Notify('test message');

    expect(mockNotify.setData).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'success',
        duration: 2000,
        message: 'test message',
      })
    );
  });

  test('should handle Notify.resetDefaultOptions', () => {
    const mockNotify = {
      setData: jest.fn(),
      show: jest.fn(),
    };
    const mockPage = {
      selectComponent: jest.fn(() => mockNotify),
    } as any;
    (getCurrentPage as jest.Mock).mockReturnValue(mockPage);

    // Set custom default options
    (Notify.setDefaultOptions as any)({
      type: 'success',
      duration: 2000,
    });

    // Reset to default
    Notify.resetDefaultOptions();

    Notify('test message');

    // Should use default options (type: 'danger', duration: 3000)
    expect(mockNotify.setData).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'danger',
        duration: 3000,
        message: 'test message',
      })
    );
  });
});


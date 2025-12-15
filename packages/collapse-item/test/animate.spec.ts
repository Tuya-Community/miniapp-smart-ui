import { getRect } from '../../common/utils';
import { setContentAnimate } from '../animate';

jest.mock('../../common/utils', () => {
  const actual = jest.requireActual('../../common/utils');
  return {
    ...actual,
    getRect: jest.fn(),
  };
});

jest.mock('../../common/version', () => {
  const actual = jest.requireActual('../../common/version');
  return {
    ...actual,
    getSystemInfoSync: jest.fn(() => ({
      system: 'iOS 10',
      version: '7.0.0',
      platform: 'ios',
      environment: 'miniprogram',
    })),
  };
});

describe('animate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock wx.createAnimation
    wx.createAnimation = jest.fn((options: any) => {
      const animation: any = {
        height: jest.fn((value: any) => animation),
        top: jest.fn((value: any) => animation),
        step: jest.fn((options?: any) => animation),
        export: jest.fn(() => ({
          actions: [],
        })),
      };
      return animation;
    }) as any;
  });

  test('should handle setContentAnimate with expanded true and height > 0 and mounted true', async () => {
    const mockContext = {
      setData: jest.fn(),
    } as any;

    (getRect as jest.Mock).mockResolvedValue({ width: 100, height: 100, top: 0 });

    setContentAnimate(mockContext, true, true);
    
    // Wait for promise chain to complete
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(getRect).toHaveBeenCalledWith(mockContext, '.smart-collapse-item__content');
    expect(mockContext.setData).toHaveBeenCalled();
  });

  test('should handle setContentAnimate with expanded true and height > 0 and mounted false', async () => {
    const mockContext = {
      setData: jest.fn(),
    } as any;

    (getRect as jest.Mock).mockResolvedValue({ width: 100, height: 100, top: 0 });

    setContentAnimate(mockContext, true, false);
    
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(mockContext.setData).toHaveBeenCalled();
  });

  test('should handle setContentAnimate with expanded true and height = 0', async () => {
    const mockContext = {
      setData: jest.fn(),
    } as any;

    (getRect as jest.Mock).mockResolvedValue({ width: 100, height: 0, top: 0 });

    setContentAnimate(mockContext, true, true);
    
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(mockContext.setData).toHaveBeenCalled();
  });

  test('should handle setContentAnimate with expanded false', async () => {
    const mockContext = {
      setData: jest.fn(),
    } as any;

    (getRect as jest.Mock).mockResolvedValue({ width: 100, height: 100, top: 0 });

    setContentAnimate(mockContext, false, true);
    
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(mockContext.setData).toHaveBeenCalled();
  });
});


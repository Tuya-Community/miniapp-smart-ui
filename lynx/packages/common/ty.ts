import { getSystemInfoSync } from './version';
const systemInfo = getSystemInfoSync();
const isIOS = systemInfo.platform === 'ios';
const tyApi = {
  vibrateShort: (v: any) => {
    if (!isIOS) return;
    // @ts-ignore
    if (typeof ty !== 'undefined') {
      // @ts-ignore
      ty.vibrateShort?.(v);
    } else if (typeof wx !== 'undefined') {
      wx.vibrateShort?.(v);
    }
  },
  selectionVibrate: () => {
    if (!isIOS) return;
    // @ts-ignore
    if (typeof ty !== 'undefined') {
      // @ts-ignore
      ty.selectionVibrate?.();
    }
  },
  notificationVibrate: (v: any) => {
    if (!isIOS) return;
    // @ts-ignore
    if (typeof ty !== 'undefined') {
      // @ts-ignore
      ty.notificationVibrate?.(v);
    }
  },
  nativeDisabled: (v: boolean) => {
    // @ts-ignore
    if (typeof ty !== 'undefined') {
      // @ts-ignore
      ty.nativeDisabled?.(v);
    }
  },
  themeInfo: null as Record<string, string> | null,
  getThemeInfo: () => {
    if (tyApi.themeInfo) {
      return tyApi.themeInfo;
    }
    // @ts-ignore
    if (typeof ty !== 'undefined') {
      // @ts-ignore
      tyApi.themeInfo = ty.getThemeInfo?.();
      return tyApi.themeInfo;
    }
  },
  accessibilityModeData: null as { isAccessibilityMode: boolean } | null,
  getAccessibilityMode: (params: any) => {
    const { success = () => {}, fail = () => {}, complete = () => {} } = params || {};
    // @ts-ignore
    if (ty?.getAccessibilityMode === undefined) {
      success({ isAccessibilityMode: false });
      complete();
      return;
    }
    if (tyApi.accessibilityModeData) {
      success(tyApi.accessibilityModeData);
      complete();
      return;
    }
    // @ts-ignore
    ty.getAccessibilityMode({
      success: (res: { isAccessibilityMode: boolean }) => {
        tyApi.accessibilityModeData = res;
        success(res);
      },
      fail: err => {
        fail(err);
      },
      complete: () => {
        complete();
      },
    });
  },
  isWX: () => {
    // @ts-ignore
    return typeof ty === 'undefined' && !!wx;
  },
};

export default tyApi;

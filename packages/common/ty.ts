const tyApi = {
  vibrateShort: (v: any) => {
    // @ts-ignore
    if (typeof ty !== 'undefined') {
      // @ts-ignore
      ty.vibrateShort(v);
    } else if (typeof wx !== 'undefined') {
      wx.vibrateShort(v);
    }
  },
  nativeDisabled: (v: boolean) => {
    // @ts-ignore
    if (typeof ty !== 'undefined') {
      // @ts-ignore
      ty.nativeDisabled?.(v);
    }
  },
  getThemeInfo: () => {
    // @ts-ignore
    if (typeof ty !== 'undefined') {
      // @ts-ignore
      return ty.getThemeInfo?.();
    }
  },
  isWX: () => {
    // @ts-ignore
    return typeof ty === 'undefined' && !!wx;
  },
};

export default tyApi;

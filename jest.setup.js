const THEME_INFO = {
  '--app-B1': '#F6F7FB',
  '--app-B2': '#FFFFFF',
  '--app-B3': '#FFFFFF',
  '--app-B4': '#FFFFFF',
  '--app-B5': '#FFFFFF',
  '--app-B6': '#FFFFFF',
  '--app-B1_2': 'rgba(221, 222, 226, 1)',
  '--app-B2_2': 'rgba(230, 230, 230, 1)',
  '--app-B3_2': 'rgba(230, 230, 230, 1)',
  '--app-B4_2': 'rgba(230, 230, 230, 1)',
  '--app-B5_2': 'rgba(230, 230, 230, 1)',
  '--app-B6_2': 'rgba(230, 230, 230, 1)',
  '--app-M1': '#FF592A',
  '--app-M2': '#FF4444',
  '--app-M3': '#2DDA86',
  '--app-M4': '#1989FA',
  '--app-M5': '#FF5A28',
  '--app-M1_1': 'rgba(255, 89, 42, 0.2)',
  '--app-M2_1': 'rgba(255, 68, 68, 0.2)',
  '--app-M3_1': 'rgba(45, 218, 134, 0.2)',
  '--app-M4_1': 'rgba(25, 137, 250, 0.2)',
  '--app-M5_1': 'rgba(255, 90, 40, 0.2)',
  '--app-M1_2': 'rgba(255, 106, 63, 1)',
  '--app-M2_2': 'rgba(255, 87, 87, 1)',
  '--app-M3_2': 'rgba(66, 222, 146, 1)',
  '--app-M4_2': 'rgba(48, 149, 251, 1)',
  '--app-M5_2': 'rgba(255, 107, 62, 1)',
  '--app-B1-N1': 'rgba(0, 0, 0, 0.9)',
  '--app-B1-N2': 'rgba(0, 0, 0, 0.7)',
  '--app-B1-N3': 'rgba(0, 0, 0, 0.5)',
  '--app-B1-N4': 'rgba(0, 0, 0, 0.3)',
  '--app-B1-N5': 'rgba(0, 0, 0, 0.7)',
  '--app-B1-N6': 'rgba(0, 0, 0, 0.2)',
  '--app-B1-N7': 'rgba(0, 0, 0, 0.1)',
  '--app-B1-N8': 'rgba(0, 0, 0, 0.4)',
  '--app-B2-N1': 'rgba(0, 0, 0, 0.9)',
  '--app-B2-N2': 'rgba(0, 0, 0, 0.7)',
  '--app-B2-N3': 'rgba(0, 0, 0, 0.5)',
  '--app-B2-N4': 'rgba(0, 0, 0, 0.3)',
  '--app-B2-N5': 'rgba(0, 0, 0, 0.7)',
  '--app-B2-N6': 'rgba(0, 0, 0, 0.2)',
  '--app-B2-N7': 'rgba(0, 0, 0, 0.1)',
  '--app-B2-N8': 'rgba(0, 0, 0, 0.4)',
  '--app-B3-N1': 'rgba(0, 0, 0, 0.9)',
  '--app-B3-N2': 'rgba(0, 0, 0, 0.7)',
  '--app-B3-N3': 'rgba(0, 0, 0, 0.5)',
  '--app-B3-N4': 'rgba(0, 0, 0, 0.3)',
  '--app-B3-N5': 'rgba(0, 0, 0, 0.7)',
  '--app-B3-N6': 'rgba(0, 0, 0, 0.2)',
  '--app-B3-N7': 'rgba(0, 0, 0, 0.1)',
  '--app-B3-N8': 'rgba(0, 0, 0, 0.4)',
  '--app-B4-N1': 'rgba(0, 0, 0, 0.9)',
  '--app-B4-N2': 'rgba(0, 0, 0, 0.7)',
  '--app-B4-N3': 'rgba(0, 0, 0, 0.5)',
  '--app-B4-N4': 'rgba(0, 0, 0, 0.3)',
  '--app-B4-N5': 'rgba(0, 0, 0, 0.7)',
  '--app-B4-N6': 'rgba(0, 0, 0, 0.2)',
  '--app-B4-N7': 'rgba(0, 0, 0, 0.1)',
  '--app-B4-N8': 'rgba(0, 0, 0, 0.4)',
  '--app-B5-N1': 'rgba(0, 0, 0, 0.9)',
  '--app-B5-N2': 'rgba(0, 0, 0, 0.7)',
  '--app-B5-N3': 'rgba(0, 0, 0, 0.5)',
  '--app-B5-N4': 'rgba(0, 0, 0, 0.3)',
  '--app-B5-N5': 'rgba(0, 0, 0, 0.7)',
  '--app-B5-N6': 'rgba(0, 0, 0, 0.2)',
  '--app-B5-N7': 'rgba(0, 0, 0, 0.1)',
  '--app-B5-N8': 'rgba(0, 0, 0, 0.4)',
  '--app-B6-N1': 'rgba(0, 0, 0, 0.9)',
  '--app-B6-N2': 'rgba(0, 0, 0, 0.7)',
  '--app-B6-N3': 'rgba(0, 0, 0, 0.5)',
  '--app-B6-N4': 'rgba(0, 0, 0, 0.3)',
  '--app-B6-N5': 'rgba(0, 0, 0, 0.7)',
  '--app-B6-N6': 'rgba(0, 0, 0, 0.2)',
  '--app-B6-N7': 'rgba(0, 0, 0, 0.1)',
  '--app-B6-N8': 'rgba(0, 0, 0, 0.4)',
  '--app-B1_2-N1': 'rgba(0, 0, 0, 0.9)',
  '--app-B1_2-N2': 'rgba(0, 0, 0, 0.7)',
  '--app-B1_2-N3': 'rgba(0, 0, 0, 0.5)',
  '--app-B1_2-N4': 'rgba(0, 0, 0, 0.3)',
  '--app-B1_2-N5': 'rgba(0, 0, 0, 0.7)',
  '--app-B1_2-N6': 'rgba(0, 0, 0, 0.2)',
  '--app-B1_2-N7': 'rgba(0, 0, 0, 0.1)',
  '--app-B1_2-N8': 'rgba(0, 0, 0, 0.4)',
  '--app-B2_2-N1': 'rgba(0, 0, 0, 0.9)',
  '--app-B2_2-N2': 'rgba(0, 0, 0, 0.7)',
  '--app-B2_2-N3': 'rgba(0, 0, 0, 0.5)',
  '--app-B2_2-N4': 'rgba(0, 0, 0, 0.3)',
  '--app-B2_2-N5': 'rgba(0, 0, 0, 0.7)',
  '--app-B2_2-N6': 'rgba(0, 0, 0, 0.2)',
  '--app-B2_2-N7': 'rgba(0, 0, 0, 0.1)',
  '--app-B2_2-N8': 'rgba(0, 0, 0, 0.4)',
  '--app-B3_2-N1': 'rgba(0, 0, 0, 0.9)',
  '--app-B3_2-N2': 'rgba(0, 0, 0, 0.7)',
  '--app-B3_2-N3': 'rgba(0, 0, 0, 0.5)',
  '--app-B3_2-N4': 'rgba(0, 0, 0, 0.3)',
  '--app-B3_2-N5': 'rgba(0, 0, 0, 0.7)',
  '--app-B3_2-N6': 'rgba(0, 0, 0, 0.2)',
  '--app-B3_2-N7': 'rgba(0, 0, 0, 0.1)',
  '--app-B3_2-N8': 'rgba(0, 0, 0, 0.4)',
  '--app-B4_2-N1': 'rgba(0, 0, 0, 0.9)',
  '--app-B4_2-N2': 'rgba(0, 0, 0, 0.7)',
  '--app-B4_2-N3': 'rgba(0, 0, 0, 0.5)',
  '--app-B4_2-N4': 'rgba(0, 0, 0, 0.3)',
  '--app-B4_2-N5': 'rgba(0, 0, 0, 0.7)',
  '--app-B4_2-N6': 'rgba(0, 0, 0, 0.2)',
  '--app-B4_2-N7': 'rgba(0, 0, 0, 0.1)',
  '--app-B4_2-N8': 'rgba(0, 0, 0, 0.4)',
  '--app-B5_2-N1': 'rgba(0, 0, 0, 0.9)',
  '--app-B5_2-N2': 'rgba(0, 0, 0, 0.7)',
  '--app-B5_2-N3': 'rgba(0, 0, 0, 0.5)',
  '--app-B5_2-N4': 'rgba(0, 0, 0, 0.3)',
  '--app-B5_2-N5': 'rgba(0, 0, 0, 0.7)',
  '--app-B5_2-N6': 'rgba(0, 0, 0, 0.2)',
  '--app-B5_2-N7': 'rgba(0, 0, 0, 0.1)',
  '--app-B5_2-N8': 'rgba(0, 0, 0, 0.4)',
  '--app-B6_2-N1': 'rgba(0, 0, 0, 0.9)',
  '--app-B6_2-N2': 'rgba(0, 0, 0, 0.7)',
  '--app-B6_2-N3': 'rgba(0, 0, 0, 0.5)',
  '--app-B6_2-N4': 'rgba(0, 0, 0, 0.3)',
  '--app-B6_2-N5': 'rgba(0, 0, 0, 0.7)',
  '--app-B6_2-N6': 'rgba(0, 0, 0, 0.2)',
  '--app-B6_2-N7': 'rgba(0, 0, 0, 0.1)',
  '--app-B6_2-N8': 'rgba(0, 0, 0, 0.4)',
  '--app-M1-N1': 'rgba(255, 255, 255,  0.9)',
  '--app-M1-N2': 'rgba(255, 255, 255,  0.7)',
  '--app-M1-N3': 'rgba(255, 255, 255,  0.5)',
  '--app-M1-N4': 'rgba(255, 255, 255,  0.3)',
  '--app-M1-N5': 'rgba(255, 255, 255,  0.7)',
  '--app-M1-N6': 'rgba(255, 255, 255,  0.2)',
  '--app-M1-N7': 'rgba(255, 255, 255,  0.1)',
  '--app-M1-N8': 'rgba(255, 255, 255,  0.4)',
  '--app-M2-N1': 'rgba(255, 255, 255,  0.9)',
  '--app-M2-N2': 'rgba(255, 255, 255,  0.7)',
  '--app-M2-N3': 'rgba(255, 255, 255,  0.5)',
  '--app-M2-N4': 'rgba(255, 255, 255,  0.3)',
  '--app-M2-N5': 'rgba(255, 255, 255,  0.7)',
  '--app-M2-N6': 'rgba(255, 255, 255,  0.2)',
  '--app-M2-N7': 'rgba(255, 255, 255,  0.1)',
  '--app-M2-N8': 'rgba(255, 255, 255,  0.4)',
  '--app-M3-N1': 'rgba(255, 255, 255,  0.9)',
  '--app-M3-N2': 'rgba(255, 255, 255,  0.7)',
  '--app-M3-N3': 'rgba(255, 255, 255,  0.5)',
  '--app-M3-N4': 'rgba(255, 255, 255,  0.3)',
  '--app-M3-N5': 'rgba(255, 255, 255,  0.7)',
  '--app-M3-N6': 'rgba(255, 255, 255,  0.2)',
  '--app-M3-N7': 'rgba(255, 255, 255,  0.1)',
  '--app-M3-N8': 'rgba(255, 255, 255,  0.4)',
  '--app-M4-N1': 'rgba(255, 255, 255,  0.9)',
  '--app-M4-N2': 'rgba(255, 255, 255,  0.7)',
  '--app-M4-N3': 'rgba(255, 255, 255,  0.5)',
  '--app-M4-N4': 'rgba(255, 255, 255,  0.3)',
  '--app-M4-N5': 'rgba(255, 255, 255,  0.7)',
  '--app-M4-N6': 'rgba(255, 255, 255,  0.2)',
  '--app-M4-N7': 'rgba(255, 255, 255,  0.1)',
  '--app-M4-N8': 'rgba(255, 255, 255,  0.4)',
  '--app-M5-N1': 'rgba(255, 255, 255,  0.9)',
  '--app-M5-N2': 'rgba(255, 255, 255,  0.7)',
  '--app-M5-N3': 'rgba(255, 255, 255,  0.5)',
  '--app-M5-N4': 'rgba(255, 255, 255,  0.3)',
  '--app-M5-N5': 'rgba(255, 255, 255,  0.7)',
  '--app-M5-N6': 'rgba(255, 255, 255,  0.2)',
  '--app-M5-N7': 'rgba(255, 255, 255,  0.1)',
  '--app-M5-N8': 'rgba(255, 255, 255,  0.4)',
  '--app-M1_1-N1': 'rgba(255, 255, 255, 0.9)',
  '--app-M1_1-N2': 'rgba(255, 255, 255, 0.7)',
  '--app-M1_1-N3': 'rgba(255, 255, 255, 0.5)',
  '--app-M1_1-N4': 'rgba(255, 255, 255, 0.3)',
  '--app-M1_1-N5': 'rgba(255, 255, 255, 0.7)',
  '--app-M1_1-N6': 'rgba(255, 255, 255, 0.2)',
  '--app-M1_1-N7': 'rgba(255, 255, 255, 0.1)',
  '--app-M1_1-N8': 'rgba(0, 0, 0, 0.4)',
  '--app-M2_1-N1': 'rgba(255, 255, 255, 0.9)',
  '--app-M2_1-N2': 'rgba(255, 255, 255, 0.7)',
  '--app-M2_1-N3': 'rgba(255, 255, 255, 0.5)',
  '--app-M2_1-N4': 'rgba(255, 255, 255, 0.3)',
  '--app-M2_1-N5': 'rgba(255, 255, 255, 0.7)',
  '--app-M2_1-N6': 'rgba(255, 255, 255, 0.2)',
  '--app-M2_1-N7': 'rgba(255, 255, 255, 0.1)',
  '--app-M2_1-N8': 'rgba(0, 0, 0, 0.4)',
  '--app-M3_1-N1': 'rgba(255, 255, 255, 0.9)',
  '--app-M3_1-N2': 'rgba(255, 255, 255, 0.7)',
  '--app-M3_1-N3': 'rgba(255, 255, 255, 0.5)',
  '--app-M3_1-N4': 'rgba(255, 255, 255, 0.3)',
  '--app-M3_1-N5': 'rgba(255, 255, 255, 0.7)',
  '--app-M3_1-N6': 'rgba(255, 255, 255, 0.2)',
  '--app-M3_1-N7': 'rgba(255, 255, 255, 0.1)',
  '--app-M3_1-N8': 'rgba(0, 0, 0, 0.4)',
  '--app-M4_1-N1': 'rgba(255, 255, 255, 0.9)',
  '--app-M4_1-N2': 'rgba(255, 255, 255, 0.7)',
  '--app-M4_1-N3': 'rgba(255, 255, 255, 0.5)',
  '--app-M4_1-N4': 'rgba(255, 255, 255, 0.3)',
  '--app-M4_1-N5': 'rgba(255, 255, 255, 0.7)',
  '--app-M4_1-N6': 'rgba(255, 255, 255, 0.2)',
  '--app-M4_1-N7': 'rgba(255, 255, 255, 0.1)',
  '--app-M4_1-N8': 'rgba(0, 0, 0, 0.4)',
  '--app-M5_1-N1': 'rgba(255, 255, 255, 0.9)',
  '--app-M5_1-N2': 'rgba(255, 255, 255, 0.7)',
  '--app-M5_1-N3': 'rgba(255, 255, 255, 0.5)',
  '--app-M5_1-N4': 'rgba(255, 255, 255, 0.3)',
  '--app-M5_1-N5': 'rgba(255, 255, 255, 0.7)',
  '--app-M5_1-N6': 'rgba(255, 255, 255, 0.2)',
  '--app-M5_1-N7': 'rgba(255, 255, 255, 0.1)',
  '--app-M5_1-N8': 'rgba(0, 0, 0, 0.4)',
  '--app-M1_2-N1': 'rgba(255, 255, 255, 0.9)',
  '--app-M1_2-N2': 'rgba(255, 255, 255, 0.7)',
  '--app-M1_2-N3': 'rgba(255, 255, 255, 0.5)',
  '--app-M1_2-N4': 'rgba(255, 255, 255, 0.3)',
  '--app-M1_2-N5': 'rgba(255, 255, 255, 0.7)',
  '--app-M1_2-N6': 'rgba(255, 255, 255, 0.2)',
  '--app-M1_2-N7': 'rgba(255, 255, 255, 0.1)',
  '--app-M1_2-N8': 'rgba(0, 0, 0, 0.4)',
  '--app-M2_2-N1': 'rgba(255, 255, 255, 0.9)',
  '--app-M2_2-N2': 'rgba(255, 255, 255, 0.7)',
  '--app-M2_2-N3': 'rgba(255, 255, 255, 0.5)',
  '--app-M2_2-N4': 'rgba(255, 255, 255, 0.3)',
  '--app-M2_2-N5': 'rgba(255, 255, 255, 0.7)',
  '--app-M2_2-N6': 'rgba(255, 255, 255, 0.2)',
  '--app-M2_2-N7': 'rgba(255, 255, 255, 0.1)',
  '--app-M2_2-N8': 'rgba(0, 0, 0, 0.4)',
  '--app-M3_2-N1': 'rgba(255, 255, 255, 0.9)',
  '--app-M3_2-N2': 'rgba(255, 255, 255, 0.7)',
  '--app-M3_2-N3': 'rgba(255, 255, 255, 0.5)',
  '--app-M3_2-N4': 'rgba(255, 255, 255, 0.3)',
  '--app-M3_2-N5': 'rgba(255, 255, 255, 0.7)',
  '--app-M3_2-N6': 'rgba(255, 255, 255, 0.2)',
  '--app-M3_2-N7': 'rgba(255, 255, 255, 0.1)',
  '--app-M3_2-N8': 'rgba(0, 0, 0, 0.4)',
  '--app-M4_2-N1': 'rgba(255, 255, 255, 0.9)',
  '--app-M4_2-N2': 'rgba(255, 255, 255, 0.7)',
  '--app-M4_2-N3': 'rgba(255, 255, 255, 0.5)',
  '--app-M4_2-N4': 'rgba(255, 255, 255, 0.3)',
  '--app-M4_2-N5': 'rgba(255, 255, 255, 0.7)',
  '--app-M4_2-N6': 'rgba(255, 255, 255, 0.2)',
  '--app-M4_2-N7': 'rgba(255, 255, 255, 0.1)',
  '--app-M4_2-N8': 'rgba(0, 0, 0, 0.4)',
  '--app-M5_2-N1': 'rgba(255, 255, 255, 0.9)',
  '--app-M5_2-N2': 'rgba(255, 255, 255, 0.7)',
  '--app-M5_2-N3': 'rgba(255, 255, 255, 0.5)',
  '--app-M5_2-N4': 'rgba(255, 255, 255, 0.3)',
  '--app-M5_2-N5': 'rgba(255, 255, 255, 0.7)',
  '--app-M5_2-N6': 'rgba(255, 255, 255, 0.2)',
  '--app-M5_2-N7': 'rgba(255, 255, 255, 0.1)',
  '--app-M5_2-N8': 'rgba(0, 0, 0, 0.4)',
  '--app-C1_1': '8px',
  '--app-C1_2': '6px',
  '--app-C1_3': '4px',
  '--app-C2': '16px',
  '--app-C2_2': '24px',
  '--app-C2_3': '32px',
  '--app-C3_1': '16px',
  '--app-C3_2': '12px',
  '--app-C3_3': '8px',
  '--app-C3_4': '4px',
  '--app-I1': '16px',
  '--app-I2': '20px',
  '--app-I3': '24px',
  '--app-I4': '32px',
  '--app-I5': '40px',
  '--app-I6': '56px',
  '--app-I7': '64px',
  '--app-IC1': '16px',
  '--app-IC2': '20px',
  '--app-IC3': '24px',
  '--app-IC4': '32px',
  '--app-IC5': '40px',
  '--app-IC6': '56px',
};

global.I18n = {
  t: key => {
    return key;
  },
};

global.tyApi = {
  vibrateShort: () => {},
  selectionVibrate: () => {},
  nativeDisabled: () => {},
  getThemeInfo: () => {},
  notificationVibrate: () => {},
  isWX: () => false,
};

global.ty = {
  selectionVibrate: () => {},
  getLogManager: () => {},
  notificationVibrate: () => {},
  getThemeInfo: () => THEME_INFO,
  createCanvasContext: id => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    // const ctx = new window.CanvasRenderingContext2D(canvas);
    ctx.setFillStyle = style => {
      ctx.fillStyle = style;
    };
    ctx.setLineWidth = width => {
      ctx.lineWidth = width;
    };
    ctx.setStrokeStyle = strokeStyle => {
      ctx.strokeStyle = strokeStyle;
    };
    ctx.setLineCap = lineCap => {
      ctx.lineCap = lineCap;
    };
    ctx.draw = ctx.save;

    ctx.createLinearGradient = () => {
      const canvasGradient = new window.CanvasGradient();
      return canvasGradient;
    };
    return ctx;
  },
};

global.wx = {
  selectionVibrate: () => {},
  notificationVibrate: () => {},
  getThemeInfo: () => THEME_INFO,
  getUserProfile: options => {
    const mockUserInfo = {
      userInfo: {
        nickName: 'test user',
        avatarUrl: '',
      },
      rawData: '{}',
      signature: '',
      encryptedData: '',
      iv: '',
    };

    if (options && options.complete) {
      options.complete(mockUserInfo);
    }
    if (options && options.success) {
      options.success(mockUserInfo);
    }
    if (options && options.fail) {
      // Don't call fail by default, but allow it to be called if needed
    }
  },
};

global.getCurrentPages = () => [{}];

// Mock getCanvasById for .rjs files (used in circle component)
global.getCanvasById = jest.fn(canvasId => {
  const canvas = document.createElement('canvas');
  canvas.id = canvasId;
  return Promise.resolve(canvas);
});

// Mock Render function for .rjs files (used in circle component)
// Render is a constructor function that can be called with 'new'
// The .rjs file exports Render({...}) result, but code uses 'new Render(this)'
// So we need to make Render work as both a factory and constructor
function MockRender(initialData) {
  // If called with 'new', treat as constructor
  if (this instanceof MockRender) {
    // Constructor mode: merge initialData with methods
    Object.assign(this, {
      canvas: null,
      lineWidth: 10,
      maskColor: '#ffffff',
      trackColor: '#d3d3d3',
      fillColorStops: null,
      dpr: 1,
      fillColor: '#007AFF',
      ...initialData,
      init: jest.fn(),
      render: jest.fn(),
      renderAll: jest.fn(),
      renderHalf: jest.fn(),
      renderHalf2: jest.fn(),
      percentToDecimal: jest.fn(percent => {
        const num = String(percent).replace('%', '');
        return parseFloat(num) / 100;
      }),
    });
    return this;
  }
  // Factory mode: return object with methods
  return {
    canvas: null,
    lineWidth: 10,
    maskColor: '#ffffff',
    trackColor: '#d3d3d3',
    fillColorStops: null,
    dpr: 1,
    fillColor: '#007AFF',
    ...initialData,
    init: jest.fn(),
    render: jest.fn(),
    renderAll: jest.fn(),
    renderHalf: jest.fn(),
    renderHalf2: jest.fn(),
    percentToDecimal: jest.fn(percent => {
      const num = String(percent).replace('%', '');
      return parseFloat(num) / 100;
    }),
  };
}

global.Render = MockRender;

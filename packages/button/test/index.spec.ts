import path from 'path';
import simulate from 'miniprogram-simulate';

describe('button', () => {
  const SmartButton = simulate.load(
    path.resolve(__dirname, '../../button/index'),
    'smart-button',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  test('should emit click event', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" bind:click="onClick" />`,
        data: {
          tapValue: 0,
        },
        methods: {
          onClick() {
            this.setData({
              tapValue: this.data.tapValue + 1,
            });
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const btn = wrapper?.querySelector('.smart-button');
    btn?.dispatchEvent('tap');
    await simulate.sleep(10);
    expect(comp.data.tapValue).toEqual(1);
  });

  test('should not emit click event when disabled', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" disabled bind:click="onClick" />`,
        data: {
          tapValue: 0,
        },
        methods: {
          onClick() {
            this.setData({
              tapValue: this.data.tapValue + 1,
            });
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const btn = wrapper?.querySelector('.smart-button');
    btn?.dispatchEvent('tap');
    await simulate.sleep(10);
    expect(comp.data.tapValue).toEqual(0);
  });

  test('should render with different types', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `
          <smart-button id="default" type="default" />
          <smart-button id="primary" type="primary" />
          <smart-button id="success" type="success" />
          <smart-button id="warning" type="warning" />
          <smart-button id="danger" type="danger" />
        `,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const defaultBtn = comp.querySelector('#default');
    const primaryBtn = comp.querySelector('#primary');
    const successBtn = comp.querySelector('#success');
    const warningBtn = comp.querySelector('#warning');
    const dangerBtn = comp.querySelector('#danger');

    await simulate.sleep(10);
    expect(defaultBtn?.data.type).toBe('default');
    expect(primaryBtn?.data.type).toBe('primary');
    expect(successBtn?.data.type).toBe('success');
    expect(warningBtn?.data.type).toBe('warning');
    expect(dangerBtn?.data.type).toBe('danger');
  });

  test('should render with different sizes', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `
          <smart-button id="large" size="large" />
          <smart-button id="normal" size="normal" />
          <smart-button id="small" size="small" />
          <smart-button id="mini" size="mini" />
        `,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const largeBtn = comp.querySelector('#large');
    const normalBtn = comp.querySelector('#normal');
    const smallBtn = comp.querySelector('#small');
    const miniBtn = comp.querySelector('#mini');

    await simulate.sleep(10);
    expect(largeBtn?.data.size).toBe('large');
    expect(normalBtn?.data.size).toBe('normal');
    expect(smallBtn?.data.size).toBe('small');
    expect(miniBtn?.data.size).toBe('mini');
  });

  test('should render with loading state', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" loading="{{ true }}" loading-text="加载中..." />`,
        data: {
          loading: true,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.loading).toBe(true);
    expect(wrapper?.data.loadingText).toBe('加载中...');
  });

  test('should render with icon', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" icon="star" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.icon).toBe('star');
  });

  test('should render with right icon', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" right-icon="arrow" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.rightIcon).toBe('arrow');
  });

  test('should render with plain style', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" plain="{{ true }}" />`,
        data: {
          plain: true,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.plain).toBe(true);
  });

  test('should render with block style', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" block="{{ true }}" />`,
        data: {
          block: true,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.block).toBe(true);
  });

  test('should render with round style', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" round="{{ true }}" />`,
        data: {
          round: true,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.round).toBe(true);
  });

  test('should render with square style', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" square="{{ true }}" />`,
        data: {
          square: true,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.square).toBe(true);
  });

  test('should render with hairline style', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" hairline="{{ true }}" />`,
        data: {
          hairline: true,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.hairline).toBe(true);
  });

  test('should render with custom color', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" color="#ff0000" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.color).toBe('#ff0000');
  });

  test('should render with custom loading type', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" loading="{{ true }}" loading-type="spinner" />`,
        data: {
          loading: true,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.loadingType).toBe('spinner');
  });

  test('should render with custom loading size', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" loading="{{ true }}" loading-size="30px" />`,
        data: {
          loading: true,
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.loadingSize).toBe('30px');
  });

  test('should render with formType', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" form-type="submit" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.formType).toBe('submit');
  });

  test('should render with custom style', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" custom-style="background-color: red;" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.customStyle).toBe('background-color: red;');
  });

  test('should render with text style', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" text-style="font-size: 16px;" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.textStyle).toBe('font-size: 16px;');
  });

  test('should render with custom class prefix', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" class-prefix="custom-icon" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.classPrefix).toBe('custom-icon');
  });

  test('should render with dataset', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" dataset="{{ { key: 'value' } }}" />`,
        data: {
          dataset: { key: 'value' },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    await simulate.sleep(10);
    expect(wrapper?.data.dataset).toEqual({ key: 'value' });
  });

  test('should emit click event with event detail', async () => {
    let clickEvent: any = null;

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" bind:click="onClick" />`,
        methods: {
          onClick(event: any) {
            clickEvent = event;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const btn = wrapper?.querySelector('.smart-button');
    const mockEvent = { detail: { test: 'data' } };
    btn?.dispatchEvent('tap', mockEvent);
    await simulate.sleep(10);
    expect(clickEvent).toBeTruthy();
  });

  test('should call wx.getUserProfile when openType is getUserInfo and canIUseGetUserProfile is true', async () => {
    let getUserInfoEvent: any = null;
    const mockUserProfile = {
      userInfo: {
        nickName: 'test user',
        avatarUrl: 'https://example.com/avatar.png',
      },
      rawData: '{}',
      signature: '',
      encryptedData: '',
      iv: '',
      errMsg: 'getUserProfile:ok',
    };

    // Mock wx.getUserProfile
    const originalGetUserProfile = wx.getUserProfile;
    (wx as any).getUserProfile = jest.fn((options: any) => {
      if (options && options.complete) {
        options.complete(mockUserProfile);
      }
    });

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `
          <smart-button
            id="wrapper"
            open-type="getUserInfo"
            bind:getuserinfo="onGetUserInfo"
          />
        `,
        methods: {
          onGetUserInfo(event: any) {
            getUserInfoEvent = event;
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    // Set canIUseGetUserProfile to true
    if (instance) {
      instance.setData({ canIUseGetUserProfile: true });
      await simulate.sleep(10);
    }

    const btn = wrapper?.querySelector('.smart-button');
    btn?.dispatchEvent('tap');
    await simulate.sleep(10);

    // Verify wx.getUserProfile was called
    expect((wx as any).getUserProfile).toHaveBeenCalled();
    expect((wx as any).getUserProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        desc: '  ', // default value
        lang: 'en', // default value
        complete: expect.any(Function),
      })
    );

    // Verify getuserinfo event was emitted
    expect(getUserInfoEvent).toBeTruthy();
    expect(getUserInfoEvent.detail).toEqual(mockUserProfile);

    // Restore
    (wx as any).getUserProfile = originalGetUserProfile;
  });

  test('should use custom getUserProfileDesc and lang when provided', async () => {
    const mockUserProfile = {
      userInfo: {
        nickName: 'test user',
        avatarUrl: 'https://example.com/avatar.png',
      },
      rawData: '{}',
      signature: '',
      encryptedData: '',
      iv: '',
      errMsg: 'getUserProfile:ok',
    };

    // Mock wx.getUserProfile
    const originalGetUserProfile = wx.getUserProfile;
    (wx as any).getUserProfile = jest.fn((options: any) => {
      if (options && options.complete) {
        options.complete(mockUserProfile);
      }
    });

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `
          <smart-button
            id="wrapper"
            open-type="getUserInfo"
            get-user-profile-desc="用于完善用户资料"
            lang="zh_CN"
          />
        `,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    // Set canIUseGetUserProfile to true
    if (instance) {
      instance.setData({ canIUseGetUserProfile: true });
      await simulate.sleep(10);
    }

    const btn = wrapper?.querySelector('.smart-button');
    btn?.dispatchEvent('tap');
    await simulate.sleep(10);

    // Verify wx.getUserProfile was called with custom desc and lang
    expect(wx.getUserProfile).toHaveBeenCalled();
    expect(wx.getUserProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        desc: '用于完善用户资料',
        lang: 'zh_CN',
        complete: expect.any(Function),
      })
    );

    // Restore
    (wx as any).getUserProfile = originalGetUserProfile;
  });

  test('should not call wx.getUserProfile when openType is not getUserInfo', async () => {
    // Mock wx.getUserProfile
    const originalGetUserProfile = wx.getUserProfile;
    wx.getUserProfile = jest.fn();

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `
          <smart-button
            id="wrapper"
            open-type="contact"
          />
        `,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    // Set canIUseGetUserProfile to true
    if (instance) {
      instance.setData({ canIUseGetUserProfile: true });
      await simulate.sleep(10);
    }

    const btn = wrapper?.querySelector('.smart-button');
    btn?.dispatchEvent('tap');
    await simulate.sleep(10);

    // Verify wx.getUserProfile was not called
    expect((wx as any).getUserProfile).not.toHaveBeenCalled();

    // Restore
    (wx as any).getUserProfile = originalGetUserProfile;
  });

  test('should not call wx.getUserProfile when canIUseGetUserProfile is false', async () => {
    // Mock wx.getUserProfile
    const originalGetUserProfile = wx.getUserProfile;
    wx.getUserProfile = jest.fn();

    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `
          <smart-button
            id="wrapper"
            open-type="getUserInfo"
          />
        `,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    // Set canIUseGetUserProfile to false
    if (instance) {
      instance.setData({ canIUseGetUserProfile: false });
      await simulate.sleep(10);
    }

    const btn = wrapper?.querySelector('.smart-button');
    btn?.dispatchEvent('tap');
    await simulate.sleep(10);

    // Verify wx.getUserProfile was not called
    expect((wx as any).getUserProfile).not.toHaveBeenCalled();

    // Restore
    (wx as any).getUserProfile = originalGetUserProfile;
  });
});

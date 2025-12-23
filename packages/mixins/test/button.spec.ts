import path from 'path';
import simulate from 'miniprogram-simulate';

describe('mixins/button', () => {
  // Use button component which uses button mixin
  const SmartButton = simulate.load(
    path.resolve(__dirname, '../../button/index'),
    'smart-button',
    {
      rootPath: path.resolve(__dirname, '../../'),
    }
  );

  test('should handle onGetUserInfo event (line 28)', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" open-type="getUserInfo" bind:getuserinfo="onGetUserInfo" />`,
        methods: {
          onGetUserInfo(event: any) {
            expect(event.detail).toBeDefined();
          },
        },
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      const emitSpy = jest.spyOn(instance, 'triggerEvent');
      const mockEvent = {
        detail: { userInfo: { nickName: 'test' } },
      } as any;
      
      instance.onGetUserInfo(mockEvent);
      
      expect(emitSpy).toHaveBeenCalledWith('getuserinfo', mockEvent.detail);
      emitSpy.mockRestore();
    }
  });

  test('should handle onContact event (line 32)', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" open-type="contact" bind:contact="onContact" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      const emitSpy = jest.spyOn(instance, 'triggerEvent');
      const mockEvent = {
        detail: { path: 'test' },
      } as any;
      
      instance.onContact(mockEvent);
      
      expect(emitSpy).toHaveBeenCalledWith('contact', mockEvent.detail);
      emitSpy.mockRestore();
    }
  });

  test('should handle onGetPhoneNumber event (line 36)', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" open-type="getPhoneNumber" bind:getphonenumber="onGetPhoneNumber" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      const emitSpy = jest.spyOn(instance, 'triggerEvent');
      const mockEvent = {
        detail: { code: 'test' },
      } as any;
      
      instance.onGetPhoneNumber(mockEvent);
      
      expect(emitSpy).toHaveBeenCalledWith('getphonenumber', mockEvent.detail);
      emitSpy.mockRestore();
    }
  });

  test('should handle onGetRealTimePhoneNumber event (line 40)', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" open-type="getRealtimePhoneNumber" bind:getrealtimephonenumber="onGetRealTimePhoneNumber" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      const emitSpy = jest.spyOn(instance, 'triggerEvent');
      const mockEvent = {
        detail: { code: 'test' },
      } as any;
      
      instance.onGetRealTimePhoneNumber(mockEvent);
      
      expect(emitSpy).toHaveBeenCalledWith('getrealtimephonenumber', mockEvent.detail);
      emitSpy.mockRestore();
    }
  });

  test('should handle onError event (line 44)', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" bind:error="onError" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      const emitSpy = jest.spyOn(instance, 'triggerEvent');
      const mockEvent = {
        detail: { errMsg: 'test error' },
      } as any;
      
      instance.onError(mockEvent);
      
      expect(emitSpy).toHaveBeenCalledWith('error', mockEvent.detail);
      emitSpy.mockRestore();
    }
  });

  test('should handle onLaunchApp event (line 48)', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" open-type="launchApp" bind:launchapp="onLaunchApp" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      const emitSpy = jest.spyOn(instance, 'triggerEvent');
      const mockEvent = {
        detail: { extraData: {} },
      } as any;
      
      instance.onLaunchApp(mockEvent);
      
      expect(emitSpy).toHaveBeenCalledWith('launchapp', mockEvent.detail);
      emitSpy.mockRestore();
    }
  });

  test('should handle onOpenSetting event (line 52)', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" open-type="openSetting" bind:opensetting="onOpenSetting" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      const emitSpy = jest.spyOn(instance, 'triggerEvent');
      const mockEvent = {
        detail: { authSetting: {} },
      } as any;
      
      instance.onOpenSetting(mockEvent);
      
      expect(emitSpy).toHaveBeenCalledWith('opensetting', mockEvent.detail);
      emitSpy.mockRestore();
    }
  });

  test('should handle onAgreePrivacyAuthorization event (line 56)', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" bind:agreeprivacyauthorization="onAgreePrivacyAuthorization" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      const emitSpy = jest.spyOn(instance, 'triggerEvent');
      const mockEvent = {
        detail: { agree: true },
      } as any;
      
      instance.onAgreePrivacyAuthorization(mockEvent);
      
      expect(emitSpy).toHaveBeenCalledWith('agreeprivacyauthorization', mockEvent.detail);
      emitSpy.mockRestore();
    }
  });

  test('should handle onChooseAvatar event (line 64)', async () => {
    const comp = simulate.render(
      simulate.load({
        usingComponents: {
          'smart-button': SmartButton,
        },
        template: `<smart-button id="wrapper" open-type="chooseAvatar" bind:chooseavatar="onChooseAvatar" />`,
      })
    );
    comp.attach(document.createElement('parent-wrapper'));

    const wrapper = comp.querySelector('#wrapper');
    const instance = wrapper?.instance;
    
    if (instance) {
      const emitSpy = jest.spyOn(instance, 'triggerEvent');
      const mockEvent = {
        detail: { avatarUrl: 'test-url' },
      } as any;
      
      instance.onChooseAvatar(mockEvent);
      
      expect(emitSpy).toHaveBeenCalledWith('chooseavatar', mockEvent.detail);
      emitSpy.mockRestore();
    }
  });
});


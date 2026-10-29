import { palettes } from './palettes';
declare const ty: any;
export function themeVars(owner: any): Record<string, string> {
  const vars = { ...(typeof ty !== 'undefined' ? ty.getThemeInfo?.() || {} : {}) };
  const providers = owner?.getRelationNodes?.('../config-provider/index') || [];
  [...providers].reverse().forEach(provider => {
    const custom: Record<string, string> = {};
    Object.entries(provider.data.themeVars || {}).forEach(([key, value]) => {
      custom['--' + key.replace(/[A-Z]/g, c => '-' + c.toLowerCase()).replace(/^-/, '')] =
        String(value);
    });
    // Match the existing ConfigProvider: palette takes precedence over custom
    // variables for the same key. Do not change the WebView theme contract.
    Object.assign(vars, custom, palettes[provider.data.theme] || {});
  });
  return vars;
}
export function paletteConsumer(options: any, method: string) {
  options.relation = {
    relations: {
      '../config-provider/index': {
        type: 'ancestor',
        linked(this: any) {
          this[method]?.();
        },
        linkChanged(this: any) {
          this[method]?.();
        },
      },
    },
    mixin: Behavior({}),
  };
}
export function configProvider(options: any) {
  const refresh = function (this: any) {
    const methods: Record<string, string> = {
      icon: 'refreshLynxIcon',
      image: 'refreshLynxImage',
      loading: 'refreshLynxLoading',
      circle: 'refresh',
      'picker-column': 'refreshLynxRows',
      picker: 'refreshLynxPicker',
    };
    Object.entries(methods).forEach(([name, method]) => {
      (this.getRelationNodes('../' + name + '/index') || []).forEach(child => child[method]?.());
    });
  };
  options.watch = { ...(options.watch || {}), 'theme,themeVars': refresh };
  options.relation = {
    relations: Object.fromEntries(
      ['icon', 'image', 'loading', 'circle', 'picker-column', 'picker'].map(name => [
        '../' + name + '/index',
        { type: 'descendant', linked: refresh, linkChanged: refresh },
      ])
    ),
    mixin: Behavior({}),
  };
}

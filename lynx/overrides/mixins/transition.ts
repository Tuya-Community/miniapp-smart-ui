import { holdNative, releaseNative } from '../lynx-runtime/layers';

export function transition(showDefaultValue: boolean) {
  return Behavior({
    properties: {
      nativeDisabled: {
        type: Boolean,
        observer(this: any, value: boolean) {
          if (!this._lynxPageHidden && this.data.display && value) holdNative(this);
          else releaseNative(this);
        },
      },
      customStyle: String,
      show: { type: Boolean, value: showDefaultValue, observer: 'observeShow' },
      duration: { type: null, value: 300 },
      name: { type: String, value: 'fade' },
    },
    data: {
      type: '',
      inited: false,
      display: false,
      animating: false,
      status: '',
      isShowed: false,
      classes: '',
      currentDuration: 0,
    },
    ready(this: any) {
      if (this.data.show) this.observeShow(true);
    },
    detached(this: any) {
      this._lynxDisposed = true;
      clearTimeout(this._lynxFrame);
      clearTimeout(this._lynxTransition);
      releaseNative(this);
    },
    pageLifetimes: {
      hide(this: any) {
        this._lynxPageHidden = true;
        clearTimeout(this._lynxFrame);
        clearTimeout(this._lynxTransition);
        this._lynxTransitionRevision = (this._lynxTransitionRevision || 0) + 1;
        this.setData({
          display: !!this.data.show,
          isShowed: !!this.data.show,
          animating: false,
          classes: '',
          currentDuration: 0,
        });
        releaseNative(this);
      },
      show(this: any) {
        this._lynxPageHidden = false;
        if (this.data.display && this.data.nativeDisabled) holdNative(this);
      },
    },
    methods: {
      observeShow(this: any, value: boolean, old?: boolean) {
        if (value === old || this._lynxDisposed) return;
        clearTimeout(this._lynxFrame);
        clearTimeout(this._lynxTransition);
        const revision = (this._lynxTransitionRevision || 0) + 1;
        this._lynxTransitionRevision = revision;
        // An initial false prop is not a close animation. Mounting leave content
        // here briefly exposed the empty global Toast on every page entry.
        if (!value && !this.data.inited && !this.data.display) {
          releaseNative(this);
          return;
        }
        if (this._lynxPageHidden) {
          this.setData({
            display: value,
            isShowed: value,
            animating: false,
            classes: '',
            currentDuration: 0,
          });
          releaseNative(this);
          return;
        }
        const { name, duration } = this.data;
        const phase = value ? 'enter' : 'leave';
        const currentDuration = Math.max(
          0,
          Number(typeof duration === 'object' && duration !== null ? duration[phase] : duration) ||
            0
        );
        if (value && this.data.nativeDisabled) holdNative(this);
        this.$emit('before-' + phase);
        this.setData({
          inited: true,
          isShowed: true,
          display: true,
          animating: true,
          status: phase,
          currentDuration,
          classes: `smart-${name}-${phase} smart-${name}-${phase}-active ${phase}-class ${phase}-active-class`,
        });
        this.$emit(phase);
        this._lynxFrame = setTimeout(() => {
          if (this._lynxDisposed || revision !== this._lynxTransitionRevision) return;
          this.setData({
            classes: `smart-${name}-${phase}-to smart-${name}-${phase}-active ${phase}-to-class ${phase}-active-class`,
          });
          this._lynxTransition = setTimeout(() => {
            if (this._lynxDisposed || revision !== this._lynxTransitionRevision) return;
            this.setData({ display: value, isShowed: value, animating: false });
            if (!value) releaseNative(this);
            this.$emit('after-' + phase);
          }, currentDuration);
        }, 16);
      },
      enter(this: any) {
        this.observeShow(true);
      },
      leave(this: any) {
        this.observeShow(false);
      },
      checkShowStatus(this: any) {
        if (this.data.display !== this.data.show) this.observeShow(this.data.show);
      },
    },
  });
}

import closeIcon from '@tuya-miniapp/icons/dist/svg/Xmark';
import { SmartComponent } from '../common/component';
import { isIPhoneDuo } from '../common/iphone-duo';
import { transition } from '../mixins/transition';

declare const ty: {
  getSystemInfoSync?: () => {
    screenWidth?: number;
    screenHeight?: number;
  };
  onWindowResize?: (callback: () => void) => void;
  offWindowResize?: (callback: () => void) => void;
};

SmartComponent({
  classes: [
    'enter-class',
    'enter-active-class',
    'enter-to-class',
    'leave-class',
    'leave-active-class',
    'leave-to-class',
    'close-icon-class',
  ],

  mixins: [transition(false)],

  props: {
    round: Boolean,
    closeable: Boolean,
    customStyle: String,
    overlayStyle: String,
    transition: {
      type: String,
      observer: 'observeClass',
    },
    zIndex: {
      type: Number,
      value: 100,
    },
    overlay: {
      type: Boolean,
      value: true,
    },
    closeIcon: {
      type: String,
      value: closeIcon,
    },
    closeIconAriaLabel: {
      type: String,
      value: '',
    },
    closeIconPosition: {
      type: String,
      value: 'top-right',
    },
    closeOnClickOverlay: {
      type: Boolean,
      value: true,
    },
    position: {
      type: String,
      value: 'center',
      observer: 'observeClass',
    },
    safeAreaInsetBottom: {
      type: Boolean,
      value: false,
    },
    safeAreaInsetBottomMin: {
      type: Number,
      value: 0,
    },
    safeAreaInsetTop: {
      type: Boolean,
      value: false,
    },
    safeAreaTabBar: {
      type: Boolean,
      value: false,
    },
    lockScroll: {
      type: Boolean,
      value: true,
    },
    rootPortal: {
      type: Boolean,
      value: false,
    },
    fullCoverView: {
      type: Boolean,
      value: false,
    },
  },

  data: {
    closeIcon,
    duoFullHeight: false,
    duoBottomPopup: false,
    duoTopPopup: false,
    duoOuterDisplay: false,
  },

  watch: {
    'position, customStyle, show'() {
      this.updateDuoLayout();
    },
  },

  created() {
    this.observeClass();
    this.isIPhoneDuo = isIPhoneDuo();
    this.updateDuoLayout();
  },

  destroyed() {
    this.stopDuoResize();
  },

  methods: {
    // for prevent touchmove
    noop() {},

    onClickCloseIcon() {
      this.$emit('close');
    },

    onClickOverlay() {
      this.$emit('click-overlay');

      if (this.data.closeOnClickOverlay) {
        this.$emit('close');
      }
    },

    updateDuoLayout() {
      const { position, customStyle } = this.data;
      const isDuoBottom = position === 'bottom' && !!this.isIPhoneDuo;
      const height = customStyle?.match(/(?:^|;)\s*height\s*:[^;]*/gi)?.pop();
      const fullHeight = /:\s*100(?:%|[dls]?vh)\s*(?:!important\s*)?$/i.test(height || '');
      const duoFullHeight = isDuoBottom && fullHeight;
      const isWindowPopup = !/(?:^|;)\s*position\s*:\s*absolute\b/i.test(customStyle || '');
      const duoBottomPopup = isDuoBottom && isWindowPopup;
      const duoTopPopup = position === 'top' && !!this.isIPhoneDuo && isWindowPopup;
      const trackOuterDisplay = duoTopPopup || duoBottomPopup;

      if (
        duoFullHeight !== this.data.duoFullHeight ||
        duoBottomPopup !== this.data.duoBottomPopup ||
        duoTopPopup !== this.data.duoTopPopup
      ) {
        this.setData({ duoFullHeight, duoBottomPopup, duoTopPopup });
      }

      if (trackOuterDisplay && this.data.show && typeof ty !== 'undefined') {
        this.updateDuoOuterDisplay();
        if (!this.duoResizeHandler && ty.onWindowResize && ty.offWindowResize) {
          this.duoResizeHandler = () => this.updateDuoOuterDisplay();
          ty.onWindowResize(this.duoResizeHandler);
        }
      } else {
        this.stopDuoResize();
        if (!trackOuterDisplay && this.data.duoOuterDisplay) {
          this.setData({ duoOuterDisplay: false });
        }
      }
    },

    updateDuoOuterDisplay() {
      const info = ty.getSystemInfoSync?.();
      const shortSide = Math.min(info?.screenWidth ?? 0, info?.screenHeight ?? 0);
      // The host may deduct its controls from the WebView width, but not the screen size.
      const duoOuterDisplay = shortSide >= 420 && shortSide < 600;
      if (duoOuterDisplay !== this.data.duoOuterDisplay) this.setData({ duoOuterDisplay });
    },

    stopDuoResize() {
      if (typeof ty !== 'undefined' && this.duoResizeHandler) {
        ty.offWindowResize?.(this.duoResizeHandler);
        this.duoResizeHandler = undefined;
      }
    },

    observeClass() {
      const { transition, position, duration } = this.data;

      const updateData: { [key: string]: any } = {
        name: transition || position,
      };

      if (transition === 'none') {
        updateData.duration = 0;
        this.originDuration = duration;
      } else if (this.originDuration != null) {
        updateData.duration = this.originDuration;
      }

      this.setData(updateData);
    },
  },
});

import closeIcon from '@tuya-miniapp/icons/dist/svg/Xmark';
import { SmartComponent } from '../common/component';
import { transition } from '../mixins/transition';
import { getSystemInfoSync } from '../common/utils';

const { safeArea, screenHeight, statusBarHeight } = getSystemInfoSync() || {};

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
      value: true,
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
  },

  data: {
    closeIcon,
    bottomSafeHeight: 0,
  },

  mounted() {
    if (!this.data.safeAreaInsetBottom) return;
    const bottomSafeHeight = screenHeight - safeArea?.height - statusBarHeight;
    this.setData({
      bottomSafeHeight: Math.max(
        bottomSafeHeight,
        this.data.safeAreaInsetBottomMin
      ),
    });
  },

  created() {
    this.observeClass();
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

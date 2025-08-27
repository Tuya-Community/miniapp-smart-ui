import xmarkIcon from '@tuya-miniapp/icons/dist/svg/Xmark';
import { SmartComponent } from '../common/component';
import ty from '../common/ty';

SmartComponent({
  props: {
    show: Boolean,
    title: String,
    iconColor: String,
    nativeDisabled: Boolean,
    maxHeight: null,
    iconSize: {
      type: null,
      value: 24,
    },
    showClose: {
      type: Boolean,
      value: true,
    },
    contentHeight: null,
    round: {
      type: Boolean,
      value: true,
    },
    zIndex: {
      type: Number,
      value: 100,
    },
    overlay: {
      type: Boolean,
      value: true,
    },
    closeOnClickOverlay: {
      type: Boolean,
      value: true,
    },
    rootPortal: {
      type: Boolean,
      value: false,
    },
  },

  data: {
    xmarkIcon,
    xmarkIconColor: 'rgba(0, 0, 0, 0.5)',
  },

  mounted() {
    const themeInfo = ty.getThemeInfo() || {};
    const xmarkIconColor = this.data.iconColor || themeInfo['--app-B4-N3'] || 'rgba(0, 0, 0, 0.5)';
    this.setData({ xmarkIconColor });
  },

  methods: {
    onClose() {
      this.$emit('close');
    },

    onClickOverlay() {
      this.$emit('click-overlay');
      this.onClose();
    },

    onBeforeEnter() {
      this.$emit('before-enter');
    },

    onEnter() {
      this.$emit('enter');
    },

    onAfterEnter() {
      this.$emit('after-enter');
    },

    onBeforeLeave() {
      this.$emit('before-leave');
    },

    onLeave() {
      this.$emit('leave');
    },

    onAfterLeave() {
      this.$emit('after-leave');
    },
  },
});

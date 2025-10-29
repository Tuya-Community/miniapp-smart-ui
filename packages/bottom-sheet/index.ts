import xmarkIcon from '@tuya-miniapp/icons/dist/svg/Xmark';
import { SmartComponent } from '../common/component';
import ty from '../common/ty';
import { getSystemInfoSync } from '../common/version';

const idListRef = {
  value: [] as string[],
};

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
    draggable: {
      type: Boolean,
      value: false,
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
    minDragHeight: {
      type: Number,
      value: 0,
    },
    maxDragHeight: {
      type: Number,
      value: 0,
    },
    midDragHeight: {
      type: Number,
      value: 0,
    },
  },

  data: {
    xmarkIcon,
    xmarkIconColor: 'rgba(0, 0, 0, 0.5)',
    instanceId: '',
    windowHeight: 0,
  },

  mounted() {
    const themeInfo = ty.getThemeInfo() || {};
    const xmarkIconColor = this.data.iconColor || themeInfo['--app-B4-N3'] || 'rgba(0, 0, 0, 0.5)';
    const { windowHeight } = getSystemInfoSync();
    this.setData({ xmarkIconColor, windowHeight });
    this.initId();
  },

  methods: {
    initId() {
      if (this.data.instanceId) return;
      const id = `smart-ui-bottom-sheet_${String(+new Date()).slice(-4)}_${String(
        Math.random()
      ).slice(-2)}`;
      if (idListRef.value.includes(id)) {
        this.initId();
        return;
      }
      this.setData({
        instanceId: id,
      });
      idListRef.value.push(id);
    },
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

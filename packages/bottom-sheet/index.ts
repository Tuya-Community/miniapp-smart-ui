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
    instanceId: String,
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
    closeDragHeight: {
      type: Number,
      value: 0,
    },
    defaultDragPosition: {
      type: String,
      value: 'middle',
    },
  },

  data: {
    xmarkIcon,
    xmarkIconColor: 'rgba(0, 0, 0, 0.5)',
    curInstanceId: '',
    windowHeight: 0,
    currentHeight: 0,
    ts: Date.now(),
  },

  mounted() {
    const themeInfo = ty.getThemeInfo() || {};
    const xmarkIconColor = this.data.iconColor || themeInfo['--app-B4-N3'] || 'rgba(0, 0, 0, 0.5)';
    const { windowHeight } = getSystemInfoSync();
    const currentHeight = this.getDragPosition();

    const data = { xmarkIconColor, windowHeight, ts: Date.now() } as any;
    data.currentHeight = currentHeight;

    this.setData(data);
    this.initId();
  },

  methods: {
    getDragPosition() {
      let currentHeight = this.data.midDragHeight;
      if (this.data.defaultDragPosition === 'middle') {
        currentHeight = this.data.midDragHeight;
      } else if (this.data.defaultDragPosition === 'min') {
        currentHeight = this.data.minDragHeight;
      } else if (this.data.defaultDragPosition === 'max') {
        currentHeight = this.data.maxDragHeight;
      }
      return currentHeight;
    },
    initId() {
      if (this.data.instanceId) {
        this.setData({
          curInstanceId: this.data.instanceId,
        });
        return;
      }
      if (this.data.curInstanceId) return;
      const id = `smart-ui-bottom-sheet_${String(+new Date()).slice(-4)}_${String(
        Math.random()
      ).slice(-2)}`;
      if (idListRef.value.includes(id)) {
        this.initId();
        return;
      }
      this.setData({
        curInstanceId: id,
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
      if (this.data.draggable) {
        const currentHeight = this.getDragPosition();
        this.setData({ currentHeight, ts: Date.now() });
      }
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

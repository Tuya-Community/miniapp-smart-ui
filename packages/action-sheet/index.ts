import checkMarkIcon from '@tuya-miniapp/icons/dist/svg/Checkmark';
import { SmartComponent } from '../common/component';
import ty from '../common/ty';
import { getSafeAreaInsetMin } from '../common/utils';
import { button } from '../mixins/button';

const SAFE_AREA_INSET_BOTTOM_MIN = getSafeAreaInsetMin();

SmartComponent({
  classes: ['list-class'],

  mixins: [button],
  props: {
    show: Boolean,
    title: String,
    cancelText: String,
    confirmText: String,
    description: String,
    activeColor: String,
    nativeDisabled: Boolean,
    useTitleSlot: {
      type: Boolean,
      value: false,
    },
    round: {
      type: Boolean,
      value: true,
    },
    zIndex: {
      type: Number,
      value: 100,
    },
    actions: {
      type: Array,
      value: [],
    },
    overlay: {
      type: Boolean,
      value: true,
    },
    closeOnClickOverlay: {
      type: Boolean,
      value: true,
    },
    closeOnClickAction: {
      type: Boolean,
      value: true,
    },
    safeAreaInsetBottom: {
      type: Boolean,
      value: true,
    },
    safeAreaInsetBottomMin: {
      type: Number,
      value: SAFE_AREA_INSET_BOTTOM_MIN,
    },
    rootPortal: {
      type: Boolean,
      value: false,
    },
  },

  data: {
    checkMarkIcon,
    isWX: ty.isWX(),
  },

  methods: {
    onSelect(event: WechatMiniprogram.TouchEvent) {
      const { index } = event.currentTarget.dataset;
      const { actions, closeOnClickAction, canIUseGetUserProfile } = this.data;
      const item = actions[index];
      if (item) {
        this.$emit('select', item);

        if (closeOnClickAction) {
          this.onClose();
        }

        if (item.openType === 'getUserInfo' && canIUseGetUserProfile) {
          wx.getUserProfile({
            desc: item.getUserProfileDesc || '  ',
            complete: userProfile => {
              this.$emit('getuserinfo', userProfile);
            },
          });
        }
      }
    },

    onCancel() {
      this.$emit('cancel');
    },

    onConfirm() {
      this.$emit('confirm');
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

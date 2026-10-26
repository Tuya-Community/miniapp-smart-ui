import { SmartComponent } from '../common/component';
import { button } from '../mixins/button';

SmartComponent({
  mixins: [button],

  classes: ['hover-class', 'loading-class'],

  data: {
    baseStyle: '',
  },

  props: {
    formType: String,
    icon: String,
    rightIcon: String,
    classPrefix: {
      type: String,
      value: 'smart-icon',
    },
    plain: Boolean,
    block: Boolean,
    round: Boolean,
    square: Boolean,
    loading: Boolean,
    hairline: Boolean,
    disabled: Boolean,
    loadingText: String,
    customStyle: String,
    textStyle: String,
    loadingType: {
      type: String,
      value: 'circular',
    },
    type: {
      type: String,
      value: 'default',
    },
    dataset: null,
    size: {
      type: String,
      value: 'normal',
    },
    loadingSize: {
      type: String,
      value: '20px',
    },
    color: String,
  },

  methods: {
    onClick(event: WechatMiniprogram.TouchEvent) {
      this.$emit('click', event);

      const { canIUseGetUserProfile, openType, getUserProfileDesc, lang } = this.data;

      if (openType === 'getUserInfo' && canIUseGetUserProfile && typeof wx !== 'undefined') {
        wx.getUserProfile({
          desc: getUserProfileDesc || '  ',
          lang: lang || 'en',
          complete: userProfile => {
            this.$emit('getuserinfo', userProfile);
          },
        });
      }
    },
  },
});

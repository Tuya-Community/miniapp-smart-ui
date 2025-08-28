import { SmartComponent } from '../common/component';
import { button } from '../mixins/button';
import Loading from '@tuya-miniapp/icons/dist/svg/Loading';

SmartComponent({
  mixins: [button],

  classes: ['custom-class', 'loading-class', 'error-class', 'image-class'],

  props: {
    src: {
      type: String,
      observer() {
        this.setData({
          error: false,
          loading: true,
        });
      },
    },
    round: Boolean,
    width: null,
    height: null,
    radius: null,
    lazyLoad: Boolean,
    useErrorSlot: Boolean,
    useLoadingSlot: Boolean,
    showMenuByLongpress: Boolean,
    fit: {
      type: String,
      value: 'fill',
    },
    webp: {
      type: Boolean,
      value: false,
    },
    showError: {
      type: Boolean,
      value: true,
    },
    showLoading: {
      type: Boolean,
      value: true,
    },
    tintColor: {
      type: String,
      value: '',
    },
  },

  data: {
    error: false,
    loading: true,
    loadingSvg: Loading,
    viewStyle: '',
  },

  methods: {
    onLoad(event) {
      this.setData({
        loading: false,
      });

      this.$emit('load', event.detail);
    },

    onError(event) {
      this.setData({
        loading: false,
        error: true,
      });

      this.$emit('error', event.detail);
    },

    onClick(event) {
      this.$emit('click', event.detail);
    },
  },
});

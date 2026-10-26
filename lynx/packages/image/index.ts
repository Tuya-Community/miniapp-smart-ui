import { SmartComponent } from '../common/component';
import ty from '../common/ty';
import { normalizeSvg, decodeSvgDataUri, svgDimensions } from '../common/svg-source';
import { button } from '../mixins/button';
import Loading from '@tuya-miniapp/icons/dist/svg/Loading';

SmartComponent({
  mixins: [button],

  classes: ['custom-class', 'loading-class', 'error-class', 'image-class'],

  props: {
    src: {
      type: String,
      observer(src) {
        this.prepareSource(src);
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
      value: false,
    },
    tintColor: {
      type: String,
      value: '',
    },
  },

  created() {
    this.setData({ themeColors: ty.getThemeInfo() || {} });
    this.prepareSource(this.data.src);
  },
  destroyed() {
    this.sourceRevision = (this.sourceRevision || 0) + 1;
    this.sourceRequest?.abort?.();
  },
  data: {
    themeColors: {},
    svgDataUri: '',
    sourceKind: 'bitmap',
    error: false,
    loading: true,
    loadingSvg: Loading,
    viewStyle: '',
    bitmapWidth: 0,
    bitmapHeight: 0,
  },

  methods: {
    prepareSource(src: string) {
      if (this.activeSource === src) return;
      this.activeSource = src;
      const revision = (this.sourceRevision || 0) + 1;
      this.sourceRevision = revision;
      this.sourceRequest?.abort?.();
      const inline = (src || '').indexOf('data:image/svg+xml') === 0;
      const remote = /\.svg(?:$|[?#])/i.test(src || '');
      this.setData({
        error: false,
        loading: true,
        svgDataUri: '',
        bitmapWidth: 0,
        bitmapHeight: 0,
        sourceKind: inline || remote ? 'svg' : 'bitmap',
      });
      const fail = (error: unknown) => {
        if (revision !== this.sourceRevision) return;
        const reason =
          error && typeof error === 'object'
            ? (error as { errMsg?: string; message?: string }).errMsg ||
              (error as { message?: string }).message ||
              JSON.stringify(error)
            : String(error);
        this.onError({ detail: { errMsg: reason } });
      };
      const ready = (xml: string) => {
        if (revision !== this.sourceRevision) return;
        try {
          const normalized = normalizeSvg(xml);
          this.setData({
            svgDataUri: `data:image/svg+xml,${encodeURIComponent(normalized)}`,
            loading: false,
          });
          wx.nextTick(() => {
            if (revision === this.sourceRevision)
              this.$emit('load', { ...svgDimensions(normalized), sourceType: 'svg' });
          });
        } catch (error) {
          fail(error);
        }
      };
      if (inline) {
        try {
          ready(decodeSvgDataUri(src));
        } catch (error) {
          fail(error);
        }
      } else if (remote) {
        if (typeof wx.request !== 'function') {
          fail('SVG network loading requires the host request API');
          return;
        }
        this.sourceRequest = wx.request({
          url: src,
          dataType: 'text' as WechatMiniprogram.RequestOption['dataType'],
          responseType: 'text',
          success: response => {
            if (response.statusCode >= 200 && response.statusCode < 300)
              ready(response.data as string);
            else fail(`SVG request failed: ${response.statusCode}`);
          },
          fail,
        });
      }
    },
    onLoad(event) {
      this.setData({
        bitmapWidth: Number(event.detail?.width) || 0,
        bitmapHeight: Number(event.detail?.height) || 0,
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

/* eslint-disable prefer-destructuring */
import { SmartComponent } from '../common/component';

const IconSrc = () =>
  `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <path d="M 10 90 L 90 90 L 50 30 Z" fill="currentColor" stroke="purple" stroke-width="1"/>
</svg>`;

function createSvgIcon(svg) {
  return `data:image/svg+xml,${encodeURIComponent(
    `<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">${svg}`
  )}`;
}

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

  props: {
    // `top`、`topLeft`、`topRight`、`bottom`、`bottomLeft`、`bottomRight`、`left`、`leftTop`、`leftBottom`、`right`、`rightTop`、`rightBottom`
    placement: {
      type: String,
      value: 'right',
    },
    show: {
      type: Boolean,
      observer(value) {
        if (this.data.cancel_timer) {
          clearTimeout(this.data.cancel_timer);
          this.data.cancel_timer = null as any;
        }

        if (value !== this.data.currentShow) {
          if (value) {
            this.onOpen();
          } else {
            this.onClose();
          }
        }
      },
    },
    customStyle: {
      type: String,
      value: '',
    },
    trigger: {
      type: String,
      // tap | longpress
      value: 'tap',
    },
    zIndex: {
      type: Number,
      value: 101,
    },
    duration: {
      type: Number,
      value: 3000,
    },
  },

  data: { currentShow: false, showStyle: '', cancel_timer: null as any },

  mounted() {},

  created() {},

  methods: {
    getButtonPosition() {
      const placement = this.data.placement;

      let params = {
        // left: rect.left,
        // top: rect.top,
        transform: '',
        iconPos: '',
        iconPosVal: 0,
        iconSrc: createSvgIcon(IconSrc()),
        iconRotate: '0deg',
        iconWidth: '18px',
        iconHeight: '6px',
        iconStyle: '',
      } as any;

      if (placement.startsWith('left')) {
        let iconAlignPos = '';
        let transform = 'translate(-100%,-50%)';
        if (placement === 'leftTop') {
          iconAlignPos = 'top: calc(0% + 16px)';
          transform = 'translate(-100%, 0)';
          params.top = '0px';
          params.left = '-8px';
        } else if (placement === 'leftBottom') {
          iconAlignPos = 'bottom: calc(0% - 6px)';
          transform = 'translate(-100%, -100%)';
          params.left = '-9px';
        } else {
          transform = 'translate(-100%, -50%)';
          params.left = '-9px';
          params.top = '50%';
          iconAlignPos = 'top: 50%';
        }

        params = {
          ...params,
          transform,
          iconSrc: createSvgIcon(IconSrc()),
          iconStyle: `right:8px;transform:translate(100%, -50%) rotate(90deg);width:18px;height:18px;background-size: 18px 18px;${iconAlignPos}`,
        };
      }
      if (placement.startsWith('top')) {
        let iconAlignPos = '';
        let transform = 'translate(-50%, -100%)';
        if (placement === 'topLeft') {
          iconAlignPos = 'left: calc(0% + 16px);';
          transform = 'translate(calc(0% - 16px), -100%)';
          params.top = '-12px';
          params.left = '16px';
        } else if (placement === 'topRight') {
          iconAlignPos = 'left: calc(100% - 16px);';
          transform = 'translate(0, -100%)';
          params.top = '-12px';
          params.right = '2px';
        } else {
          iconAlignPos = 'left: 50%';
          transform = 'translate(-50%, -100%)';
          params.top = '-12px';
          params.left = '50%';
        }
        params = {
          ...params,
          transform,
          iconSrc: createSvgIcon(IconSrc()),
          iconRotate: '0deg',
          iconStyle: `bottom:0px;transform:translate(-50%, 100%) rotate(180deg);width:18px;height:6px;background-size: 18px 6px;${iconAlignPos}`,
        };
      }
      if (placement.startsWith('right')) {
        let iconAlignPos = '';
        let transform = 'translateY(-50%)';
        if (placement === 'rightTop') {
          iconAlignPos = 'top: calc(0% + 16px)';
          transform = `translate(0%,0)`;
          params.left = 'calc(100% + 8px)';
          params.top = '2px';
        } else if (placement === 'rightBottom') {
          iconAlignPos = 'top: calc(100% - 12px)';
          transform = `translate(0%,0)`;
          params.left = 'calc(100% + 8px)';
          params.bottom = '2px';
        } else {
          iconAlignPos = 'top: 50%';
          transform = `translate(0%, -50%)`;
          params.left = 'calc(100% + 8px)';
          params.top = '50%';
        }

        params = {
          ...params,
          transform,
          iconSrc: createSvgIcon(IconSrc()),
          iconRotate: '90deg',
          iconStyle: `left:-10px;transform:translate(0%, -50%) rotate(-90deg);width:18px;height:18px;background-size: 18px 18px;${iconAlignPos};`,
        };
      }
      if (placement.startsWith('bottom')) {
        let iconAlignPos = '';
        let transform = 'translateX(-50%)';
        if (placement === 'bottomLeft') {
          iconAlignPos = 'left: calc(0% + 16px);';
          transform = 'translate(calc(0% - 16px), 100%)';
          params.bottom = '-10px';
          params.left = '18px';
        } else if (placement === 'bottomRight') {
          iconAlignPos = 'left: calc(100% - 16px);';
          transform = 'translate(0, 100%)';
          params.bottom = '-10px';
          params.right = '2px';
        } else {
          iconAlignPos = 'left: 50%';
          transform = 'translate(-50%, 100%)';
          params.bottom = '-10px';
          params.left = '50%';
        }

        params = {
          ...params,
          transform,
          iconSrc: createSvgIcon(IconSrc()),
          iconRotate: '180deg',
          iconStyle: `top:0px;transform:translate(-50%, -100%) rotate(0deg);width:18px;height:6px;background-size: 18px 6px;${iconAlignPos}`,
        };
      }

      this.setData(params);
    },
    onClick() {
      this.onOpen();
    },
    noop() {},

    onOpen() {
      this.getButtonPosition();
      this.setData({
        currentShow: true,
      });

      setTimeout(() => {
        this.setData({
          showStyle: 'opacity: 1;',
        });
      }, 100);

      this.$emit('show-change', true);
      if (this.data.duration) {
        this.data.cancel_timer = setTimeout(() => {
          this.onClose();
        }, this.data.duration);
      }
    },
    onClose() {
      if (this.data.cancel_timer) {
        clearTimeout(this.data.cancel_timer);
        this.data.cancel_timer = null as any;
      }

      this.setData({
        showStyle: 'opacity: 0;',
      });

      setTimeout(() => {
        this.setData({
          currentShow: false,
        });
        this.$emit('show-change', false);
        this.$emit('close', false);
      }, 300);
    },
  },
});

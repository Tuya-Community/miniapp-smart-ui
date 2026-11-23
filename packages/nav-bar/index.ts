import Left from '@tuya-miniapp/icons/dist/svg/Left';
import { SmartComponent } from '../common/component';
import { getRect } from '../common/utils';

declare const ty: {
  getMenuButtonBoundingClientRectSync?: () => { left: number; right: number } | undefined;
  onWindowResize?: (callback: () => void) => void;
  offWindowResize?: (callback: () => void) => void;
};

const menuLayout = Behavior({
  definitionFilter(options) {
    options.pageLifetimes = {
      ...options.pageLifetimes,
      show(this: { updateMenuLayout(): void }) {
        this.updateMenuLayout();
      },
    };
  },
});

SmartComponent({
  mixins: [menuLayout],
  classes: [
    'title-class',
    'right-text-class',
    'left-icon-class',
    'right-icon-class',
    'left-text-class',
  ],

  props: {
    title: String,
    sideWidth: {
      type: null,
      value: 'max',
    },
    fixed: Boolean,
    placeholder: Boolean,
    background: String,
    leftTextType: {
      type: String,
      value: 'back',
    },
    avoidMenuButton: {
      type: null,
      value: null,
    },
    leftText: String,
    leftIcon: String,
    leftIconColor: String,
    leftIconSize: {
      type: null,
      value: 32,
    },
    rightText: String,
    rightTextColor: String,
    rightIcon: String,
    rightIconColor: String,
    rightIconSize: {
      type: null,
      value: 32,
    },
    customStyle: String,
    leftArrow: Boolean,
    border: {
      type: Boolean,
      value: false,
    },
    round: {
      type: Boolean,
      value: false,
    },
    zIndex: {
      type: Number,
      value: 1,
    },
    safeAreaInsetTop: {
      type: Boolean,
      value: true,
    },
    leftArrowAriaLabel: {
      type: String,
      value: '',
    },
    leftIconAriaLabel: {
      type: String,
      value: '',
    },
    rightIconAriaLabel: {
      type: String,
      value: '',
    },
  },

  data: {
    leftArrowIcon: Left,
    menuReservedWidth: null as number | null,
  },

  watch: {
    'leftTextType, avoidMenuButton'() {
      this.updateMenuLayout();
    },
  },

  mounted() {
    this.updateMenuLayout();
    if (typeof ty !== 'undefined' && ty.onWindowResize && ty.offWindowResize) {
      this.menuResizeHandler = () => this.updateMenuLayout();
      ty.onWindowResize(this.menuResizeHandler);
    }
  },

  destroyed() {
    this.menuLayoutRevision = (this.menuLayoutRevision || 0) + 1;
    if (typeof ty !== 'undefined' && this.menuResizeHandler) {
      ty.offWindowResize?.(this.menuResizeHandler);
    }
  },

  methods: {
    async updateMenuLayout() {
      const revision = (this.menuLayoutRevision || 0) + 1;
      this.menuLayoutRevision = revision;
      const { avoidMenuButton, leftTextType } = this.data;
      const shouldAvoidMenu = avoidMenuButton ?? leftTextType === 'home';
      let menuReservedWidth: number | null = null;

      if (shouldAvoidMenu && typeof ty !== 'undefined') {
        try {
          const menu = ty.getMenuButtonBoundingClientRectSync?.();
          if (menu && Number.isFinite(menu.left) && menu.left > 0 && menu.right > menu.left) {
            const bar = await getRect(this, '.smart-nav-bar__content');
            if (bar?.width > 0) {
              menuReservedWidth = Math.min(bar.width, Math.max(0, bar.right - menu.left));
            }
          }
        } catch {
          // Older hosts may not return a menu rectangle. Keep the default spacing.
        }
      }

      if (
        revision === this.menuLayoutRevision &&
        menuReservedWidth !== this.data.menuReservedWidth
      ) {
        this.setData({ menuReservedWidth });
      }
    },

    onClickLeft() {
      this.$emit('click-left');
    },

    onClickRight() {
      this.$emit('click-right');
    },

    onClickTitle() {
      this.$emit('click-title');
    },

    onClickRightIcon() {
      this.$emit('click-right-icon');
    },

    onClickLeftIcon() {
      this.$emit('click-left-icon');
    },

    onClickLeftText() {
      this.$emit('click-left-text');
    },

    onClickRightText() {
      this.$emit('click-right-text');
    },
  },
});

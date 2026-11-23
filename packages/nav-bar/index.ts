import Left from '@tuya-miniapp/icons/dist/svg/Left';
import { SmartComponent } from '../common/component';
import { getCurrentPage, getRect } from '../common/utils';
import { PageWithShow, subscribeToPageShow } from './page-show';

type WindowResize = {
  type?: string;
  size?: { windowWidth?: number | string };
};

declare const ty: {
  getSystemInfoSync?: () => {
    model?: string;
    deviceOrientation?: string;
    useableWindowWidth?: number;
    windowWidth?: number;
  };
  getMenuButtonBoundingClientRectSync?: () => { left: number; right: number } | undefined;
  onWindowResize?: (callback: (event?: WindowResize) => void) => void;
  offWindowResize?: (callback: (event?: WindowResize) => void) => void;
};

SmartComponent({
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
    duoPortraitMenu: false,
  },

  watch: {
    'leftTextType, avoidMenuButton'() {
      this.syncMenuPageShow();
      this.updateMenuLayout();
    },
  },

  mounted() {
    if (typeof ty !== 'undefined' && ty.getMenuButtonBoundingClientRectSync) {
      const model = ty.getSystemInfoSync?.()?.model;
      this.isIPhoneDuo = model === 'iPhone19,4' || model === 'iPhone Duo';
      this.menuLayoutPage = getCurrentPage<PageWithShow>();
      this.syncMenuPageShow();
    }
    this.updateMenuLayout();
    if (typeof ty !== 'undefined' && ty.onWindowResize && ty.offWindowResize) {
      this.menuResizeHandler = (event?: WindowResize) => this.updateMenuLayout(event);
      ty.onWindowResize(this.menuResizeHandler);
    }
  },

  destroyed() {
    this.menuLayoutRevision = (this.menuLayoutRevision || 0) + 1;
    this.stopMenuPageShow?.();
    if (typeof ty !== 'undefined' && this.menuResizeHandler) {
      ty.offWindowResize?.(this.menuResizeHandler);
    }
  },

  methods: {
    shouldAvoidMenu() {
      const { avoidMenuButton, leftTextType } = this.data;
      return avoidMenuButton ?? leftTextType === 'home';
    },

    syncMenuPageShow() {
      if (!this.menuLayoutPage) return;
      if (this.shouldAvoidMenu() || (this.isIPhoneDuo && this.data.avoidMenuButton == null)) {
        // Some hosts skip component pageLifetimes for nested components.
        if (!this.stopMenuPageShow) {
          this.stopMenuPageShow = subscribeToPageShow(this.menuLayoutPage, () =>
            this.updateMenuLayout()
          );
        }
      } else if (this.stopMenuPageShow) {
        this.stopMenuPageShow();
        this.stopMenuPageShow = undefined;
      }
    },

    async updateMenuLayout(event?: WindowResize) {
      const revision = (this.menuLayoutRevision || 0) + 1;
      this.menuLayoutRevision = revision;
      let menuReservedWidth: number | null = null;
      let duoPortraitMenu = false;

      if (typeof ty !== 'undefined') {
        try {
          const avoidMenu = this.shouldAvoidMenu();
          let alignMenuRight = false;
          if (!avoidMenu && this.isIPhoneDuo && this.data.avoidMenuButton == null) {
            const info = ty.getSystemInfoSync?.();
            const orientation = event?.type ?? info?.deviceOrientation;
            const width = Number(
              event?.size?.windowWidth ?? info?.useableWindowWidth ?? info?.windowWidth
            );
            alignMenuRight = orientation === 'portrait' && Number.isFinite(width) && width >= 600;
          }

          if (avoidMenu || alignMenuRight) {
            const menu = ty.getMenuButtonBoundingClientRectSync?.();
            if (
              menu &&
              Number.isFinite(menu.left) &&
              menu.left > 0 &&
              menu.right > menu.left &&
              (!alignMenuRight || Number.isFinite(menu.right))
            ) {
              const bar = await getRect(this, '.smart-nav-bar__content');
              if (bar?.width > 0) {
                const rightBoundary = alignMenuRight ? menu.right : menu.left;
                menuReservedWidth = Math.min(bar.width, Math.max(0, bar.right - rightBoundary));
                duoPortraitMenu = alignMenuRight;
              }
            }
          }
        } catch {
          // Older hosts may not return a menu rectangle. Keep the default spacing.
        }
      }

      if (
        revision === this.menuLayoutRevision &&
        (menuReservedWidth !== this.data.menuReservedWidth ||
          duoPortraitMenu !== this.data.duoPortraitMenu)
      ) {
        this.setData({ menuReservedWidth, duoPortraitMenu });
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

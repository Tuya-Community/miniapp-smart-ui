import Left from '@tuya-miniapp/icons/dist/svg/Left';
import { SmartComponent } from '../common/component';
import { isIPhoneDuo } from '../common/iphone-duo';
import { getCurrentPage, getRect } from '../common/utils';
import { PageWithShow, subscribeToPageShow } from './page-show';

type WindowResize = {
  type?: string;
  size?: { windowWidth?: number | string };
};

type WindowInfo = {
  deviceOrientation?: string;
  useableWindowWidth?: number;
  windowWidth?: number;
};

type MenuRect = { left: number; right: number; top?: number; height?: number };

declare const ty: {
  getSystemInfoSync?: () => WindowInfo;
  getMenuButtonBoundingClientRectSync?: () => MenuRect | undefined;
  onWindowResize?: (callback: (event?: WindowResize) => void) => void;
  offWindowResize?: (callback: (event?: WindowResize) => void) => void;
};

const DUO_PORTRAIT_MENU_CENTER = 48;

function isDuoPortrait(info?: WindowInfo, event?: WindowResize) {
  const orientation = event?.type ?? info?.deviceOrientation;
  const width = Number(event?.size?.windowWidth ?? info?.useableWindowWidth ?? info?.windowWidth);
  return orientation === 'portrait' && Number.isFinite(width) && width >= 600;
}

function getMenuCenter(menu?: MenuRect | null) {
  const { top, height } = menu || {};
  if (
    typeof top === 'number' &&
    Number.isFinite(top) &&
    typeof height === 'number' &&
    Number.isFinite(height) &&
    height > 0
  ) {
    return top + height / 2;
  }
  return null;
}

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
    duo: false,
    menuReservedWidth: null as number | null,
    menuCenter: null as number | null,
    titleInset: null as number | null,
    duoCenteredTitle: false,
    duoPortraitMenu: false,
  },

  watch: {
    'leftTextType, avoidMenuButton'() {
      if (this.data.duo) this.updateMenuLayout();
    },
    'title, leftText, leftArrow, leftIcon, leftIconSize, rightText, rightIcon, rightIconSize, sideWidth'() {
      if (this.data.duo) this.updateMenuLayout();
    },
  },

  created() {
    if (!isIPhoneDuo()) return;
    const duoPortrait = isDuoPortrait(ty.getSystemInfoSync?.());
    let menuCenter: number | null = null;
    if (this.data.fixed && duoPortrait) {
      // A fixed bar starts at the same viewport origin as the system controls.
      menuCenter = DUO_PORTRAIT_MENU_CENTER;
      try {
        menuCenter = getMenuCenter(ty.getMenuButtonBoundingClientRectSync?.()) ?? menuCenter;
      } catch {
        // Keep the portrait center until the host can return the menu rectangle.
      }
    }
    this.setData({
      duo: true,
      menuCenter,
      duoCenteredTitle: duoPortrait && this.data.leftTextType !== 'home',
    });
  },

  mounted() {
    if (!this.data.duo) return;
    const page = getCurrentPage<PageWithShow>();
    if (page) this.stopMenuPageShow = subscribeToPageShow(page, () => this.updateMenuLayout());
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

    async updateMenuLayout(event?: WindowResize) {
      const revision = (this.menuLayoutRevision || 0) + 1;
      this.menuLayoutRevision = revision;
      let menuReservedWidth: number | null = null;
      let menuCenter: number | null = null;
      let duoPortrait = false;
      let duoPortraitMenu = false;

      if (typeof ty !== 'undefined') {
        try {
          const avoidMenu = this.shouldAvoidMenu();
          duoPortrait = isDuoPortrait(ty.getSystemInfoSync?.(), event);
          if (duoPortrait && this.data.fixed) menuCenter = DUO_PORTRAIT_MENU_CENTER;

          const alignMenuRight = duoPortrait && !avoidMenu && this.data.avoidMenuButton == null;
          const menu = avoidMenu || duoPortrait ? ty.getMenuButtonBoundingClientRectSync?.() : null;
          if (menu) {
            const center = duoPortrait ? getMenuCenter(menu) : null;
            if (center !== null) {
              if (this.data.fixed) {
                menuCenter = center;
              } else {
                const bar = await getRect(this, '.smart-nav-bar');
                // Inline nav bars below the system controls keep their own vertical alignment.
                if (bar?.height > 0 && center >= bar.top && center <= bar.bottom) {
                  menuCenter = center - bar.top;
                }
              }
            }
            if (
              (avoidMenu || alignMenuRight) &&
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

      if (revision !== this.menuLayoutRevision) return;
      const duoCenteredTitle = duoPortrait && this.data.leftTextType !== 'home';
      const measureTitle = () => {
        if (duoCenteredTitle) this.updateTitleInset(revision);
      };
      if (
        menuReservedWidth !== this.data.menuReservedWidth ||
        menuCenter !== this.data.menuCenter ||
        duoCenteredTitle !== this.data.duoCenteredTitle ||
        duoPortraitMenu !== this.data.duoPortraitMenu
      ) {
        const titleInset = duoCenteredTitle ? this.data.titleInset : null;
        this.setData(
          { menuReservedWidth, menuCenter, duoCenteredTitle, duoPortraitMenu, titleInset },
          measureTitle
        );
      } else {
        measureTitle();
      }
    },

    async updateTitleInset(revision: number) {
      if (revision !== this.menuLayoutRevision) return;
      const [bar, left, right] = await Promise.all([
        getRect(this, '.smart-nav-bar__content'),
        getRect(this, '.smart-nav-bar__left'),
        getRect(this, '.smart-nav-bar__right'),
      ]);
      if (revision !== this.menuLayoutRevision || !bar?.width || !left) return;

      // Reserve the same space on both sides of the title, including the host controls.
      const hostInset = this.shouldAvoidMenu() ? (this.data.menuReservedWidth ?? 98) : 0;
      const rightInset = right?.height ? bar.right - right.left : hostInset;
      const titleInset = Math.max(left.right - bar.left, rightInset) + 16;
      if (titleInset !== this.data.titleInset) this.setData({ titleInset });
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

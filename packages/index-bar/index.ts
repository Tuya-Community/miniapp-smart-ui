import { GREEN } from '../common/color';
import { SmartComponent } from '../common/component';
import { useChildren } from '../common/relation';
import { getRect, isDef } from '../common/utils';
import { pageScrollMixin } from '../mixins/page-scroll';
import iconSvg from './icon';
import ty from '../common/ty';

const indexList = () => {
  const indexList: string[] = [];
  const charCodeOfA = 'A'.charCodeAt(0);

  for (let i = 0; i < 26; i++) {
    indexList.push(String.fromCharCode(charCodeOfA + i));
  }

  return indexList;
};

SmartComponent({
  relation: useChildren('index-anchor', function () {
    this.updateData();
  }),

  props: {
    scrollable: {
      type: Boolean,
      value: false,
    },
    sticky: {
      type: Boolean,
      value: true,
    },
    sidebarFontSize: {
      type: String,
    },
    sidebarLineHeight: {
      type: String,
    },
    zIndex: {
      type: Number,
      value: 1,
    },
    highlightColor: {
      type: String,
      value: GREEN,
    },
    stickyOffsetTop: {
      type: Number,
      value: 0,
    },
    indexList: {
      type: Array,
      value: indexList(),
    },
    showMoveTip: {
      type: Boolean,
      value: false,
    },
  },

  mixins: [
    pageScrollMixin(function (event) {
      this.scrollTop = event?.scrollTop || 0;
      this.onScroll();
    }),
  ],

  data: {
    iconSvg,
    activeAnchorIndexData: null,
    showSidebar: false,
    showMoveIcon: false,
    lowestActiveIndex: -1,
    currentMoveIconText: '',
    moveTipTop: 0,
  },

  // @ts-ignore
  pendingAnchor: null,
  // 用于过滤 clientY 偶现跳变：保留最近 3 次有效值，与其中至少 2 个都超阈值才判定本帧为异常
  lastValidOffsetYHistory: null,
  preMoveTipTop: null,

  watch: {
    moveTipTop(newVal) {
      if (this.preMoveTipTop === null) {
        this.preMoveTipTop = newVal;
      }
      if (newVal !== null && newVal !== 0 && newVal !== this.preMoveTipTop) {
        ty.vibrateShort({ type: 'light' });
        this.preMoveTipTop = newVal;
      }
    },
  },

  created() {
    this.scrollTop = 0;
  },

  methods: {
    updateData() {
      // 列表更新时重置记录的最低滚动节点
      this.setData({
        lowestActiveIndex: -1,
      });
      wx.nextTick(() => {
        if (this.timer != null) {
          clearTimeout(this.timer);
        }

        this.timer = setTimeout(() => {
          this.setData({
            showSidebar: !!this.children.length,
          });

          this.setRect().then(() => {
            this.computeLowestActiveIndex();
            this.onScroll();
          });
        }, 0);
      });
    },

    setRect() {
      return Promise.all([
        this.setAnchorsRect(),
        this.setListRect(),
        this.setSidebarRect(),
        this.getPageHeight(),
      ]);
    },

    setAnchorsRect() {
      return Promise.all(
        this.children.map(anchor =>
          getRect(anchor, '.smart-index-anchor-wrapper').then(rect => {
            Object.assign(anchor, {
              height: rect.height,
              top: rect.top + this.scrollTop,
            });
          })
        )
      );
    },

    getPageHeight() {
      return new Promise(resolve => {
        const query = wx.createSelectorQuery();
        query.selectViewport().scrollOffset(); // 也可以使用 .boundingClientRect()
        query.exec(res => {
          resolve(res[0].scrollHeight);
          Object.assign(this, {
            pageHeight: res[0].scrollHeight,
          });
        });
      });
    },

    setListRect() {
      return getRect(this, '.smart-index-bar').then(rect => {
        if (!isDef(rect)) {
          return;
        }
        Object.assign(this, {
          height: rect.height,
          top: rect.top + this.scrollTop,
        });
      });
    },

    setSidebarRect() {
      return getRect(this, '.smart-index-bar__sidebar').then(res => {
        if (!isDef(res)) {
          return;
        }
        this.sidebar = {
          height: res.height,
          top: res.top,
        };
      });
    },

    /**
     * 用视口高度与内容高度几何计算「能滚动到吸顶位置」的最底部锚点索引，
     * 用于 scrollToAnchor 时限制目标索引，避免点击无法滚到顶的锚点。
     */
    computeLowestActiveIndex() {
      const { children } = this;
      if (!children || children.length === 0) {
        this.setData({ lowestActiveIndex: -1 });
        return;
      }
      const { stickyOffsetTop } = this.data;
      // 页面滚动内容总高度 = 最后一个锚点的 top + height（与 setAnchorsRect 中存的一致：文档坐标）
      const contentHeight = this.pageHeight;
      const sysInfo = wx.getSystemInfoSync && wx.getSystemInfoSync();
      // @ts-ignore
      const viewportHeight = (sysInfo && sysInfo.useableWindowHeight) || sysInfo.windowHeight;
      const maxScrollTop = Math.max(0, contentHeight - viewportHeight);
      // 锚点 i 能滚到吸顶 ⟺ 所需 scrollTop = anchor[i].top - stickyOffsetTop ≤ maxScrollTop
      // 即 anchor[i].top ≤ maxScrollTop + stickyOffsetTop；从后往前取第一个满足的 i
      let lowest = -1;
      for (let i = children.length - 1; i >= 0; i--) {
        if (children[i].top <= maxScrollTop + stickyOffsetTop) {
          lowest = i;
          break;
        }
      }
      this.setData({ lowestActiveIndex: lowest });
    },

    setDiffData({ target, data }) {
      const diffData = {};

      Object.keys(data).forEach(key => {
        if (target.data[key] !== data[key]) {
          diffData[key] = data[key];
        }
      });

      if (Object.keys(diffData).length) {
        target.setData(diffData);
      }
    },

    getAnchorRect(anchor) {
      return getRect(anchor, '.smart-index-anchor-wrapper').then(rect => ({
        height: rect.height,
        top: rect.top,
      }));
    },

    getChildrenIndexList() {
      return this.children.map(item => item.data.index);
    },

    getActiveAnchorIndex() {
      const { children, scrollTop } = this;
      const { sticky, stickyOffsetTop } = this.data;

      for (let i = this.children.length - 1; i >= 0; i--) {
        const preAnchorHeight = i > 0 ? children[i - 1].height : 0;
        const reachTop = sticky ? preAnchorHeight + stickyOffsetTop : 0;

        if (reachTop + scrollTop >= children[i].top) {
          return i;
        }
      }

      return -1;
    },

    onScroll(controlActiveIndexData?: string) {
      const { children = [], scrollTop } = this;

      if (!children.length) {
        return;
      }

      const hasIndex = controlActiveIndexData !== undefined;
      const scrollChildrenGetIndex = this.getActiveAnchorIndex();
      const scrollChildrenGetIndexData = this.children[scrollChildrenGetIndex].data.index;
      // 程序化滚动（如 sidebar 点击）未完成时，不根据当前 scrollTop 更新 UI，
      // 避免 scrollTop 已变而 anchor 几何未重测导致 getActiveAnchorIndex 算错引发闪动。
      // 滚动结束后在 scrollToAnchor 的 then 里会 setRect + onScroll 做一次正确更新。
      if (this.pendingAnchor && this.pendingAnchor.length > 0 && !hasIndex) {
        return;
      }
      // lowestActiveIndex 已改为在 setRect 后由 computeLowestActiveIndex() 几何计算，此处不再根据滚动推断

      const { sticky, stickyOffsetTop, zIndex, highlightColor } = this.data;

      const activeData = hasIndex ? controlActiveIndexData : scrollChildrenGetIndexData;
      const activeIndex = this.children.findIndex(item => item.data.index === activeData);
      const preActiveData = this.children[activeIndex - 1]?.data?.index;

      this.setDiffData({
        target: this,
        data: {
          activeAnchorIndexData: activeData,
        },
      });

      if (sticky) {
        let isActiveAnchorSticky = false;

        if (activeData !== null) {
          isActiveAnchorSticky =
            children.find(item => item.data.index === activeData)?.top <=
            stickyOffsetTop + scrollTop;
        }
        children.forEach((item, index) => {
          const itemData = item.data.index;
          // 为当前的 anchor 设置 fixed 吸顶和文字颜色
          if (itemData === activeData) {
            let wrapperStyle = '';
            let anchorStyle = `
              color: ${highlightColor};
            `;

            if (isActiveAnchorSticky) {
              wrapperStyle = `
                height: ${children[index].height}px;
              `;

              anchorStyle = `
                position: fixed;
                top: ${stickyOffsetTop}px;
                z-index: ${zIndex};
                color: ${highlightColor};
              `;
            }

            this.setDiffData({
              target: item,
              data: {
                active: true,
                anchorStyle,
                wrapperStyle,
              },
            });
            // 滚动模式时 上一个tab 要有种慢慢被滚动切换的效果
          } else if (preActiveData === itemData && !hasIndex) {
            const currentAnchor = children[index];

            const currentOffsetTop = currentAnchor.top;
            const targetOffsetTop =
              index === children.length - 1 ? this.top : children[index + 1].top;

            const parentOffsetHeight = targetOffsetTop - currentOffsetTop;
            const translateY = parentOffsetHeight - currentAnchor.height;

            const anchorStyle = `
              position: relative;
              transform: translate3d(0, ${translateY}px, 0);
              z-index: ${zIndex};
              color: ${highlightColor};
            `;
            this.setDiffData({
              target: item,
              data: {
                active: true,
                anchorStyle,
              },
            });
          } else {
            // 其他恢复原样
            this.setDiffData({
              target: item,
              data: {
                active: false,
                anchorStyle: '',
                wrapperStyle: '',
              },
            });
          }
        });
      }
    },

    onClick(event) {
      ty.vibrateShort({ type: 'light' });
      this.scrollToAnchor(event.target.dataset.item);
    },

    onTouchMove(event) {
      if (!this.data.scrollable) return;
      const sidebarLength = this.data.indexList.length;
      const touch = event.touches[0];
      let offsetY = touch.clientY - this.sidebar.top;
      const threshold = this.sidebar.height * 0.25;
      if (!this.lastValidOffsetYHistory) {
        this.lastValidOffsetYHistory = [];
      }
      const nearCount = this.lastValidOffsetYHistory.filter(
        h => Math.abs(offsetY - h) < threshold
      ).length;
      // 与最近 3 次中至少 2 个都超阈值则判定本帧为异常，沿用上次有效值
      if (this.lastValidOffsetYHistory.length === 3 && nearCount < 2) {
        return;
      }
      this.lastValidOffsetYHistory.push(offsetY);
      if (this.lastValidOffsetYHistory.length > 3) this.lastValidOffsetYHistory.shift();
      offsetY = Math.max(0, Math.min(offsetY, this.sidebar.height));
      const itemHeight = this.sidebar.height / sidebarLength;
      const index = Math.floor(offsetY / itemHeight);
      const indexData = this.data.indexList[index];
      this.setData({
        showMoveIcon: true,
        moveTipTop: index * itemHeight + itemHeight / 2,
        currentMoveIconText: indexData,
      });
      this.scrollToAnchor(indexData);
    },

    onTouchStop() {
      if (!this.data.scrollable) return;
      this.setData({
        showMoveIcon: false,
      });
      this.scrollToAnchorIndexData = null;
      this.lastValidOffsetYHistory = [];
    },

    scrollToAnchor(indexData: string) {
      if (typeof indexData !== 'string' || this.scrollToAnchorIndexData === indexData) {
        return;
      }
      const childrenIndex = this.children.findIndex(item => item.data.index === indexData);
      const anchor = this.children[childrenIndex];
      const safeIndex =
        this.data.lowestActiveIndex !== -1 && childrenIndex > this.data.lowestActiveIndex
          ? this.data.lowestActiveIndex
          : childrenIndex;

      const safeAnchor = this.children[safeIndex];
      if (!safeAnchor) {
        console.log('没有找到锚点');
        return;
      }
      // 如果当前有正在进行的滚动，将新的滚动任务加入队列
      if (!this.pendingAnchor) {
        this.pendingAnchor = [];
      }
      if (this.pendingAnchor.length > 0) {
        this.pendingAnchor = [anchor];
        return;
      }
      this.pendingAnchor = [anchor];
      this.scrollToAnchorIndexData = indexData;
      safeAnchor
        .scrollIntoView(this.scrollTop)
        .then(() => {
          this.onScroll(safeAnchor.data.index);
          if (this.pendingAnchor.length > 0 && this.pendingAnchor[0] !== anchor) {
            const index = this.data.indexList.indexOf(this.pendingAnchor[0].data.index);
            this.pendingAnchor = [];
            this.scrollToAnchor(index);
            return;
          }
          this.pendingAnchor = [];
        })
        .catch(err => {
          console.error(err);
          if (this.pendingAnchor.length > 0 && this.pendingAnchor[0] !== anchor) {
            const index = this.data.indexList.indexOf(this.pendingAnchor[0].data.index);
            this.pendingAnchor = [];
            this.scrollToAnchor(index);
            return;
          }
          this.pendingAnchor = [];
        });
      this.$emit('select', anchor.data.index);
    },
  },
});

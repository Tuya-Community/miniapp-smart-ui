import { getRect } from '../common/utils';
import { SmartComponent } from '../common/component';
import { useParent } from '../common/relation';

SmartComponent({
  relation: useParent('index-bar'),

  props: {
    useSlot: Boolean,
    index: null,
  },

  data: {
    active: false,
    wrapperStyle: '',
    anchorStyle: '',
  },

  methods: {
    scrollIntoView(scrollTop) {
      getRect(this, '.smart-index-anchor-wrapper').then((rect) => {
        wx.pageScrollTo({
          duration: 0,
          scrollTop: scrollTop + rect.top - this.parent.data.stickyOffsetTop,
        });
      });
    },
  },
});

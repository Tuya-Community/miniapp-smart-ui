import { SmartComponent } from '../common/component';
import { useChildren } from '../common/relation';

SmartComponent({
  relation: useChildren('goods-action-button', function () {
    this.children.forEach(item => {
      setTimeout(() => {
        item.updateStyle();
      }, 0);
    });
  }),

  props: {
    safeAreaInsetBottom: {
      type: Boolean,
      value: true,
    },
  },
});

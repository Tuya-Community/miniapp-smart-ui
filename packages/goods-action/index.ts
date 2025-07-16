import { SmartComponent } from '../common/component';
import { useChildren } from '../common/relation';

SmartComponent({
  relation: useChildren('goods-action-button', function () {
    this.children.forEach((item) => {
      item.updateStyle();
    });
  }),

  props: {
    safeAreaInsetBottom: {
      type: Boolean,
      value: true,
    },
  },
});

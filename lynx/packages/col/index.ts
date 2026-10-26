import { useParent } from '../common/relation';
import { SmartComponent } from '../common/component';

SmartComponent({
  relation: useParent('row'),

  props: {
    span: Number,
    offset: Number,
  },
});

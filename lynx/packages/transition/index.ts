import { SmartComponent } from '../common/component';
import { transition } from '../mixins/transition';

SmartComponent({
  classes: [
    'enter-class',
    'enter-active-class',
    'enter-to-class',
    'leave-class',
    'leave-active-class',
    'leave-to-class',
  ],

  mixins: [transition(true)],
});

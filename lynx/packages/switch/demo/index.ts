import { SmartComponent } from '../../common/component';
import Dialog from '../../dialog/dialog';

SmartComponent({
  data: {
    checked: true,
    checked2: true,
  },

  methods: {
    onChange({ detail }) {
      this.setData({ checked: detail });
    },

    onChange2({ detail }) {
      Dialog.confirm({
        context: this,
        title: I18n.t('prompt'),
        message: I18n.t('doYouWantToToggleTheSwitch'),
      }).then(() => {
        this.setData({ checked2: detail });
      });
    },

    onClick() {
      Dialog.confirm({
        context: this,
        title: I18n.t('hint'),
        message: I18n.t('bubbleEvent'),
      });
    },
  },
});

import { SmartComponent } from '../../common/component';

SmartComponent({
  data: {
    switchTitle1: I18n.t('freeShipping'),
    switchTitle2: I18n.t('groupBuy'),
    itemTitle: I18n.t('filter'),
    option1: [
      { text: I18n.t('allProducts'), value: 0 },
      { text: I18n.t('newProduct'), value: 1 },
      { text: I18n.t('promotionalItems'), value: 2 },
    ],
    option2: [
      { text: I18n.t('defaultSorting'), value: 'a' },
      { text: I18n.t('sortByPositiveReviews'), value: 'b' },
      { text: I18n.t('sortBySales'), value: 'c' },
    ],
    switch1: true,
    switch2: false,
    value1: 0,
    value2: 'a',
  },

  methods: {
    onConfirm() {
      this.selectComponent('#item').toggle();
    },

    onSwitch1Change({ detail }) {
      this.setData({ switch1: detail });
    },

    onSwitch2Change({ detail }) {
      this.setData({ switch2: detail });
    },
    onBeforeChange({ detail: { status, callback } }) {
      wx.showModal({
        title: I18n.t('asynchronousOnOff'),
        content: `${I18n.t('areYouSureYouWantTo')}${status ? I18n.t('open') : I18n.t('close')}${I18n.t('dropdownMenu')}`,
        success: (res) => {
          if (res.confirm) {
            callback(true);
          } else if (res.cancel) {
            callback(false);
          }
        },
      });
    },
  },
});

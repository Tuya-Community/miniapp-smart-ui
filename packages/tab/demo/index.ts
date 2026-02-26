import { SmartComponent } from '../../common/component';
import SearchIcon from '@tuya-miniapp/icons/dist/svg/Search';

SmartComponent({
  data: {
    SearchIcon,
    tabs2: [1, 2],
    tabs3: [1, 2, 3],
    tabs4: [1, 2, 3, 4],
    tabs6: [1, 2, 3, 4, 5, 6],
    tabsWithName: [
      { name: 'a', index: 1 },
      { name: 'b', index: 2 },
      { name: 'c', index: 3 },
    ],
    tabsRenders: [
      { name: 'tab_week1', content: '12' },
      { name: 'tab_week2', content: '13' },
      { name: 'tab_week3', content: '14' },
      { name: 'tab_week4', content: '15' },
      { name: 'tab_week5', content: '16' },
      { name: 'tab_week6', content: '17' },
      { name: 'tab_week0', content: '18' },
    ],
  },

  methods: {
    onClickDisabled(event) {
      wx.showToast({
        title: `${I18n.t('label')} ${event.detail.index + 1} ${I18n.t('hasBeenDisabled')}`,
        icon: 'none',
      });
    },

    onChange(event) {
      wx.showToast({
        title: `${I18n.t('switchToTab')} ${event.detail.index + 1}`,
        icon: 'none',
      });
    },

    onClickNavRight() {
      wx.showToast({
        title: `${I18n.t('click')} right nav`,
        icon: 'none',
      });
    },

    onClick(event) {
      wx.showToast({
        title: `${I18n.t('clickTag')} ${event.detail.index + 1}`,
        icon: 'none',
      });
    },
    onBeforeChange(event) {
      const { callback, title } = event.detail;

      wx.showModal({
        title: I18n.t('asynchronousSwitching'),
        content: `${I18n.t('areYouSureYouWantToSwitchTo')} ${title}？`,
        success: res => {
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

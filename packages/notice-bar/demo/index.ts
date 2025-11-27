import { SmartComponent } from '../../common/component';
import { SpeakerWaveLoud } from '@tuya-miniapp/icons';
import { Warning } from '@tuya-miniapp/icons';

SmartComponent({
  data: {
    Warning,
    SpeakerWaveLoud,
    text: I18n.t('noticebartip'),
    shortText: I18n.t('noticebartip2'),
  },
  methods: {
    onNoticeBarClose() {
      wx.showToast({
        icon: 'none',
        title: 'Notice bar closed',
      });
    },
    onNoticeBarBtnClick() {
      wx.showToast({
        icon: 'none',
        title: 'Button clicked',
      });
    },
    onNoticeBarClick() {
      wx.showToast({
        icon: 'none',
        title: 'Notice bar clicked',
      });
    },
  },
});

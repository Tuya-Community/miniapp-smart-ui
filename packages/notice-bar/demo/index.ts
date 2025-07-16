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
});

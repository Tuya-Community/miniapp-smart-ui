import { SmartComponent } from '../../common/component';

SmartComponent({
  data: {
    radioBasic: '1',
    radioDisabled: '2',
    radioColor: '1',
    radioText: '1',
    radioHoriz: '1',
    radioIcon: '1',
    radioSize: '1',
    radioLabel: '1',
    radioShape: '1',
    radioCell: '1',
    radioPreventDefault: "1",
    icon: {
      normal:
        'https://images.tuyacn.com/content-platform/hestia/1729664215ebd89f13e54.png',
      active:
        'https://images.tuyacn.com/content-platform/hestia/1730877912e76cbdb7563.png',
    },
  },

  methods: {
    onChange(event) {
      const { key } = event.currentTarget.dataset;
      this.setData({ [key]: event.detail });
    },

    onClick(event) {
      const { name } = event.currentTarget.dataset;
      this.setData({
        radioCell: name,
      });
    },
    onPreventDefaultChange(event) {
      wx.showModal({
        content: `onChange name: ${event.detail}`,
        showCancel: true,
        success: (res) => {
          if (res.confirm) {
            this.setData({
              radioPreventDefault: event.detail
            })
          }
        }
      })

    }
  },
});

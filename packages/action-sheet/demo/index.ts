import { SmartComponent } from '../../common/component';

SmartComponent({
  data: {
    show1: false,
    show2: false,
    show3: false,
    show4: false,
    show5: false,
    showSelect: false,
    showSelect2: false,
    showNumber: false,
    showPicker: false,
    isReady: false,
    action1: [{ name: 'Action' }, { name: 'Action' }, { name: 'Action' }],
    action2: [
      { name: I18n.t('coloringOptions'), color: '#ee0a24' },
      { loading: true },
      { name: I18n.t('disableOption'), disabled: true },
    ],
    actionSelect: [
      { id: 0, name: 'Action', checked: true },
      { id: 1, name: 'Action', checked: false },
      { id: 2, name: 'Action', checked: false },
      { id: 3, name: 'Action', checked: false },
      { id: 4, name: 'Action', checked: false },
      { id: 5, name: 'Action', checked: false },
      { id: 6, name: 'Action', checked: false },
      { id: 7, name: 'Action', checked: false },
    ],
    currentNumber: 0,
    currentDate: new Date(2018, 0, 1),
    currentDateStr: new Date(2018, 0, 1).toLocaleDateString(),
    minDate: new Date(2018, 0, 1).getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}${I18n.t('year')}`;
      }
      if (type === 'month') {
        return `${value}${I18n.t('month')}`;
      }
      return value;
    },
  },

  methods: {
    toggle(type) {
      this.setData({
        [type]: !this.data[type],
      });
    },

    toggleActionSheet1() {
      this.toggle('show1');
    },

    toggleActionSheet2() {
      this.toggle('show2');
    },

    toggleActionSheet3() {
      this.toggle('show3');
    },

    toggleActionSheet4() {
      this.toggle('show4');
    },

    toggleActionSheet5() {
      this.toggle('show5');
    },

    toggleActionSheet6() {
      this.toggle('show6');
    },

    toggleActionSheetSelect() {
      this.toggle('showSelect');
    },

    toggleActionSheetSelect2() {
      this.toggle('showSelect2');
    },

    toggleActionSheetNumber() {
      this.toggle('showNumber');
    },

    toggleActionSheetPicker() {
      this.toggle('showPicker');
    },

    onAfterEnter() {
      this.setData({ isReady: true })
    },

    onChange(event) {
      this.setData({ currentNumber: event.detail.value });
    },

    onSelect(evt) {
      const { id } = evt.detail;
      const newActionSelect = this.data.actionSelect.map((item) => {
        if (item.id === id) return { ...item, checked: true };
        return { ...item, checked: false };
      });
      this.setData({
        actionSelect: newActionSelect,
      });
    },

    onInput(event) {
      const { detail } = event;
      const date = new Date(detail);
      this.setData({ currentDate: date });
    },

    onPickerConfirm() {
      this.setData({
        showPicker: false,
        currentDateStr: this.data?.currentDate?.toLocaleDateString(),
      });
    },
  },
});

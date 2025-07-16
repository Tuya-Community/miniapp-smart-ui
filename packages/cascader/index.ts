import { SmartComponent } from '../common/component';
import closeIcon from '@tuya-miniapp/icons/dist/svg/Xmark';

interface Option {
  value: string | number;
  text: string | number;
  options?: Option[];
}

interface ITab {
  options: Option[];
  selected: Option | null;
}

SmartComponent({
  props: {
    title: String,
    value: {
      type: String,
    },
    placeholder: {
      type: String,
      value: 'Please select',
    },
    activeColor: {
      type: String,
      value: '#1989fa',
    },
    options: {
      type: Array,
      value: [],
    },
    swipeable: {
      type: Boolean,
      value: false,
    },
    closeable: {
      type: Boolean,
      value: true,
    },
    ellipsis: {
      type: Boolean,
      value: true,
    },
    swipeThreshold: {
      type: Number,
      value: 5,
    },
    showHeader: {
      type: Boolean,
      value: true,
    },
    closeIcon: {
      type: String,
      value: closeIcon,
    },
    useTitleSlot: Boolean,
  },

  data: {
    tabs: [] as ITab[],
    activeTab: 0,
    innerValue: '',
  },

  watch: {
    options() {
      this.updateTabs();
    },
    value(newVal) {
      this.updateValue(newVal);
    },
  },

  created() {
    this.updateTabs();
  },

  methods: {
    updateValue(val: string) {
      if (val !== undefined) {
        const values = this.data.tabs.map(
          (tab: ITab) => tab.selected && tab.selected.value
        );
        if (values.indexOf(val) > -1) {
          return;
        }
      }

      this.innerValue = val;

      this.updateTabs();
    },
    getSelectedOptionsByValue(options, value) {
      for (let i = 0; i < options.length; i++) {
        const option = options[i];

        if (option.value === value) {
          return [option];
        }

        if (option.options) {
          const selectedOptions = this.getSelectedOptionsByValue(
            option.options,
            value
          );
          if (selectedOptions) {
            return [option, ...selectedOptions];
          }
        }
      }
    },
    updateTabs() {
      const { options } = this.data;
      const { innerValue } = this;

      if (!options.length) {
        return;
      }

      if (innerValue !== undefined) {
        const selectedOptions = this.getSelectedOptionsByValue(
          options,
          innerValue
        );

        if (selectedOptions) {
          let optionsCursor = options;

          const tabs = selectedOptions.map((option) => {
            const tab = {
              options: optionsCursor,
              selected: option,
            };

            const next = optionsCursor.find(
              (item) => item.value === option.value
            );
            if (next) {
              optionsCursor = next.options;
            }

            return tab;
          });

          if (optionsCursor) {
            tabs.push({
              options: optionsCursor,
              selected: null,
            });
          }

          this.setData({
            tabs,
          });

          wx.nextTick(() => {
            this.setData({
              activeTab: tabs.length - 1,
            });
          });

          return;
        }
      }

      this.setData({
        tabs: [
          {
            options,
            selected: null,
          },
        ],
        activeTab: 0,
      });
    },
    onClose() {
      this.$emit('close');
    },
    onClickTab(e) {
      const { index: tabIndex, title } = e.detail;
      this.$emit('click-tab', { title, tabIndex });
      this.setData({
        activeTab: tabIndex,
      });
    },
    // 选中
    onSelect(e) {
      const { option, tabIndex } = e.currentTarget.dataset;

      if (option && option.disabled) {
        return;
      }

      let { tabs } = this.data;

      tabs[tabIndex].selected = option;

      if (tabs.length > tabIndex + 1) {
        tabs = tabs.slice(0, tabIndex + 1);
      }

      if (option.options) {
        const nextTab = {
          options: option.options,
          selected: null,
        };

        if (tabs[tabIndex + 1]) {
          tabs[tabIndex + 1] = nextTab;
        } else {
          tabs.push(nextTab);
        }

        wx.nextTick(() => {
          this.setData({
            activeTab: tabIndex + 1,
          });
        });
      }

      this.setData({
        tabs,
      });

      const selectedOptions = tabs.map((tab) => tab.selected).filter(Boolean);

      const { value } = option;

      const params = {
        value,
        tabIndex,
        selectedOptions,
      };

      this.innerValue = value;

      this.$emit('change', params);

      if (!option.options) {
        this.$emit('finish', params);
      }
    },
  },
});

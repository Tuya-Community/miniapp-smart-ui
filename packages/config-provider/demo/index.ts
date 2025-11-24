import { SmartComponent } from '../../common/component';

SmartComponent({
  data: {
    rate: 4,
    slider: 50,
    themeVars: {
      buttonPrimaryBorderColor: 'red',
      buttonPrimaryBackgroundColor: 'red',
    },
    currentTheme: 'light',
  },

  methods: {
    onChange(event) {
      const { color } = event.currentTarget.dataset;
      this.setData({
        themeVars: {
          buttonPrimaryBorderColor: color,
          buttonPrimaryBackgroundColor: color,
        },
      });
    },
    onThemeChange(event) {
      const { theme } = event.currentTarget.dataset;
      this.setData({
        currentTheme: theme,
      });
    },
  },
});

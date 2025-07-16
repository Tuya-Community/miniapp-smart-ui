import { SmartComponent } from '../../common/component';

const config = {
  pro1Name: I18n.t('zhejiang'),
  pro1: [
    {
      text: I18n.t('hangzhou'),
      id: 1,
    },
    {
      text: I18n.t('wenzhou'),
      id: 2,
    },
    {
      text: I18n.t('ningbo'),
      id: 3,
      disabled: true,
    },
    {
      text: I18n.t('yiwu'),
      id: 4,
    },
  ],
  pro2Name: I18n.t('jiangsu'),
  pro2: [
    {
      text: I18n.t('nanjing'),
      id: 5,
    },
    {
      text: I18n.t('wuxi'),
      id: 6,
    },
    {
      text: I18n.t('xuzhou'),
      id: 7,
    },
    {
      text: I18n.t('suzhou'),
      id: 8,
    },
  ],
  pro3Name: I18n.t('fujian'),
  pro3: [
    {
      text: I18n.t('quanzhou'),
      id: 9,
    },
    {
      text: I18n.t('xiamen'),
      id: 10,
    },
  ],
};
const items = [
  {
    text: config.pro1Name,
    options: config.pro1,
  },
  {
    text: config.pro2Name,
    options: config.pro2,
  },
  {
    text: config.pro3Name,
    disabled: true,
    options: config.pro3,
  },
];

SmartComponent({
  data: {
    items,
    badgeItems: items.slice(0, 2).map((item, index) => {
      if (index === 0) {
        return { ...item, dot: true };
      }
      if (index === 1) {
        return { ...item, badge: 5 };
      }

      return item;
    }),
    mainActiveIndex: 0,
    activeId: 0,
    mainActiveIndexMulti: 0,
    activeIdMulti: [],
  },

  methods: {
    onClickNav({ detail }) {
      this.setData({
        mainActiveIndex: detail.index || 0,
      });
    },

    onClickItem({ detail }) {
      const activeId = this.data.activeId === detail.id ? null : detail.id;

      this.setData({ activeId });
    },

    onClickNavMulti({ detail }) {
      this.setData({
        mainActiveIndexMulti: detail.index || 0,
      });
    },

    onClickItemMulti({ detail }) {
      const { activeIdMulti }: { activeIdMulti: any } = this.data;
      const idx = activeIdMulti.indexOf(detail.id);
      if (idx > -1) {
        activeIdMulti.splice(idx, 1);
      } else {
        activeIdMulti.push(detail.id);
      }

      this.setData({ activeIdMulti });
    },
  },
});

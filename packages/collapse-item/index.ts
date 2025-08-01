import { SmartComponent } from '../common/component';
import { useParent } from '../common/relation';
import { setContentAnimate } from './animate';

SmartComponent({
  classes: ['title-class', 'content-class'],

  relation: useParent('collapse'),

  props: {
    size: String,
    name: null,
    title: null,
    value: null,
    icon: String,
    label: String,
    disabled: Boolean,
    clickable: Boolean,
    border: {
      type: Boolean,
      value: true,
    },
    isLink: {
      type: Boolean,
      value: true,
    },
  },

  data: {
    expanded: false,
  },

  mounted() {
    this.updateExpanded();
    this.mounted = true;
  },

  methods: {
    updateExpanded() {
      if (!this.parent) {
        return;
      }

      const { value, accordion } = this.parent.data;
      const { children = [] } = this.parent;
      const { name } = this.data;

      const index = children.indexOf(this);
      const currentName = name == null ? index : name;

      const expanded = accordion
        ? value === currentName
        : (value || []).some((name: string | number) => name === currentName);

      // 执行动画前清除其他折叠块的动画
      this.setData({ animation: null });
      if (expanded !== this.data.expanded) {
        setContentAnimate(this, expanded, this.mounted);
      }

      this.setData({ index, expanded });
    },

    onClick() {
      if (this.data.disabled) {
        return;
      }

      const { name, expanded } = this.data;
      const index = this.parent.children.indexOf(this);
      const currentName = name == null ? index : name;

      this.parent.switch(currentName, !expanded);
    },
  },
});

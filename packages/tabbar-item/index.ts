import { SmartComponent } from '../common/component';
import { useParent } from '../common/relation';

SmartComponent({
  props: {
    info: null,
    name: null,
    icon: String,
    dot: Boolean,
    disabled: Boolean,
    url: {
      type: String,
      value: '',
    },
    linkType: {
      type: String,
      value: 'redirectTo',
    },
    iconPrefix: {
      type: String,
      value: 'smart-icon',
    },
  },

  relation: useParent('tabbar'),

  data: {
    active: false,
    activeColor: '',
    inactiveColor: '',
    upsideDown: false,
  },

  methods: {
    onClick() {
      const { parent } = this;

      if (this.data.disabled) {
        this.$emit('click');
        return;
      }

      if (parent) {
        const index = parent.children.indexOf(this);
        const active = this.data.name || index;

        if (active !== this.data.active) {
          parent.$emit('change', active);
        }
      }

      const { url, linkType } = this.data;

      if (url && wx[linkType]) {
        return wx[linkType]({ url });
      }

      this.$emit('click');
    },

    updateFromParent() {
      const { parent } = this;
      if (!parent) {
        return;
      }

      const index = parent.children.indexOf(this);
      const parentData = parent.data;
      const { data } = this;
      const active = (data.name || index) === parentData.active;
      const patch: Record<string, unknown> = {};

      if (active !== data.active) {
        patch.active = active;
      }
      if (parentData.activeColor !== data.activeColor) {
        patch.activeColor = parentData.activeColor;
      }
      if (parentData.inactiveColor !== data.inactiveColor) {
        patch.inactiveColor = parentData.inactiveColor;
      }
      if (parentData.upsideDown !== data.upsideDown) {
        patch.upsideDown = parentData.upsideDown;
      }

      if (Object.keys(patch).length > 0) {
        this.setData(patch);
      }
    },
  },
});

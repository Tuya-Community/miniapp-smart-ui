import { SmartComponent } from '../../common/component';
import Dialog from '../../dialog/dialog';
import Toast from '../../toast/toast';

SmartComponent({
  methods: {
    onClose(event) {
      const { position, instance } = event.detail;
      switch (position) {
        case 'left':
        case 'cell':
          instance.close();
          break;
        case 'right':
          Dialog.confirm({
            context: this,
            message: '确定删除吗？',
          })
            .then(() => {
              instance.close();
            })
            .catch(() => {
              console.log('cancel');
            });
          break;
      }
    },

    onOpen(event) {
      const { position, name } = event.detail;
      switch (position) {
        case 'left':
          Toast({
            context: this,
            message: `${name}${position}部分展示open事件被触发`,
          });
          break;
        case 'right':
          Toast({
            context: this,
            message: `${name}${position}部分展示open事件被触发`,
          });
          break;
      }
    },
  },
});

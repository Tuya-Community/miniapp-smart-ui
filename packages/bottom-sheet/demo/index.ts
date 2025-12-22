import { getSystemInfoSync } from '../../common/version';
import { SmartComponent } from '../../common/component';

SmartComponent({
  data: {
    show1: false,
    show2: false,
    show3: false,
    show4: false,
    show5: false,
    show6: false,
    show7: false,
    show8: false,
    show9: false,
    show10: false,
    closeDragHeight: 0,
    dragPosition: 'mid',
    dragPositionText: '',
  },
  created() {
    const { windowHeight } = getSystemInfoSync();
    const positionMap = {
      max: I18n.t('dragPositionMax'),
      mid: I18n.t('dragPositionMid'),
      min: I18n.t('dragPositionMin'),
    };
    this.setData({
      closeDragHeight: windowHeight * 0.4,
      dragPositionText: positionMap[this.data.dragPosition] || this.data.dragPosition,
    });
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
    toggleActionSheet7() {
      this.toggle('show7');
    },
    toggleActionSheet8() {
      this.toggle('show8');
    },
    toggleActionSheet9() {
      this.toggle('show9');
    },
    toggleActionSheet10() {
      this.toggle('show10');
    },
    onDragPosition(e) {
      const position = e.detail; // 'max' | 'mid' | 'min'
      const positionMap = {
        max: I18n.t('dragPositionMax'),
        mid: I18n.t('dragPositionMid'),
        min: I18n.t('dragPositionMin'),
      };
      this.setData({
        dragPosition: position,
        dragPositionText: positionMap[position] || position,
      });
    },
  },
});

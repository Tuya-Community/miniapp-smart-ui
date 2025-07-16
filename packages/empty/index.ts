import { SmartComponent } from '../common/component';

SmartComponent({
  props: {
    title: {
      type: String,
      value: '',
    },
    description: {
      type: String,
      value: '',
    },
    imageStyle: {
      type: String,
      value: '',
    },
    titleStyle: {
      type: String,
      value: '',
    },
    descriptionStyle: {
      type: String,
      value: '',
    },
    image: {
      type: String,
      value: 'default',
    },
  },
});

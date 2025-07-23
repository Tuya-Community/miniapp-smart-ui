export const pickerProps = {
  title: String,
  loading: Boolean,
  showToolbar: Boolean,
  cancelButtonText: {
    type: String,
    value: 'Cancel',
  },
  confirmButtonText: {
    type: String,
    value: 'Confirm',
  },
  visibleItemCount: {
    type: Number,
    value: 5,
  },
  itemHeight: {
    type: Number,
    value: 44,
  },
  changeAnimation: {
    type: Boolean,
    value: false,
  },
  animationTime: {
    type: Number,
    value: 300,
  },
  activeStyle: {
    type: String,
    value: '',
  },
};

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
  /**
   * 可见的选项个数 3 5 7 9
   */
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
  fontStyle: {
    type: String,
    value: '',
  },
  loop: {
    type: Boolean,
    value: false,
  },
};

export default function (options = {}) {
  return Page({
    onShareAppMessage() {
      return {
        title: 'Smart UI 组件库演示',
      };
    },
    ...options,
  });
}

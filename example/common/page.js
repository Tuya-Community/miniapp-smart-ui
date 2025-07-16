export default function (options = {}) {
  return Page({
    onShareAppMessage() {
      return {
        title: I18n.t('smartUiComponentLibraryDemo'),
      };
    },
    ...options,
  });
}

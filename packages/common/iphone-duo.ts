declare const ty: {
  getSystemInfoSync?: () => { model?: string };
};

export function isIPhoneDuo() {
  if (typeof ty === 'undefined') return false;
  const model = ty.getSystemInfoSync?.()?.model?.trim().toLowerCase();
  return model === 'iphone19,4' || model === 'iphone duo';
}

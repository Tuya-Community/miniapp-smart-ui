declare const ty: any;
const holders = new Set<Record<string, unknown>>();
export function holdNative(owner: Record<string, unknown>) {
  if (holders.has(owner)) return;
  const first = !holders.size;
  holders.add(owner);
  if (first && typeof ty !== 'undefined') ty.nativeDisabled?.(true);
}
export function releaseNative(owner: Record<string, unknown>) {
  if (!holders.delete(owner)) return;
  if (!holders.size && typeof ty !== 'undefined') ty.nativeDisabled?.(false);
}
export function nativeHolderCount() {
  return holders.size;
}

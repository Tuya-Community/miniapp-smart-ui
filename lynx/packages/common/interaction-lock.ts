import ty from './ty';
const owners = new Set<Record<string, unknown>>();
export function holdInteraction(owner: Record<string, unknown>) {
  if (owners.has(owner)) return;
  if (owners.size === 0) ty.nativeDisabled(true);
  owners.add(owner);
}
export function releaseInteraction(owner: Record<string, unknown>) {
  if (!owners.delete(owner)) return;
  if (owners.size === 0) ty.nativeDisabled(false);
}

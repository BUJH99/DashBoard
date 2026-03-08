import type { ApplicationChecklistItem } from "../dashboard/types";

export function updateChecklistItems(
  collection: Record<number, ApplicationChecklistItem[]>,
  postingId: number,
  itemId: string,
  updater: (item: ApplicationChecklistItem) => ApplicationChecklistItem,
) {
  const nextItems = (collection[postingId] ?? []).map((item) => (item.id === itemId ? updater(item) : item));
  return {
    ...collection,
    [postingId]: nextItems,
  };
}

export function toggleChecklistDone(
  collection: Record<number, ApplicationChecklistItem[]>,
  postingId: number,
  itemId: string,
) {
  return updateChecklistItems(collection, postingId, itemId, (item) => ({
    ...item,
    done: !item.done,
  }));
}

export function updateChecklistNote(
  collection: Record<number, ApplicationChecklistItem[]>,
  postingId: number,
  itemId: string,
  note: string,
) {
  return updateChecklistItems(collection, postingId, itemId, (item) => ({
    ...item,
    note,
  }));
}

export function toggleChecklistBlocked(
  collection: Record<number, ApplicationChecklistItem[]>,
  postingId: number,
  itemId: string,
) {
  return updateChecklistItems(collection, postingId, itemId, (item) => ({
    ...item,
    blocked: !item.blocked,
  }));
}

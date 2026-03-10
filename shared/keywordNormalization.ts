export function normalizeKeyword(value: string) {
  return value.toLowerCase().replace(/[^\p{Letter}\p{Number}]+/gu, "");
}

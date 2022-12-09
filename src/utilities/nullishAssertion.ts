type Nullish = null | undefined;

export function isNullish(value: unknown): value is Nullish {
  return typeof value === "undefined" || value === null;
}

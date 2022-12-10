type Nullish = null | undefined;

export function isNullish(value: unknown): value is Nullish {
  // eslint-disable-next-line no-undefined
  return value === undefined || value === null;
}

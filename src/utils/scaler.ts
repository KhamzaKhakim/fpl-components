export const createScaler =
  (size: number, base = 600) =>
  (v: number) =>
    (v / base) * size;

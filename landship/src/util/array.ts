export const updateOrInsert = <T>(
  array: T[],
  item: T,
  genId: (i: T) => any,
): T[] => {
  const targetId = genId(item);
  const index = array.findIndex((i) => genId(i) === targetId);
  if (index === -1) {
    return [...array, item];
  }
  return array.map((i, idx) => (idx === index ? item : i));
};

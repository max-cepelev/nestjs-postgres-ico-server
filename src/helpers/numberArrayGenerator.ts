export const getNumArray = (from: number, to: number, gap: number) => {
  const arr = [];
  for (let i = from; i <= to; i += gap) {
    arr.push(i);
  }
  return arr;
};

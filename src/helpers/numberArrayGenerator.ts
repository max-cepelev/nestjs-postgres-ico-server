export const getNumArray = (from: number, to: number, gap: number) => {
  const arr = [0];
  for (let i = from; i <= to; i += gap) {
    arr.push(i);
  }
  return arr;
};

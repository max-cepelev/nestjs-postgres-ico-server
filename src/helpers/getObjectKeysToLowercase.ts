const getObjectKeysToLowercaseKeys = (obj: any) => {
  const newObj = Object.keys(obj).reduce(
    (c, k) => ((c[k.toLowerCase()] = obj[k]), c),
    {},
  );
  return newObj;
};

export default getObjectKeysToLowercaseKeys;

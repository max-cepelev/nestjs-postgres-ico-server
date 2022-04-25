import { CreateLeadDto } from 'src/leads/dto/create-lead-dto';

const getObjectKeysToLowercaseKeys = (
  obj: any,
): Omit<CreateLeadDto, 'uniq_id' | 'host'> => {
  const newObj = Object.keys(obj).reduce(
    (acc, key) => {
      acc[key.toLowerCase()] = obj[key];
      return acc;
    },
    { ...obj },
  );
  return newObj;
};

export default getObjectKeysToLowercaseKeys;

import { IMacroData } from 'src/macro/entities/macro.data';

export const getMacroDataV1 = (data: IMacroData[]) => {
  const result = data.map((item) => {
    return {
      id: item.id,
      category: item.category_name,
      image: item.plan_image,
      status: item.status_real_name,
      square: item.estate_area,
      price: item.estate_price,
      mPrice: item.estate_price_m2,
      floor: item.estate_floor,
      rooms: item.estate_rooms,
      flat: item.geo_flatnum,
      entrance: item.geo_house_entrance,
      plan: item.plan_name,
    };
  });
  return result;
};

export const getMacroDataV2 = (data: IMacroData[]) => {
  const result = data.map((item) => {
    return {
      id: item.id,
      category: item.category_name,
      image: item.plan_image,
      status: item.status_real_name,
      square: item.estate_area,
      price: item.estate_price,
      mPrice: item.estate_price_m2,
      floor: item.estate_floor,
      rooms: item.estate_rooms,
      flat: item.geo_flatnum,
      entrance: item.geo_house_entrance,
      plan: item.plan_name,
    };
  });
  return result;
};

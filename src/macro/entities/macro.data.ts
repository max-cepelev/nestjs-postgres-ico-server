export interface IMacroData {
  id: number;
  category_name: string;
  plan_image: string;
  status_real_name: string;
  estate_area: number;
  estate_price: number;
  estate_price_m2: number;
  estate_floor: number;
  estate_rooms: number | null;
  geo_flatnum: string | null;
  geo_house_entrance: number | null;
  plan_name: string | null;
}

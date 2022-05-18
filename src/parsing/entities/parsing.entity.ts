export interface IParsingData {
  house: {
    floors: number;
  };
  source: string;
  offers_count: number;
  layout_id: string;
  address: {
    id: number;
    kind: string;
    guid: string;
    name: string;
    display_name: string;
    position: {
      lat: number;
      lon: number;
    };
    locality: {
      kind: string;
      guid: string;
      name: string;
      display_name: string;
    };
    subways: [];
    info: {
      timezone: string;
      timezone_offset: number;
    };
    short_display_name: string;
  };
  chat_available: boolean;
  id: number;
  trade_in: string;
  offer_type: string;
  status: number;
  deal_type: string;
  price_info: {
    price: number;
    square_price: number;
    mortgage_price: number;
    square_price_for_year: number;
    min_price: number;
    max_price: number;
  };
  backwash: boolean;
  published_dt: string;
  slug: string;
  complex: {
    id: number;
    name: string;
    min_rate: number;
    start_build_year: number;
    start_build_quarter: number;
    first_build_year: number;
    first_build_quarter: number;
    end_build_year: number;
    end_build_quarter: number;
    phone: string;
    sales_info: {
      sales_phone: string[];
      responsible_officer_phone: string[];
    };
    has_approve_flats: boolean;
    phone_substitution: string;
    telephony_data: {
      redirect_type: string;
      complex_id: number;
      campaign_id: number;
      has_problem: boolean;
      b_number: string;
      r_number: string;
    };
    slug: string;
    building: {
      id: number;
      name: string;
      end_build_year: number;
      end_build_quarter: number;
      released: boolean;
    };
  };
  discount_status: {};
  photos: {
    url: string;
  }[];
  developer: {
    id: number;
    name: string;
    logo: string;
    holding_id: number;
  };
  object_info: {
    max_floor: number;
    area: number;
    rooms: number;
    min_floor: number;
  };
}

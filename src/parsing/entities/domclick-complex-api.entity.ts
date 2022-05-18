interface IOffer {
  id: number;
  object_info: {
    floor: number;
    renovation: {
      display_name: string;
      type: string;
    };
    loggias: number | null;
    balconies: null;
    flat_number: string;
  };
  published_dt: string;
  updated_dt: string;
  price_info: {
    price: number;
    square_price: number;
    mortgage_price: number;
  };
  house: null;
}

interface IDeveloper {
  id: number;
  name: string;
  registered_at: null;
  logo: string;
  holding: null;
  experience: {
    in_progress: {
      complexes_count: number;
      buildings_count: number;
    };
    finished: {
      complexes_count: number;
      buildings_count: number;
    };
    built_on_time: number;
    experience_repr: string;
    holding_stats: {
      companies_total: null;
      companies_positive: null;
      companies_negative: null;
    };
  };
  description: {
    teaser: null;
    text: null;
  };
  holding_id: null;
  holding_name: null;
  legal_name: string;
  site: null;
  status: null;
  objects_ready: number;
  objects_in_progress: number;
  group: string;
  holding_complexes_count: null;
  developer_complexes_count: null;
}

interface IParent {
  id: number;
  guid: string;
  kind: string;
  subkind: null;
  name: string;
  display_name: string;
}

interface IDistrict {
  id: number;
  guid: string;
  district_id: number;
  display_name: string;
  parent_district_id: null;
}

interface IComplexLayout {
  id: number;
  layout_id: string;
  complex_id: number;
  slug: string;
  offers: IOffer[];
  complex: {
    name: string;
    buildings_total: 1;
    description_short: string;
    calc_data: {
      ins: boolean;
      elreg: boolean;
      devdisc: boolean;
      dk: boolean;
      cost: null;
      dep: null;
      term: number;
      prod: number;
    };
    sales_info: {
      sales_address: string;
      sales_phone: string[];
      latitude: null;
      longitude: null;
      responsible_officer_phone: string[];
    };
    phone: string;
    min_rate: number;
    telephony_data: {
      complex_id: number;
      b_number: string;
      r_number: string;
      campaign_id: number | null;
    };
    phone_substitution: string;
    has_accreditation: boolean;
    discounts: [];
    has_mortgage_subsidy: boolean;
    has_custom_rate: boolean;
    similar_complex_ids: number[];
  };
  building: {
    id: number;
    name: string;
    start_build_year: number;
    start_build_quarter: number;
    end_build_year: number;
    end_build_quarter: number;
    developers: IDeveloper[];
    wall_type: {
      id: number;
      display_name: string;
    };
    kind: {
      id: number;
      display_name: string;
    };
    readiness_percentage: number;
    floors: number;
    is_ready: boolean;
    complex_product: boolean;
  };
  object_info: {
    rooms: number;
    area: number;
    living_area: number;
    kitchen_area: number;
    rooms_area: number[];
    is_apartment: null;
    window_view: [];
  };
  address: {
    id: number;
    guid: string;
    kind: string;
    subkind: null;
    name: string;
    display_name: string;
    position: {
      lat: number;
      lon: number;
    };
    locality: {
      id: null;
      guid: string;
      kind: string;
      subkind: null;
      name: string;
      display_name: string;
    };
    locality_tmp: {
      id: number;
      guid: string;
      kind: string;
      subkind: null;
      name: string;
      display_name: string;
    };
    parents: IParent[];
    districts: IDistrict[];
    subways: [];
    addresses: string[];
    address_ids: number[];
    time_on_foot: null;
    time_by_car: null;
  };
  photo: string[];
  complex_photo: string[];
  discount_status: {
    value: null;
    has_discount: boolean;
  };
  backwash: boolean;
  max_price: number;
  min_price: number;
  max_floor: number;
  min_floor: number;
  min_mortgage_price: number;
  deal_type: string;
  offer_type: string;
  offers_count: number;
}

export interface IApiData {
  items: IComplexLayout[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

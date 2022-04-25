export interface IDeveloper {
  [key: string]: {
    id: number;
    name: string;
    logo: string;
    holding_id: number;
    site: string;
  };
}

export interface IComplexData {
  [key: string]: {
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
      r_number: string;
      b_number: string;
      campaign_id: number;
      redirect_type: string;
      has_problem: boolean;
      complex_id: number;
    };
    slug: string;
    building: {
      id: number;
      name: string;
      end_build_year: number;
      end_build_quarter: number;
      released: boolean;
    };
    developer_name: string;
  };
}

export interface IComplexesData {
  developers: IDeveloper;
  complexes: IComplexData;
}

export interface IMainData {
  id: number;
  image: string;
  developer: string;
  complex: string;
  complex_id: number;
  address: string;
  commissioningDate: string;
  price: number;
  totalArea: number;
  floor: number;
  floorsAmount: number;
  roomsAmount: number;
  complex_url: string;
}

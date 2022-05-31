export class CreateBuildingDto {
  readonly name: string;
  readonly address: string;
  readonly commissioningDate: Date | null;
  readonly commissioned: boolean;
  readonly propertyClass: string | null;
  readonly wallMaterial: string | null;
  readonly decorType: string | null;
  readonly img: string | null;
  readonly floors: number | null;
  readonly entrances: number | null;
  readonly passengerElevators: number | null;
  readonly freightElevators: number | null;
  readonly latitude: number | null;
  readonly longitude: number | null;
  readonly domRfId: number | null;
  readonly domClickId: number | null;
  readonly complexId: number;
  readonly developerId: number;
  readonly cityId: number;
  readonly areaId: number;
}

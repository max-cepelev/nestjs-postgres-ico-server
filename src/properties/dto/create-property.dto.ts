export class CreatePropertyDto {
  readonly number: number;
  readonly floor: number;
  readonly entrance: number | null;
  readonly totalArea: number;
  readonly livingArea: number | null;
  readonly rooms: number | null;
  readonly wallHeight: number;
  readonly buildingId: number;
  readonly propertyTypeId: number;
}

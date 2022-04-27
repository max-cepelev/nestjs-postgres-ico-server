export class CreateOfferDto {
  readonly id: number;
  readonly image: string;
  readonly developer: string;
  readonly complex: string;
  readonly complexId: number;
  readonly building: string;
  readonly buildingId: number;
  readonly address: string;
  readonly commissioningDate: string;
  readonly price: number;
  readonly totalArea: number;
  readonly floor: number;
  readonly floorsAmount: number;
  readonly roomsAmount: number;
  readonly complexUrl: string;
}

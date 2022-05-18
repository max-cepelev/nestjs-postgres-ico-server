export class CreateOfferDto {
  readonly id: number;
  readonly floor: number;
  readonly floors: number;
  readonly price: number;
  readonly address: string;
  readonly buildingId: number;
  readonly building: string;
  readonly developer: string;
  readonly developerId: number;
  readonly complex: string;
  readonly complexId: number;
  readonly area: number;
  readonly rooms: number;
  readonly image: string;
}

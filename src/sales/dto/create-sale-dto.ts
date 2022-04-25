export class CreateSaleDto {
  readonly date: string;

  readonly numberLiving: number;

  readonly areaLiving: number;

  readonly priceLiving: number;

  readonly numberNonResidental: number;

  readonly areaNonResidental: number;

  readonly priceNonResidental: number;

  readonly numberParkingSpace: number;

  readonly areaParkingSpace: number;

  readonly priceParkingSpace: number;

  readonly buildingId: number;
}

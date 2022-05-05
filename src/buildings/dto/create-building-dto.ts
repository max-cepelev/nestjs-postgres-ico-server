export class CreateBuildingDto {
  readonly id: number;
  readonly name: string;
  readonly address: string;
  readonly commissioningDate: Date;
  readonly commissioned: boolean;
  readonly propertyClass: string;
  readonly wallMaterial: string;
  readonly decorType: string;
  readonly floorsAmount: number;
  readonly apartmentsAmount: number;
  readonly livingSpace: number;
  readonly wallHeight: string;
  readonly entrancesAmount: number;
  readonly passengerElevatorsAmount: number;
  readonly freightElevatorsAmount: number;
  readonly nonLivingRoomsAmount: number;
  readonly parkingLotsAmount: number;
  readonly latitude: number;
  readonly longitude: number;
  readonly img: string;
  readonly domRfId: number;
  readonly domClickId: number;
  readonly complexId: number;
  readonly developerId: number;
}

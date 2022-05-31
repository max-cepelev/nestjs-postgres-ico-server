export class CreateComplexDto {
  readonly name: string;
  readonly shortName: string;
  readonly website: string;
  readonly info: string;
  readonly domRfId: number | null;
  readonly domClickId: number | null;
  readonly cityId: number;
}

export class CreateComplexDto {
  readonly name: string;
  readonly address: string;
  readonly website: string;
  readonly info: string;
  readonly domRfId: number | null;
  readonly domClickId: number | null;
}

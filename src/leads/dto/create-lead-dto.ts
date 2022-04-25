export class CreateLeadDto {
  uniq_id: string;
  host: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  form_name: string | null;
  form_id: string | null;
  tran_id: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
}

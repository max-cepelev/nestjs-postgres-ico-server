import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateLeadDto } from './dto/create-lead-dto';
import { Lead } from './entities/lead.entity';
import uniqid from 'uniqid';
import getObjectKeysToLowercaseKeys from 'src/helpers/getObjectKeysToLowercase';

@Injectable()
export class LeadsService {
  constructor(@InjectModel(Lead) private leadsRepository: typeof Lead) {}

  async createBulk(dto: CreateLeadDto[]) {
    const complexes = await this.leadsRepository.bulkCreate(dto);
    return complexes;
  }

  async create(body: any, referer: string) {
    const hostName = referer ? new URL(referer).host : null;
    const data: Omit<CreateLeadDto, 'uniq_id' | 'host'> =
      getObjectKeysToLowercaseKeys(body);
    const dto: CreateLeadDto = {
      uniq_id: uniqid(),
      host: hostName,
      name: data.name || null,
      phone: data.phone || null,
      email: data.email || null,
      form_name: data.form_name || null,
      form_id: data.form_id || null,
      tran_id: data.tran_id || null,
      utm_source: data.utm_source || null,
      utm_medium: data.utm_medium || null,
      utm_campaign: data.utm_campaign || null,
      utm_term: data.utm_term || null,
    };
    const complex = await this.leadsRepository.create(dto);
    return complex;
  }

  async findAll() {
    const complexes = await this.leadsRepository.findAll();
    return complexes;
  }
}

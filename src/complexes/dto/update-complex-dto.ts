import { PartialType } from '@nestjs/mapped-types';
import { CreateComplexDto } from './create-complex-dto';

export class UpdateComplexDto extends PartialType(CreateComplexDto) {}

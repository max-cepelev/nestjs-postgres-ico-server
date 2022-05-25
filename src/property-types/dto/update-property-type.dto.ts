import { PartialType } from '@nestjs/mapped-types';
import { CreatePropertyTypeDto } from './create-property-type.dto';

export class UpdatePropertyTypeDto extends PartialType(CreatePropertyTypeDto) {}

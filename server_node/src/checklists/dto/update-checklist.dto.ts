import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateChecklistDto } from './create-checklist.dto';
import { Item } from '../../items/entities/item.entity';

export class UpdateChecklistDto extends PartialType(CreateChecklistDto) {
  @ApiProperty({ required: false })
  description: string;

  @ApiProperty({ required: false })
  items: Item[];
}

import { PartialType } from '@nestjs/swagger';
import { CreateAttendentionalDto } from './create-attendentional.dto';

export class UpdateAttendentionalDto extends PartialType(CreateAttendentionalDto) {}

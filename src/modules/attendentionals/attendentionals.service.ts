import { Injectable } from '@nestjs/common';
import { CreateAttendentionalDto } from './dto/create-attendentional.dto';
import { UpdateAttendentionalDto } from './dto/update-attendentional.dto';

@Injectable()
export class AttendentionalsService {
  create(createAttendentionalDto: CreateAttendentionalDto) {
    return 'This action adds a new attendentional';
  }

  findAll() {
    return `This action returns all attendentionals`;
  }

  findOne(id: number) {
    return `This action returns a #${id} attendentional`;
  }

  update(id: number, updateAttendentionalDto: UpdateAttendentionalDto) {
    return `This action updates a #${id} attendentional`;
  }

  remove(id: number) {
    return `This action removes a #${id} attendentional`;
  }
}

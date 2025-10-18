import { Injectable } from '@nestjs/common';
import { CreateStudentGroupDto } from './dto/create-student-group.dto';
import { UpdateStudentGroupDto } from './dto/update-student-group.dto';

@Injectable()
export class StudentGroupsService {
  create(createStudentGroupDto: CreateStudentGroupDto) {
    return 'This action adds a new studentGroup';
  }

  findAll() {
    return `This action returns all studentGroups`;
  }

  findOne(id: number) {
    return `This action returns a #${id} studentGroup`;
  }

  update(id: number, updateStudentGroupDto: UpdateStudentGroupDto) {
    return `This action updates a #${id} studentGroup`;
  }

  remove(id: number) {
    return `This action removes a #${id} studentGroup`;
  }
}

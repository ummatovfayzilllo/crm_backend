import { Injectable } from '@nestjs/common';
import { CreateRomDto } from './dto/create-rom.dto';
import { UpdateRomDto } from './dto/update-rom.dto';

@Injectable()
export class RomService {
  create(createRomDto: CreateRomDto) {
    return 'This action adds a new rom';
  }

  findAll() {
    return `This action returns all rom`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rom`;
  }

  update(id: number, updateRomDto: UpdateRomDto) {
    return `This action updates a #${id} rom`;
  }

  remove(id: number) {
    return `This action removes a #${id} rom`;
  }
}

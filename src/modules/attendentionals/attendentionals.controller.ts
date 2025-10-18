import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AttendentionalsService } from './attendentionals.service';
import { CreateAttendentionalDto } from './dto/create-attendentional.dto';
import { UpdateAttendentionalDto } from './dto/update-attendentional.dto';

@Controller('attendentionals')
export class AttendentionalsController {
  constructor(private readonly attendentionalsService: AttendentionalsService) {}

  @Post()
  create(@Body() createAttendentionalDto: CreateAttendentionalDto) {
    return this.attendentionalsService.create(createAttendentionalDto);
  }

  @Get()
  findAll() {
    return this.attendentionalsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendentionalsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAttendentionalDto: UpdateAttendentionalDto) {
    return this.attendentionalsService.update(+id, updateAttendentionalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendentionalsService.remove(+id);
  }
}

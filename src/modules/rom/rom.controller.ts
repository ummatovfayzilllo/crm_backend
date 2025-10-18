import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RomService } from './rom.service';
import { CreateRomDto } from './dto/create-rom.dto';
import { UpdateRomDto } from './dto/update-rom.dto';

@Controller('rom')
export class RomController {
  constructor(private readonly romService: RomService) {}

  @Post()
  create(@Body() createRomDto: CreateRomDto) {
    return this.romService.create(createRomDto);
  }

  @Get()
  findAll() {
    return this.romService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.romService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRomDto: UpdateRomDto) {
    return this.romService.update(+id, updateRomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.romService.remove(+id);
  }
}

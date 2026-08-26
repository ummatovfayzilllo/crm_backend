import { ApiBearerAuth } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/global/guards/jwt.auth.guard';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { RomService } from './rom.service';
import { CreateRomDto } from './dto/create-rom.dto';
import { UpdateRomDto } from './dto/update-rom.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('rooms')
export class RomController {
  constructor(private readonly romService: RomService) { }

  @Post("create")
  create(@Body() dto: CreateRomDto) {
    return this.romService.create(dto);
  }

  @Get("get-all")
  findAll() {
    return this.romService.findAll();
  }

  @Get('get-one/:id')
  findOne(@Param('id') id: string) {
    return this.romService.findOne(id);
  }

  @Patch('update-one/:id')
  update(@Param('id') id: string, @Body() dto: UpdateRomDto) {
    return this.romService.update(id, dto);
  }

  @Get("get-all/statistika/romms")
  getStatistika(){
    return this.romService.getLidsStats()
  }

  @Delete('remove-one/:id')
  remove(@Param('id') id: string) {
    return this.romService.remove(id);
  }
}

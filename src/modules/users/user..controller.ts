import { ApiBearerAuth } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/global/guards/jwt.auth.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorages } from 'src/common/config/multer.config';
import { UserData } from 'src/global/decorators/auth.decorators';
import { JwtPayload } from 'src/common/config/jwt.secrets';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly UsersService: UsersService) {}

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstName: { type: 'string', example: 'Fayzillo' },
        lastName: { type: 'string', example: 'Ummatov' },
        father: { type: 'string', example: 'Soliyev Ziyodulla' },
        phone: { type: 'string', example: '+998992422141' },
        birthDay: { type: 'string', format: 'date' },
        email: { type: 'string', example: 'ovovovlululutvata@gmail.com' },
        password: { type: 'string', example: '12345678' },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
      required: [
        'firstName',
        'lastName',
        'email',
        'password',
        'birthDay',
        'phone',
      ],
    },
  })
  @ApiConsumes('multipart/form-data')
  @Post('create')
  create(@Body() createStaffDto: CreateUserDto, @UserData() user: JwtPayload) {
    return this.UsersService.create(createStaffDto);
  }

  @Get('get-all')
  findAll() {
    return this.UsersService.findAll();
  }

  @Get('get-one/:id')
  findOne(@Param('id') id: string) {
    return this.UsersService.findOne(id);
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstName: { type: 'string', example: 'Fayzillo' },
        lastName: { type: 'string', example: 'Ummatov' },
        father: { type: 'string', example: 'Soliyev Ziyodulla' },
        phone: { type: 'string', example: '+998992422141' },
        birthDay: { type: 'string', format: 'date' },
        email: { type: 'string', example: 'ovovovlululutvata@gmail.com' },
        role: {
          type: 'string',
          example: 'STUDENT',
          examples: ['STUDENT', 'ADMIN', 'TEACHER'],
        },
        password: { type: 'string', example: '12345678' },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', fileStorages(['image'])))
  @Patch('avatar/:id')
  updateAvatar(@Param('id') id: string, @Body() updateAvatarDto: UpdateAvatarDto) {
    return this.UsersService.updateAvatar(id, updateAvatarDto.image);
  }

  @Patch('update-one/:id')
  update(@Param('id') id: string, @Body() updateStaffDto: UpdateUserDto) {
    return this.UsersService.update(id, updateStaffDto);
  }

  @Delete('delete-one/:id')
  remove(@Param('id') id: string) {
    return this.UsersService.remove(id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { StaffsService } from './staffs.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorages } from 'src/common/types/upload_types';
import { UserData } from 'src/global/decorators/auth.decorators';
import { JwtPayload } from 'src/common/config/jwt.secrets';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('staffs')
export class StaffsController {
  constructor(private readonly staffsService: StaffsService) { }


  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstName: { type: "string", example : "Fayzillo"},
        lastName: { type: "string",example : "Ummatov" },
        father: { type: "string" ,example : "Soliyev Ziyodulla"},
        phone: { type: "string",example : "+998992422141" },
        birthDay: { type: "string",format : "date" },
        email: { type: "string" ,example : "ovovovlululutvata@gmail.com"},
        role: { type: "string",example : "STUDENT",examples : ["STUDENT","ADMIN","TEACHER"] },
        password: { type: "string" ,example : "12345678"},
        image : {
          type : "string",
          format : "binary"
        }
      },
      required : ["firstName","lastName","email","password","birthDay","phone"]
    },
  })
  @ApiConsumes("multipart/form-data")
  @Post("create")
  @UseInterceptors(FileInterceptor("image", fileStorages(["image"])))
  create(
    @Body() createStaffDto: CreateStaffDto,
    @UserData() user: JwtPayload,
    @UploadedFile() image?: Express.Multer.File
  ) {
    console.log("Staff Controller ",image)
    return this.staffsService.create(createStaffDto,image);
  }

  @Get("get-all")
  findAll() {
    return this.staffsService.findAll();
  }

  @Get('get-one/:id')
  findOne(@Param('id') id: string) {
    return this.staffsService.findOne(id);
  }

  @Patch('update-one/:id')
  update(@Param('id') id: string, @Body() updateStaffDto: UpdateStaffDto) {
    return this.staffsService.update(id, updateStaffDto);
  }

  @Delete('delete-one/:id')
  remove(@Param('id') id: string) {
    return this.staffsService.remove(id);
  }
}

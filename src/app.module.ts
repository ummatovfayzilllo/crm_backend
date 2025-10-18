import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { RomModule } from './modules/rom/rom.module';
import { CoursesModule } from './modules/courses/courses.module';
import { GroupesModule } from './modules/groupes/groupes.module';
import { StaffsModule } from './modules/staffs/staffs.module';
import { StudentGroupsModule } from './modules/student-groups/student-groups.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { AttendentionalsModule } from './modules/attendentionals/attendentionals.module';

@Module({
  imports: [
    CoreModule, 
    RomModule, 
    CoursesModule, 
    GroupesModule,
    StaffsModule,
    StudentGroupsModule,
    LessonsModule,
    AttendentionalsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

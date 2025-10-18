import { Test, TestingModule } from '@nestjs/testing';
import { StudentGroupsController } from './student-groups.controller';
import { StudentGroupsService } from './student-groups.service';

describe('StudentGroupsController', () => {
  let controller: StudentGroupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentGroupsController],
      providers: [StudentGroupsService],
    }).compile();

    controller = module.get<StudentGroupsController>(StudentGroupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

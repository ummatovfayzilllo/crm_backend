import { Test, TestingModule } from '@nestjs/testing';
import { AttendentionalsController } from './attendentionals.controller';
import { AttendentionalsService } from './attendentionals.service';

describe('AttendentionalsController', () => {
  let controller: AttendentionalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendentionalsController],
      providers: [AttendentionalsService],
    }).compile();

    controller = module.get<AttendentionalsController>(AttendentionalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

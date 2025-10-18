import { Test, TestingModule } from '@nestjs/testing';
import { AttendentionalsService } from './attendentionals.service';

describe('AttendentionalsService', () => {
  let service: AttendentionalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttendentionalsService],
    }).compile();

    service = module.get<AttendentionalsService>(AttendentionalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

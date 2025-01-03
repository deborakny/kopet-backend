import { Test, TestingModule } from '@nestjs/testing';
import { ContaController } from './conta.controller';
import { ContaService } from './conta.service';

describe('ContaController', () => {
  let controller: ContaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContaController],
      providers: [ContaService],
    }).compile();

    controller = module.get<ContaController>(ContaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

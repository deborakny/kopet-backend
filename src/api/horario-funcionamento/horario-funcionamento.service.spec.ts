import { Test, TestingModule } from '@nestjs/testing';
import { HorarioFuncionamentoService } from './horario-funcionamento.service';

describe('HorarioFuncionamentoService', () => {
  let service: HorarioFuncionamentoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HorarioFuncionamentoService],
    }).compile();

    service = module.get<HorarioFuncionamentoService>(HorarioFuncionamentoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

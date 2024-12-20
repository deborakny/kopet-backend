import { Test, TestingModule } from '@nestjs/testing';
import { HorarioFuncionamentoController } from './horario-funcionamento.controller';
import { HorarioFuncionamentoService } from './horario-funcionamento.service';

describe('HorarioFuncionamentoController', () => {
  let controller: HorarioFuncionamentoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HorarioFuncionamentoController],
      providers: [HorarioFuncionamentoService],
    }).compile();

    controller = module.get<HorarioFuncionamentoController>(HorarioFuncionamentoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

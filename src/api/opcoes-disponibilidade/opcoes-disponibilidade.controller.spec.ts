import { Test, TestingModule } from '@nestjs/testing';
import { OpcoesDisponibilidadeController } from './opcoes-disponibilidade.controller';
import { OpcoesDisponibilidadeService } from './opcoes-disponibilidade.service';

describe('OpcoesDisponibilidadeController', () => {
  let controller: OpcoesDisponibilidadeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpcoesDisponibilidadeController],
      providers: [OpcoesDisponibilidadeService],
    }).compile();

    controller = module.get<OpcoesDisponibilidadeController>(OpcoesDisponibilidadeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

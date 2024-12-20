import { Test, TestingModule } from '@nestjs/testing';
import { OpcoesDisponibilidadeService } from './opcoes-disponibilidade.service';

describe('OpcoesDisponibilidadeService', () => {
  let service: OpcoesDisponibilidadeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpcoesDisponibilidadeService],
    }).compile();

    service = module.get<OpcoesDisponibilidadeService>(OpcoesDisponibilidadeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

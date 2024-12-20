import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OpcoesDisponibilidadeService } from './opcoes-disponibilidade.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Opcoes-Disponibilidade')
@Controller('opcoes-disponibilidade')
export class OpcoesDisponibilidadeController {
  constructor(private readonly opcoesDisponibilidadeService: OpcoesDisponibilidadeService) {}

  @Get(':id/funcionario/:funcionarioId')
  findByServicoAndFuncionario(@Param('id') id: number, @Param('funcionarioId') funcionarioId: number) {
    return this.opcoesDisponibilidadeService.findByServicoIdFuncionarioId(id, funcionarioId);
  }

  @Get(':id')
  findByServico(@Param('id') id: number) {
    return this.opcoesDisponibilidadeService.findByServicoId(id);
  }

}

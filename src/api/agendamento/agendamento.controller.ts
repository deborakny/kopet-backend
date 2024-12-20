import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AgendamentoService } from './agendamento.service';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Agendamentos')
@Controller('agendamentos')
export class AgendamentoController {
  constructor(private readonly agendamentoService: AgendamentoService) {}

  @Post()
  create(@Body() createAgendamentoDto: CreateAgendamentoDto) {
    return this.agendamentoService.create(createAgendamentoDto);
  }

  @Get()
  findAll() {
    return this.agendamentoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agendamentoService.findOne(+id);
  }

  @Get('cliente/:id')
  findByClienteId(@Param('id') id: number) {
    return this.agendamentoService.findByClienteId(id);
  }

  @Get('estabelecimento/:id')
  findByEstabelecimentoId(@Param('id') id: number) {
    return this.agendamentoService.findByEstabelecimentoId(id);
  }

  @Get('estabelecimento/:estabelecimentoId/funcionario/:funcionarioId')
  findByFuncionarioId(@Param('estabelecimentoId') estabelecimentoId: number, @Param('funcionarioId') funcionarioId: number) {
    return this.agendamentoService.findByFuncionarioId(estabelecimentoId, funcionarioId);
  }

  @Get('estabelecimento/:estabelecimentoId/servico/:servicoId')
  findByServicoId(@Param('estabelecimentoId') estabelecimentoId: number, @Param('servicoId') servicoId: number) {
    return this.agendamentoService.findByServicoId(estabelecimentoId, servicoId);
  }

  @Get('cliente/:clienteId/pet/:petId')
  findByPetId(@Param('clienteId') clienteId: number, @Param('petId') petId: number) {
    return this.agendamentoService.findByPetId(clienteId, petId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAgendamentoDto: UpdateAgendamentoDto) {
    return this.agendamentoService.update(+id, updateAgendamentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.agendamentoService.remove(+id);
  }
}

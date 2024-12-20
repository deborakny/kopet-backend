import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DisponibilidadeService } from './disponibilidade.service';
import { CreateDisponibilidadeDto } from './dto/create-disponibilidade.dto';
import { UpdateDisponibilidadeDto } from './dto/update-disponibilidade.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Disponibilidades')
@Controller('disponibilidades')
export class DisponibilidadeController {
  constructor(private readonly disponibilidadeService: DisponibilidadeService) {}

  @Post()
  create(@Body() createDisponibilidadeDto: CreateDisponibilidadeDto) {
    return this.disponibilidadeService.create(createDisponibilidadeDto);
  }

  @Get()
  findAll() {
    return this.disponibilidadeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.disponibilidadeService.findOne(+id);
  }

  @Get('funcionario/:id')
  findByFuncionarioId(@Param('id') id: number) {
    return this.disponibilidadeService.findByFuncionarioId(id);
  }

  @Get('servico/:id')
  findByServicoId(@Param('id') id: number) {
    return this.disponibilidadeService.findByServicoId(id);
  }

  @Get('estabelecimento/:id')
  findByEstabelecimentoId(@Param('id') id: number) {
    return this.disponibilidadeService.findByEstabelecimentoId(id);
  }

  @Get('servico/:servicoId/funcionario/:funcionarioId')
  findByServicoIdAndFuncionarioId(@Param('servicoId') servicoId: number, @Param('funcionarioId') funcionarioId: number) {
    return this.disponibilidadeService.findByServicoIdAndFuncionarioId(servicoId, funcionarioId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDisponibilidadeDto: UpdateDisponibilidadeDto) {
    return this.disponibilidadeService.update(+id, updateDisponibilidadeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.disponibilidadeService.remove(+id);
  }
  
  @Delete('data/:id')
  removeDataDisponivel(@Param('id') id: string) {
    return this.disponibilidadeService.removeDataDisponivel(+id);
  }
}

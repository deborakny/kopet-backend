import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HorarioFuncionamentoService } from './horario-funcionamento.service';
import { CreateHorarioFuncionamentoDto } from './dto/create-horario-funcionamento.dto';
import { UpdateHorarioFuncionamentoDto } from './dto/update-horario-funcionamento.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Estabelecimentos')
@Controller('horario-funcionamento')
export class HorarioFuncionamentoController {
  constructor(private readonly horarioFuncionamentoService: HorarioFuncionamentoService) {}

  //@Post()
  //create(@Body() createHorarioFuncionamentoDto: CreateHorarioFuncionamentoDto) {
  //  return this.horarioFuncionamentoService.create(createHorarioFuncionamentoDto);
  //}

  @Get()
  findAll() {
    return this.horarioFuncionamentoService.findAll();
  }

  @Get('estabelecimento/:id')
  findByEstabelecimento(@Param('id') estabelecimentoId: string) {
    return this.horarioFuncionamentoService.findByEstabelecimento(+estabelecimentoId);
  }

  @Patch('estabelecimento/:id')
  updateByEstabelecimento(@Param('id') estabelecimentoId: string, @Body() updateHorarioFuncionamentoDto: UpdateHorarioFuncionamentoDto[]) {
    return this.horarioFuncionamentoService.updateByEstabelecimento(+estabelecimentoId, updateHorarioFuncionamentoDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.horarioFuncionamentoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHorarioFuncionamentoDto: UpdateHorarioFuncionamentoDto) {
    return this.horarioFuncionamentoService.update(+id, updateHorarioFuncionamentoDto);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.horarioFuncionamentoService.remove(+id);
  }
}

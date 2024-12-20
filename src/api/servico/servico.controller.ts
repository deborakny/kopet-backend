import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServicoService } from './servico.service';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Servicos')
@Controller('servicos')
export class ServicoController {
  constructor(private readonly servicoService: ServicoService) {}

  @Post()
  create(@Body() createServicoDto: CreateServicoDto) {
    return this.servicoService.create(createServicoDto);
  }

  @Get()
  findAll() {
    return this.servicoService.findAll();
  }

  @Get('estabelecimento/:id')
  findByEstabelecimentoId(@Param('id') id: number) {
    return this.servicoService.findByEstabelecimentoId(id);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.servicoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServicoDto: UpdateServicoDto) {
    return this.servicoService.update(+id, updateServicoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicoService.remove(+id);
  }
}

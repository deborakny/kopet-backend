import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EstabelecimentoService } from './estabelecimento.service';
import { CreateEstabelecimentoDto } from './dto/create-estabelecimento.dto';
import { UpdateEstabelecimentoDto } from './dto/update-estabelecimento.dto';
import { GetEstabelecimentoNomeDto } from './dto/get-estabelecimento-nome';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Estabelecimentos')
@Controller('estabelecimentos')
export class EstabelecimentoController {
  constructor(private readonly estabelecimentoService: EstabelecimentoService) {}

  @Post()
  create(@Body() createEstabelecimentoDto: CreateEstabelecimentoDto) {
    return this.estabelecimentoService.create(createEstabelecimentoDto);
  }

  @Get()
  findAll() {
    return this.estabelecimentoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estabelecimentoService.findOne(+id);
  }

  @Post('/nome')
  findByName(@Body() getEstabelecimentoDto: GetEstabelecimentoNomeDto){
    return this.estabelecimentoService.findByName(getEstabelecimentoDto.nome);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEstabelecimentoDto: UpdateEstabelecimentoDto) {
    return this.estabelecimentoService.update(+id, updateEstabelecimentoDto);
  }
}

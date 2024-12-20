import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FuncionarioService } from './funcionario.service';
import { CreateFuncionarioDto } from './dto/create-funcionario.dto';
import { UpdateFuncionarioDto } from './dto/update-funcionario.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Funcionarios')
@Controller('funcionarios')
export class FuncionarioController {
  constructor(private readonly funcionarioService: FuncionarioService) {}

  @Post()
  create(@Body() createFuncionarioDto: CreateFuncionarioDto) {
    return this.funcionarioService.create(createFuncionarioDto);
  }

  @Get()
  findAll() {
    return this.funcionarioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.funcionarioService.findOne(id);
  }

  @Get('servico/:id')
  findByServicoId(@Param('id') id: number) {
    return this.funcionarioService.findByServicoId(id);
  }

  @Get('estabelecimento/:id')
  findByEstabelecimentoId(@Param('id') id: number) {
    return this.funcionarioService.findByEstabelecimentoId(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFuncionarioDto: UpdateFuncionarioDto) {
    return this.funcionarioService.update(+id, updateFuncionarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.funcionarioService.remove(+id);
  }
}

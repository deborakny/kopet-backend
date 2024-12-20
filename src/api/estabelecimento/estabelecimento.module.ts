import { Module } from '@nestjs/common';
import { EstabelecimentoService } from './estabelecimento.service';
import { EstabelecimentoController } from './estabelecimento.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstabelecimentoEntity } from './entities/estabelecimento.entity';
import { EnderecoEntity } from './entities/endereco.entity';
import { HorarioFuncionamentoEntity } from '../horario-funcionamento/entities/horario-funcionamento.entity';

@Module({
  imports:[TypeOrmModule.forFeature([EstabelecimentoEntity,EnderecoEntity, HorarioFuncionamentoEntity])],
  controllers: [EstabelecimentoController],
  providers: [EstabelecimentoService],
  exports:[EstabelecimentoService]
})
export class EstabelecimentoModule {}

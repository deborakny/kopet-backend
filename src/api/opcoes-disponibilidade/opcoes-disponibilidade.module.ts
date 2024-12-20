import { Module } from '@nestjs/common';
import { OpcoesDisponibilidadeService } from './opcoes-disponibilidade.service';
import { OpcoesDisponibilidadeController } from './opcoes-disponibilidade.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgendamentoEntity } from '../agendamento/entities/agendamento.entity';
import { DisponibilidadeEntity } from '../disponibilidade/entities/disponibilidade.entity';
import { ServicoEntity } from '../servico/entities/servico.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AgendamentoEntity, DisponibilidadeEntity, ServicoEntity])],
  controllers: [OpcoesDisponibilidadeController],
  providers: [OpcoesDisponibilidadeService],
})
export class OpcoesDisponibilidadeModule {}

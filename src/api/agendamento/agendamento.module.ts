import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgendamentoController } from './agendamento.controller';
import { AgendamentoService } from './agendamento.service';
import { AgendamentoEntity } from './entities/agendamento.entity';
import { NotificacaoModule } from '../notificacao/notificacao.module';
import { EstabelecimentoModule } from '../estabelecimento/estabelecimento.module';
import { ClienteModule } from '../cliente/cliente.module';
import { ServicoModule } from '../servico/servico.module';
import { FuncionarioModule } from '../funcionario/funcionario.module';

@Module({
  imports:[
    NotificacaoModule,
    EstabelecimentoModule,
    ClienteModule,
    ServicoModule,
    FuncionarioModule,
    TypeOrmModule.forFeature([AgendamentoEntity])],
  controllers: [AgendamentoController],
  providers: [AgendamentoService],
})
export class AgendamentoModule {}

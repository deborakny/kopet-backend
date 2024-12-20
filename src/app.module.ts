import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfigService } from './config/postgres.config.service';
import { ContaModule } from './api/conta/conta.module';
import { ClienteModule } from './api/cliente/cliente.module';
import { PetModule } from './api/pet/pet.module';
import { EstabelecimentoModule } from './api/estabelecimento/estabelecimento.module';
import { ServicoModule } from './api/servico/servico.module';
import { FuncionarioModule } from './api/funcionario/funcionario.module';
import { DisponibilidadeModule } from './api/disponibilidade/disponibilidade.module';
import { AgendamentoModule } from './api/agendamento/agendamento.module';
import { OpcoesDisponibilidadeModule } from './api/opcoes-disponibilidade/opcoes-disponibilidade.module';
import { AuthModule } from './api/auth/auth.module';
import { NotificacaoModule } from './api/notificacao/notificacao.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailgunConfigService } from './config/mailgun.config.service';
import { HorarioFuncionamentoModule } from './api/horario-funcionamento/horario-funcionamento.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfigService,
      inject: [PostgresConfigService]
    }),
    MailerModule.forRootAsync({
      useClass: MailgunConfigService,
      inject:[MailgunConfigService]
    }),
    ContaModule,
    ClienteModule,
    PetModule,
    EstabelecimentoModule,
    ServicoModule,
    FuncionarioModule,
    DisponibilidadeModule,
    AgendamentoModule,
    OpcoesDisponibilidadeModule,
    AuthModule,
    NotificacaoModule,
    HorarioFuncionamentoModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

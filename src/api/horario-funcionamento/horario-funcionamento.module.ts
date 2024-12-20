import { Module } from '@nestjs/common';
import { HorarioFuncionamentoService } from './horario-funcionamento.service';
import { HorarioFuncionamentoController } from './horario-funcionamento.controller';
import { HorarioFuncionamentoEntity } from './entities/horario-funcionamento.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([HorarioFuncionamentoEntity])],
  controllers: [HorarioFuncionamentoController],
  providers: [HorarioFuncionamentoService],
})
export class HorarioFuncionamentoModule {}

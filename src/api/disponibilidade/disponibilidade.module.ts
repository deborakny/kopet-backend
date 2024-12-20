import { Module } from '@nestjs/common';
import { DisponibilidadeService } from './disponibilidade.service';
import { DisponibilidadeController } from './disponibilidade.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisponibilidadeEntity } from './entities/disponibilidade.entity';
import { DataDisponibilidadeEntity } from './entities/data-disponibilidade.entity';

@Module({
  imports:[TypeOrmModule.forFeature([DisponibilidadeEntity, DataDisponibilidadeEntity])],
  controllers: [DisponibilidadeController],
  providers: [DisponibilidadeService],
})
export class DisponibilidadeModule {}

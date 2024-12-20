import { Module } from '@nestjs/common';
import { ContaService } from './conta.service';
import { ContaController } from './conta.controller';
import { ContaEntity } from './entities/conta.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([ContaEntity])],
  controllers: [ContaController],
  providers: [ContaService],
})
export class ContaModule {}

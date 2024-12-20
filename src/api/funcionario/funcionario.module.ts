import { Module } from '@nestjs/common';
import { FuncionarioService } from './funcionario.service';
import { FuncionarioController } from './funcionario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuncionarioEntity } from './entities/funcionario.entity';

@Module({
  imports:[TypeOrmModule.forFeature([FuncionarioEntity])],
  controllers: [FuncionarioController],
  providers: [FuncionarioService],
  exports: [FuncionarioService],
})
export class FuncionarioModule {}

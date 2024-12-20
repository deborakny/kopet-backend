import { Module } from '@nestjs/common';
import { ServicoService } from './servico.service';
import { ServicoController } from './servico.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicoEntity } from './entities/servico.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServicoEntity])],
  controllers: [ServicoController],
  providers: [ServicoService],
  exports:[ServicoService]
})
export class ServicoModule {}

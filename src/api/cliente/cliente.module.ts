import { Module } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ClienteController } from './cliente.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteEntity } from './entities/cliente.entity';
import { ContaEntity } from 'src/api/conta/entities/conta.entity';
import { PetEntity } from 'src/api/pet/entities/pet.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ClienteEntity,ContaEntity,PetEntity])],
  controllers: [ClienteController],
  providers: [ClienteService],
  exports: [ClienteService]
})
export class ClienteModule {}

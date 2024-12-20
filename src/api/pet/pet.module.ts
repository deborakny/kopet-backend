import { Module } from '@nestjs/common';
import { PetService } from './pet.service';
import { PetController } from './pet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetEntity } from './entities/pet.entity';
import { ClienteEntity } from 'src/api/cliente/entities/cliente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PetEntity, ClienteEntity])],
  controllers: [PetController],
  providers: [PetService],
})
export class PetModule {}

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContaEntity } from '../conta/entities/conta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContaEntity])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

import { PartialType } from '@nestjs/mapped-types';
import { CreateDisponibilidadeDto } from './create-disponibilidade.dto';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { UpdateDataDisponibilidadeDto } from './update-data-disponibilidade.dto';

export class UpdateDisponibilidadeDto {
    @IsOptional()
    @IsNumber()
    id: number;

    @IsOptional()
    @IsNumber()
    estabelecimentoId: number;

    @IsOptional()
    @IsNumber()
    servicoId: number;

    @IsOptional()
    @IsNumber()
    funcionarioId: number;

    @IsOptional()
    datasDisponibilidade: UpdateDataDisponibilidadeDto[]
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateDisponibilidadeDto, CreateDisponibilidadeIdDto } from './create-disponibilidade.dto';

export class CreateDataDisponibilidadeDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    dia: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    horarioInicio: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    horarioFim: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    pausaInicio: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    pausaFim: string;

    @ApiProperty({
        example: { id: 1 },
        type: () => CreateDisponibilidadeDto
    })
    @IsNotEmpty()
    disponibilidade?: CreateDisponibilidadeDto;
}
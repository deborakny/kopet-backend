import { PartialType } from "@nestjs/mapped-types";
import { CreateDataDisponibilidadeDto } from "./create-data-disponibilidade.dto";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { CreateDisponibilidadeDto, CreateDisponibilidadeIdDto } from "./create-disponibilidade.dto";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateDataDisponibilidadeDto extends PartialType(CreateDataDisponibilidadeDto) {
    @IsNotEmpty()
    @IsNumber()
    id?:number;
}

export class UpdateCreatingDataDisponibilidadeDto {
    @IsNotEmpty()
    @IsNumber()
    id?:number;
    
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

    
    @ApiProperty(
        {
            example: {
                id:1
            },
            type: () => CreateDisponibilidadeIdDto
        }
    )
    @IsNotEmpty()
    disponibilidade?: CreateDisponibilidadeIdDto;
}

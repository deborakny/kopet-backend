import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { CreateDataDisponibilidadeDto } from "./create-data-disponibilidade.dto";
import { ApiProperty } from "@nestjs/swagger";

export class CreateDisponibilidadeDto {    
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    estabelecimentoId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    servicoId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    funcionarioId: number;

    @ApiProperty({
        isArray: true,
        type: CreateDataDisponibilidadeDto
    })
    @IsNotEmpty()
    datasDisponibilidade: CreateDataDisponibilidadeDto[];

}

export class CreateDisponibilidadeIdDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    id: number;
}

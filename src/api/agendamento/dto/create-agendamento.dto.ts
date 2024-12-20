import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAgendamentoDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    petId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    servicoId: number
    
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    funcionarioId: number;
    
    @ApiProperty()
    @IsString()
    @IsOptional()
    status?:string;

    @ApiProperty()
    @IsNotEmpty()
    dia: string;

    @ApiProperty()
    @IsNotEmpty()
    hora: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    estabelecimentoId: number
    
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    clienteId: number;
}

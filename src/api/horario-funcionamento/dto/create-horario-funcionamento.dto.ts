import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CreateEstabelecimentoIdDto } from "src/api/estabelecimento/dto/create-estabelecimento.dto";

export class CreateHorarioFuncionamentoDto {
    @ApiProperty(
        {
            example: 1
        }
    )
    @IsNumber()
    @IsOptional()
    id?: number;

    @ApiProperty(
        {
            example: 1
        }
    )
    @IsNumber()
    @IsNotEmpty()
    dia: number;
    
    @ApiProperty(
        {
            example: '09:00'
        }
    )
    @IsNotEmpty()
    @IsString()
    horaInicial: string;

    @ApiProperty(
        {
            example: '18:00'
        }
    )
    @IsNotEmpty()
    @IsString()
    horaFinal: string;

    @ApiProperty(
        {
            example: {
                id:1
            }
        }
    )
    @IsNotEmpty()
    estabelecimento: CreateEstabelecimentoIdDto;
}


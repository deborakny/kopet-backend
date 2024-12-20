import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CreateEstabelecimentoIdDto } from "src/api/estabelecimento/dto/create-estabelecimento.dto";

export class CreateServicoDto {
    @ApiProperty(
        {
            example: 'Banho e Tosa'
        }
    )
    @IsNotEmpty()
    @IsString()
    nome: string;

    @ApiProperty(
        {
            example: 75.50
        }
    )
    @IsOptional()
    @IsNumber()
    valor: number;

    @ApiProperty(
        {
            example: 60
        }
    )
    @IsNumber()
    @IsNotEmpty()
    duracao: number;

    @IsOptional()
    @IsString()
    informacoesAdicionais: string;

    @ApiProperty()
    @IsNotEmpty()
    estabelecimento: CreateEstabelecimentoIdDto;
}

export class CreateServicoIdDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    id: number;
}

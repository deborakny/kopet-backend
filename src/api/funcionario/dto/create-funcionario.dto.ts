import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CreateEstabelecimentoIdDto } from "src/api/estabelecimento/dto/create-estabelecimento.dto";
import { CreateServicoIdDto } from "src/api/servico/dto/create-servico.dto";

export class CreateFuncionarioDto {
    
    @ApiProperty(
        {
            example: "Maria"
        }
    )
    @IsNotEmpty()
    @IsString()
    nome: string;

    @ApiProperty(
        {
            example: "Santos"
        }
    )
    @IsNotEmpty()
    @IsString()
    sobrenome: string;

    @ApiProperty(
        {
            example: "780.460.320-77"
        }
    )
    @IsNotEmpty()
    @IsString()
    cpf: string;

    @ApiProperty(
        {
            example: "mariasantos@gmail.com"
        }
    )
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    email: string;

    @ApiProperty(
        {
            example: "11 9855-8877"
        }
    )
    @IsOptional()
    @IsString()
    telefone: string;

    @IsOptional()
    @IsString()
    informacoesAdicionais: string;

    @ApiProperty()
    @IsNotEmpty()
    estabelecimento: CreateEstabelecimentoIdDto;

    @ApiProperty()
    @IsNotEmpty()
    servicos: CreateServicoIdDto[];
}


export class CreateFuncionarioIdDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    id: number;
}

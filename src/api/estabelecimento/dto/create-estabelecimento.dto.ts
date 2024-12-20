import { IsNotEmpty, IsNumber, IsOptional, IsString, isNotEmpty } from "class-validator";
import { CreateContaDto } from "src/api/conta/dto/create-conta.dto";
import { CreateEnderecoDto } from "./create-endereco.dto";
import { CreateHorarioFuncionamentoDto } from "./create-horario-funcionamento.dto";
import { ApiProperty } from "@nestjs/swagger";

export class CreateEstabelecimentoDto {
    @ApiProperty(
        {
            example:"Pet Show"
        }
    )
    @IsString()
    @IsNotEmpty()
    nome: string;

    @ApiProperty(
        {
            example:"55.682.979/0001-17"
        }
    )
    @IsString()
    @IsNotEmpty()
    cnpj: string;
    
    @ApiProperty(
        {
            example:"11 99955-4532"
        }
    )
    @IsOptional()
    @IsString()
    telefone: string;

    @ApiProperty()
    @IsNotEmpty()
    endereco: CreateEnderecoDto;

    @ApiProperty(
        {
            isArray: true,
            type: CreateHorarioFuncionamentoDto
        }
    )
    @IsOptional()
    horariosFuncionamento: CreateHorarioFuncionamentoDto[];

    @ApiProperty()
    @IsNotEmpty()
    conta: CreateContaDto;
}

export class CreateEstabelecimentoIdDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    id: number;
}


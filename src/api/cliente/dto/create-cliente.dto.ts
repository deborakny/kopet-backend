import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CreateContaDto } from "src/api/conta/dto/create-conta.dto";

export class CreateClienteDto {
    @ApiProperty(
        {
            example: 'Ana'
        }
    )
    @IsString()
    @IsNotEmpty()
    nome: string;

    @ApiProperty(
        {
            example: 'Rodrigues'
        }
    )
    @IsString()
    @IsNotEmpty()
    sobrenome: string;

    @ApiProperty(
        {
            example: '11987221801'
        }
    )
    @IsString()
    @IsNotEmpty()
    telefone: string;

    @ApiProperty()
    @IsNotEmpty()
    conta: CreateContaDto;
}

export class CreateClienteIdDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    id: number;
}


import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateEnderecoDto{
    @ApiProperty(
        {
            example: '01525-025'
        }
    )
    @IsNotEmpty()
    @IsString()
    cep: string;

    @ApiProperty(
        {
            example: 'Rua Exemplo'
        }
    )
    @IsString()
    @IsNotEmpty()
    logradouro: string;

    @ApiProperty(
        {
            example: '145'
        }
    )
    @IsNotEmpty()
    @IsString()
    numero: string;

    @IsOptional()
    @IsString()
    complemento: string;
    
    @ApiProperty(
        {
            example: 'Vila Exemplo'
        }
    )
    @IsNotEmpty()
    @IsString()
    bairro: string;
    
    @ApiProperty(
        {
            example: 'São Paulo'
        }
    )
    @IsNotEmpty()
    @IsString()
    cidade: string;
    
    @ApiProperty(
        {
            example: 'SP'
        }
    )
    @IsNotEmpty()
    @IsString()
    estado: string;
}


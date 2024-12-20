import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { CreateClienteIdDto } from "src/api/cliente/dto/create-cliente.dto";



export class CreatePetDto {

    @ApiProperty(
        {
            example: 'Luna'
        }
    )
    @IsString()
    @IsNotEmpty()
    nome: string;

    @ApiProperty(
        {
            example: 'cachorro'
        }
    )
    @IsString()
    @IsNotEmpty()
    especie: string;

    @ApiProperty(
        {
            example: 'lhasa apso',
            enum: {
                LHASA: 'Lhasa Apso',
                PINSCHER: 'Pinscher',
                SHIH_TZU: 'Shih-tzu'
            }
        }
    )
    @IsString()
    @IsNotEmpty()
    raca: string;

    @ApiProperty(
        {
            example: 'F'
        }
    )
    @IsString()
    @MaxLength(1)
    @IsNotEmpty()
    sexo: string;

    @ApiProperty(
        {
            example: 'P'
        }
    )
    @IsString()
    @MaxLength(1)
    @IsNotEmpty()
    porte: string;

    @IsOptional()
    dadosAdicionais: string;

    @ApiProperty()
    @IsNotEmpty()
    cliente: CreateClienteIdDto;
    
}

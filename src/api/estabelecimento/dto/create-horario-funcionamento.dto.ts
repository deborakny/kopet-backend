import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class CreateHorarioFuncionamentoDto{
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
}
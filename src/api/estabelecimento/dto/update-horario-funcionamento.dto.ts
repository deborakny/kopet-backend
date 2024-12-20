import { PartialType } from '@nestjs/mapped-types';
import { CreateEnderecoDto } from "./create-endereco.dto";
import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateHorarioFuncionamentoDto } from './create-horario-funcionamento.dto';

export class UpdateHorarioFuncionamentoDto extends PartialType(CreateHorarioFuncionamentoDto){
    @IsNotEmpty()
    @IsNumber()
    id:number;
}
import { IsOptional, IsString } from 'class-validator';
import { UpdateEnderecoDto } from './update-endereco.dto';
import { UpdateHorarioFuncionamentoDto } from './update-horario-funcionamento.dto';

export class UpdateEstabelecimentoDto{
    @IsString()
    @IsOptional()
    nome: string;

    @IsString()
    @IsOptional()
    cnpj: string;

    @IsOptional()
    @IsString()
    telefone: string;

    @IsOptional()
    endereco: UpdateEnderecoDto;

    @IsOptional()
    horariosFuncionamento:UpdateHorarioFuncionamentoDto[];
}

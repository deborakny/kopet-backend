import { ListContaDto } from "src/api/conta/dto/list-conta.dto";
import { EnderecoEntity } from "../entities/endereco.entity";
import { DisponibilidadeEntity } from "src/api/disponibilidade/entities/disponibilidade.entity";
import { HorarioFuncionamentoEntity } from "src/api/horario-funcionamento/entities/horario-funcionamento.entity";

export class ListEstabelecimentoDto {
    constructor(
        readonly id: number,
        readonly nome: string,
        readonly cnpj: string,
        readonly telefone: string,
    ) { }
    conta: ListContaDto;
    endereco: EnderecoEntity;
    horariosFuncionamento: HorarioFuncionamentoEntity[];
    disponibilidades: DisponibilidadeEntity[];
}
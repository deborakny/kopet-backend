import { Moment } from "moment";

export class ListOpcoesDatasDisponibilidadeDto{
    constructor(
        readonly id: number,
        readonly dia: number,
        readonly horarios: string[],
    ){}
}

export class ListOpcoesDisponibilidadeDto {
    constructor(
        readonly id: number,
        readonly estabelecimentoId: number,
        readonly funcionarioId: number,
        readonly servicoId: number,
        readonly datasDisponibilidade: ListOpcoesDatasDisponibilidadeDto[],
    ){}
}
export class HorarioDisponivel {
    estabelecimentoId: number;
    servicoId: number;
    funcionarioIds: number[];

    hora: string
}

export class OpcoesDisponibilidade {

    dataDia: string;

    horarios: HorarioDisponivel[];
}

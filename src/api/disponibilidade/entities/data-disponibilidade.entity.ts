import { EstabelecimentoEntity } from "src/api/estabelecimento/entities/estabelecimento.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DisponibilidadeEntity } from "./disponibilidade.entity";

@Entity({ name: 'datas_disponibilidade' })
export class DataDisponibilidadeEntity {
    constructor(dataDisponibilidadeEntity: Partial<DataDisponibilidadeEntity>) {
        Object.assign(this, dataDisponibilidadeEntity);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'dia', type: 'integer', nullable: false })
    dia: number;

    @Column({ name: 'horario_inicio', type: 'time', nullable: false })
    horarioInicio: string;

    @Column({ name: 'horario_fim', type: 'time', nullable: false })
    horarioFim: string;

    @Column({ name: 'pausa_inicio', type: 'time', nullable: false })
    pausaInicio: string;

    @Column({ name: 'pausa_fim', type: 'time', nullable: false })
    pausaFim: string;
    
    //estabelecimento: EstabelecimentoEntity;

    @ManyToOne(
        () => DisponibilidadeEntity,
        (disponibilidade) => disponibilidade.datasDisponibilidade,
        { onDelete:'CASCADE', onUpdate:'CASCADE', orphanedRowAction: 'delete'}
    )
    @JoinColumn({
        name: 'disponibilidade_serv_func_id',
        referencedColumnName: 'id'
    })
    disponibilidade: DisponibilidadeEntity;

}

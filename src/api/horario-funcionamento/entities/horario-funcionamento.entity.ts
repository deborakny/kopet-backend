import { EstabelecimentoEntity } from './../../estabelecimento/entities/estabelecimento.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: 'horarios_funcionamento' })
export class HorarioFuncionamentoEntity {
    constructor(horarioFuncionamento: Partial<HorarioFuncionamentoEntity>) {
        Object.assign(this, horarioFuncionamento);
    }

    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'dia', nullable: false })
    dia: number;
    
    @Column({ name: 'hora_inicial', nullable: false })
    horaInicial: string;

    @Column({ name: 'hora_final', nullable: false })
    horaFinal: string;

    @ManyToOne(
        () => EstabelecimentoEntity,
        (estabelecimento) => estabelecimento.horariosFuncionamento,
        { onDelete:'CASCADE', onUpdate:'CASCADE', orphanedRowAction: 'delete'}
    )
    @JoinColumn({
        name: 'estabelecimento_id',
        referencedColumnName: 'id'
    })
    estabelecimento: EstabelecimentoEntity;
}
import { EstabelecimentoEntity } from "src/api/estabelecimento/entities/estabelecimento.entity";
import { FuncionarioEntity } from "src/api/funcionario/entities/funcionario.entity";
import { ServicoEntity } from "src/api/servico/entities/servico.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { DataDisponibilidadeEntity } from "./data-disponibilidade.entity";

@Entity({ name: 'disponibilidades_serv_func'})
export class DisponibilidadeEntity {
    constructor(disponibilidade: Partial<DisponibilidadeEntity>) {
        Object.assign(this, disponibilidade);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(
        () => EstabelecimentoEntity,
        (estabelecimento) => estabelecimento.disponibilidades,
        { onDelete: 'CASCADE'}
    )
    @JoinColumn({
        name: 'estabelecimento_id',
        referencedColumnName: 'id'
    })
    estabelecimento: EstabelecimentoEntity;

    
    @Column({ name: 'estabelecimento_id' })
    estabelecimentoId: number;

    @ManyToOne(
        () => ServicoEntity,
        (servico) => servico.disponibilidades,
        { onDelete: 'CASCADE'}
    )
    @JoinColumn({
        name: 'servico_id',
        referencedColumnName: 'id'
    })
    servico: ServicoEntity;

    @Column({ name: 'servico_id' })
    servicoId: number;

    @ManyToOne(
        () => FuncionarioEntity,
        (funcionario) => funcionario.disponibilidades,
        { onDelete: 'CASCADE' }
    )
    @JoinColumn({
        name: 'funcionario_id',
        referencedColumnName: 'id'
    })
    funcionario: FuncionarioEntity;

    @Column({ name: 'funcionario_id' })
    funcionarioId: number;

    @OneToMany(
        () => DataDisponibilidadeEntity,
        (dataDisponibilidade) => dataDisponibilidade.disponibilidade,
        { orphanedRowAction: 'delete' , cascade: true }
    )
    datasDisponibilidade: DataDisponibilidadeEntity[]
 }

import { ClienteEntity } from "src/api/cliente/entities/cliente.entity";
import { EstabelecimentoEntity } from "src/api/estabelecimento/entities/estabelecimento.entity";
import { FuncionarioEntity } from "src/api/funcionario/entities/funcionario.entity";
import { PetEntity } from "src/api/pet/entities/pet.entity";
import { ServicoEntity } from "src/api/servico/entities/servico.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'agendamentos' })
export class AgendamentoEntity { 
    constructor(agendamentoEntity: Partial<AgendamentoEntity>) {
        Object.assign(this, agendamentoEntity);        
    }

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(
        () => PetEntity,
        (pet) => pet.agendamentos,
        { orphanedRowAction: 'delete', onDelete: 'CASCADE' }
    )
    @JoinColumn({
        name: 'pet_id',
        referencedColumnName: 'id'
    })
    pet: PetEntity;

    @Column({ name:'pet_id', type: 'integer', nullable: false })
    petId: number;

    @ManyToOne(
        () => ServicoEntity,
        (servico) => servico.agendamentos,
        { orphanedRowAction: 'delete', onDelete: 'CASCADE' }
    )
    @JoinColumn({
        name: 'servico_id',
        referencedColumnName: 'id'
    })
    servico: ServicoEntity;

    @Column({ name: 'servico_id', type: 'integer', nullable: false })
    servicoId: number;

    @ManyToOne(
        () => FuncionarioEntity,
        (funcionario) => funcionario.agendamentos,
        { orphanedRowAction: 'delete', onDelete: 'CASCADE' }
    )
    @JoinColumn({
        name: 'funcionario_id',
        referencedColumnName: 'id'
    })
    funcionario: FuncionarioEntity;

    @Column({ name: 'funcionario_id', type: 'integer', nullable: false})
    funcionarioId: number;

    @Column({name: 'status', type: 'varchar', length: 11, default:'Agendado',nullable: false})
    status:string;

    @Column({ name: 'dia', type: 'date', nullable: false })
    dia: string;

    @Column({ name: 'hora', type: 'time', nullable: false })
    hora: string;

    @ManyToOne(
        () => EstabelecimentoEntity,
        (estabelecimento) => estabelecimento.agendamentos,
        { orphanedRowAction: 'delete', onDelete: 'CASCADE' }
    )
    @JoinColumn({
        name: 'estabelecimento_id',
        referencedColumnName: 'id'
    })
    estabelecimento: EstabelecimentoEntity;

    @Column({ name: 'estabelecimento_id', type: 'integer', nullable: false})
    estabelecimentoId: number;

    @ManyToOne(
        () => ClienteEntity,
        (cliente) => cliente.agendamentos,
        { orphanedRowAction: 'delete', onDelete: 'CASCADE' }
    )
    @JoinColumn({
        name: 'cliente_id',
        referencedColumnName: 'id'
    })
    cliente: ClienteEntity;

    @Column({ name: 'cliente_id', type: 'integer', nullable: false})
    clienteId: number;
}

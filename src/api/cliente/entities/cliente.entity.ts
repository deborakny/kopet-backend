import { AgendamentoEntity } from "src/api/agendamento/entities/agendamento.entity";
import { ContaEntity } from "src/api/conta/entities/conta.entity";
import { PetEntity } from "src/api/pet/entities/pet.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from "typeorm";

@Entity({ name: 'clientes' })
export class ClienteEntity {

    constructor(cliente: Partial<ClienteEntity>) {
        Object.assign(this, cliente);
    }

    @Column({ name: 'nome', length: 100, nullable: false })
    nome: string;

    @Column({ name: 'sobrenome', length: 100, nullable: false })
    sobrenome: string;

    @Column({ name: 'telefone', length: 100, nullable: false })
    telefone: string;

    @PrimaryColumn()
    id: number;

    @OneToOne(() => ContaEntity,
        {
            cascade: true,
            orphanedRowAction: 'delete',
            onDelete: 'CASCADE'
        }
    )
    @JoinColumn({
        name: 'id',
        referencedColumnName: 'id'
    })
    conta: ContaEntity;

    @OneToMany(
        () => PetEntity,
        (pet) => pet.cliente,
        { cascade: true, eager: true }
    )
    pets: PetEntity[];

    @OneToMany(
        () => AgendamentoEntity,
        (agendamento) => agendamento.cliente,
        { cascade: true }
    )
    agendamentos: AgendamentoEntity[];
}


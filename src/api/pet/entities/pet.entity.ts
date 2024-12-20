import { AgendamentoEntity } from "src/api/agendamento/entities/agendamento.entity";
import { ClienteEntity } from "src/api/cliente/entities/cliente.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'pets' })
export class PetEntity {

    constructor(pet: Partial<PetEntity>) {
        Object.assign(this, pet) 
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'nome', type: 'varchar', length: 100, nullable: false })
    nome: string;

    @Column({ name: 'especie', type: 'varchar', length: 100, nullable: false })
    especie: string;

    @Column({ name: 'raca', type: 'varchar', length: 100, nullable: false })
    raca: string;

    @Column({ name: 'sexo', type: 'char', length: 1, nullable: false })
    sexo: string;

    @Column({ name: 'porte', type: 'char', length: 1, nullable: false })
    porte: string;

    @Column({ name: 'dados_adicionais', type: 'text', nullable: true })
    dadosAdicionais: string;

    @ManyToOne(
        () => ClienteEntity,
        (cliente) => cliente.pets,
        { orphanedRowAction: 'delete', onDelete: 'CASCADE' }
    )
    @JoinColumn({
        name: 'cliente_id',
        referencedColumnName:'id'
    })
    cliente: ClienteEntity;

    @OneToMany(
        () => AgendamentoEntity,
        (agendamento) => agendamento.pet,
        { cascade: true }
    )
    agendamentos: AgendamentoEntity[];

    // @Column({ name: 'cliente_id', type: 'integer', nullable: false})
    // clienteId: number;
}

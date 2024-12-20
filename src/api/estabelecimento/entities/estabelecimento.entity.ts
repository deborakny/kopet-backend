import { ServicoEntity } from './../../servico/entities/servico.entity';
import { ContaEntity } from "src/api/conta/entities/conta.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { EnderecoEntity } from "./endereco.entity";
import { FuncionarioEntity } from 'src/api/funcionario/entities/funcionario.entity';
import { DisponibilidadeEntity } from 'src/api/disponibilidade/entities/disponibilidade.entity';
import { AgendamentoEntity } from 'src/api/agendamento/entities/agendamento.entity';
import { HorarioFuncionamentoEntity } from 'src/api/horario-funcionamento/entities/horario-funcionamento.entity';

@Entity({ name: 'estabelecimentos' })
export class EstabelecimentoEntity {
    
    constructor(estabelecimento: Partial<EstabelecimentoEntity>) {
        Object.assign(this, estabelecimento);
    }

    @PrimaryColumn({name:'id'})
    id: number;

    @Column({ name: 'nome', length: 100, type: 'varchar', nullable: false})
    nome: string;

    @Column({ name: 'cnpj', unique: true, length: 14, type: 'varchar', nullable: false})
    cnpj: string;

    @Column({ name: 'telefone', length: 11, type: 'varchar', nullable: true})
    telefone: string;

    @OneToOne(
        () => EnderecoEntity,
        (endereco) => endereco.estabelecimento,
        { cascade: true}
    )
    endereco: EnderecoEntity;

    @OneToMany(
        () => HorarioFuncionamentoEntity,
        (horarioFuncionamento) => horarioFuncionamento.estabelecimento,
        { cascade: true }
    )
    horariosFuncionamento: HorarioFuncionamentoEntity[];

    @OneToMany(
        () => ServicoEntity,
        (servico) => servico.estabelecimento,
        { cascade: true }
    )
    servicos: ServicoEntity[];
    
    @OneToMany(
        () => FuncionarioEntity,
        (funcionario) => funcionario.estabelecimento,
        { cascade: true }
    )
    funcionarios: FuncionarioEntity[];

    @OneToMany(
        () => DisponibilidadeEntity,
        (disponibilidade) => disponibilidade.estabelecimento,
        { cascade: true }
    )
    disponibilidades: DisponibilidadeEntity[];

    @OneToOne(
        () => ContaEntity,
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
    conta: ContaEntity

    @OneToMany(
        () => AgendamentoEntity,
        (agendamento) => agendamento.estabelecimento,
        { cascade: true }
    )
    agendamentos: AgendamentoEntity[];
}

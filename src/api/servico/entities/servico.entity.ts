import { AgendamentoEntity } from "src/api/agendamento/entities/agendamento.entity";
import { DisponibilidadeEntity } from "src/api/disponibilidade/entities/disponibilidade.entity";
import { EstabelecimentoEntity } from "src/api/estabelecimento/entities/estabelecimento.entity";
import { FuncionarioEntity } from "src/api/funcionario/entities/funcionario.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'servicos' })
export class ServicoEntity { 
    
    constructor(servico: Partial<ServicoEntity>) {
        Object.assign(this, servico)        
    }

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ name: 'nome', type: 'varchar', length: 100, nullable: false })
    nome: string;

    @Column({ name: 'valor', type:'decimal', scale: 2, nullable: true })
    valor: number;

    @Column({ name: 'duracao', type: 'integer', nullable: false })
    duracao: number;
    
    @Column({ name: 'informacoes_adicionais', type: 'text', nullable: true })
    informacoesAdicionais: string;

    @ManyToOne(
        () => EstabelecimentoEntity,
        (estabelecimento) => estabelecimento.servicos,
        { orphanedRowAction: 'delete' , onDelete: 'CASCADE'}
    )
    @JoinColumn({
        name: 'estabelecimento_id',
        referencedColumnName: 'id'
    })
    estabelecimento: EstabelecimentoEntity;

    @ManyToMany(
        () => FuncionarioEntity,
        (funcionario) => funcionario.servicos,
        { onDelete:'CASCADE' }
    )
    funcionarios: FuncionarioEntity[];

    @OneToMany(
        () => DisponibilidadeEntity,
        (disponibilidade) => disponibilidade.servico,
        { cascade: true }
    )
    disponibilidades: DisponibilidadeEntity[];
    
    @OneToMany(
        () => AgendamentoEntity,
        (agendamento) => agendamento.servico,
        { cascade: true }
    )
    agendamentos: AgendamentoEntity[];
}

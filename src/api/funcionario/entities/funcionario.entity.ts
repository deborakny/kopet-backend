import { AgendamentoEntity } from 'src/api/agendamento/entities/agendamento.entity';
import { DisponibilidadeEntity } from 'src/api/disponibilidade/entities/disponibilidade.entity';
import { EstabelecimentoEntity } from 'src/api/estabelecimento/entities/estabelecimento.entity';
import { ServicoEntity } from 'src/api/servico/entities/servico.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'funcionarios' })
export class FuncionarioEntity {
  constructor(funcionarioEntity: Partial<FuncionarioEntity>) {
    Object.assign(this, funcionarioEntity);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nome', type: 'varchar', length: 100, nullable: false })
  nome: string;

  @Column({ name: 'sobrenome', type: 'varchar', length: 100, nullable: false })
  sobrenome: string;

  @Column({ name: 'cpf', unique:true ,type: 'char', length: 11, nullable: false })
  cpf: string;

  @Column({ name: 'email', unique:true, type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ name: 'telefone', type: 'varchar', length: 11, nullable: true })
  telefone: string;

  @Column({ name: 'informacoes_adicionais', type: 'text', nullable: true })
  informacoesAdicionais: string;

  @ManyToOne(
    () => EstabelecimentoEntity,
    (estabelecimento) => estabelecimento.funcionarios,
    { orphanedRowAction: 'delete', onDelete: 'CASCADE' },
  )
  @JoinColumn({
    name: 'estabelecimento_id',
    referencedColumnName: 'id',
  })
  estabelecimento: EstabelecimentoEntity;

  @ManyToMany(() => ServicoEntity,
    (servico) => servico.funcionarios,
    { cascade: true}
  )
  @JoinTable({
    name: 'funcionarios_servicos',
    joinColumn: {
      name: 'funcionario_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'servico_id',
      referencedColumnName: 'id',
    },
  })
  servicos: ServicoEntity[];

  @OneToMany(
    () => DisponibilidadeEntity,
    (disponibilidade) => disponibilidade.funcionario,
    { cascade: true },
  )
  disponibilidades: DisponibilidadeEntity[];

  @OneToMany(
    () => AgendamentoEntity,
    (agendamento) => agendamento.funcionario,
    { cascade: true }
  )
  agendamentos: AgendamentoEntity[]
}

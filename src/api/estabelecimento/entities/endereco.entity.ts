import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { EstabelecimentoEntity } from "./estabelecimento.entity";

@Entity({ name: 'enderecos' })
export class EnderecoEntity {
    constructor(endereco: Partial<EnderecoEntity>) {
        Object.assign(this, endereco);        
    }

    @PrimaryColumn()
    id: number;

    @OneToOne(
        () => EstabelecimentoEntity,
        (estabelecimento) => estabelecimento.endereco,
        { onUpdate:'CASCADE', onDelete:'CASCADE', orphanedRowAction: 'delete' }
    )
    @JoinColumn(
        {
            name: 'id',
            referencedColumnName: 'id'
        }
    )
    estabelecimento: EstabelecimentoEntity

    @Column({ name: 'cep', type: 'varchar', length: 8, nullable: false})
    cep: string;

    @Column({ name: 'logradouro', type: 'varchar', length: 100, nullable: false})
    logradouro: string;

    @Column({ name: 'numero', type: 'varchar', length: 10, nullable: false})
    numero: string;

    @Column({ name: 'complemento', type: 'varchar', length: 100, nullable: true })
    complemento: string;
    
    @Column({ name: 'bairro', type: 'varchar', length: 100, nullable: false})
    bairro: string;
    
    @Column({ name: 'cidade', type: 'varchar', length: 100, nullable: false})
    cidade: string;
    
    @Column({ name: 'estado', type: 'varchar', length: 2, nullable: false})
    estado: string;
    
    
}
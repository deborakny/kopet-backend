import {
    Column,
    Entity,
    PrimaryGeneratedColumn
} from "typeorm";

@Entity({ name: 'contas' })
export class ContaEntity {
    constructor(conta: Partial<ContaEntity>) {
        Object.assign(this, conta);
    }

    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'email', unique:true, length: 100,  nullable: false })
    email: string;

    @Column({ name: 'senha', length: 255, nullable: false })
    senha: string;

    @Column({ name: 'tipo_estabelecimento', nullable: false, default: false })
    tipoEstabelecimento: boolean;

    // createdAt: string;
    // updatedAt: string;
    // deletedAt: string;

}
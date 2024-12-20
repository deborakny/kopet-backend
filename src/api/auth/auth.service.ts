import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './dto/signIn.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ContaEntity } from '../conta/entities/conta.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(ContaEntity)
        private contaRepository:Repository<ContaEntity>
    ){}

    async signIn(signIn: SignInDto) {
        const conta = await this.contaRepository.findOne({
            where: {
                email:signIn.email,
            }
        });

        if(!conta){
            throw new NotFoundException('E-mail inexistente!');
        }

        if(signIn.senha !== conta.senha){
            throw new UnauthorizedException('E-mail ou senha incorretos');
        }

        const access_token = {
            payload: {
                id:conta.id, //seguindo a padronização jwt seria, na verdade, sub:conta.id
                email:conta.email,
                tipoEstabelecimento:conta.tipoEstabelecimento
            }
        }
        return access_token;
    }
}

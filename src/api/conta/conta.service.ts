import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CreateContaDto } from './dto/create-conta.dto';
import { UpdateContaDto } from './dto/update-conta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ContaEntity } from './entities/conta.entity';
import { Repository } from 'typeorm';
import { ListContaDto } from './dto/list-conta.dto';

@Injectable()
export class ContaService {

  constructor(
    @InjectRepository(ContaEntity)
    private contaRepository:Repository<ContaEntity>
  ){}

  create(createContaDto: CreateContaDto) {
    return 'This action adds a new conta';
  }

  async findAll() {
    const contas = await this.contaRepository.find();
    
    const resultado = {
      ...contas,
      message:"Lista de contas"
    };

    return contas;
  }

  async findOne(id: number) {
    if (!id || isNaN(id)) {
      throw new NotAcceptableException('Id não informado ou não é number');
    }

    const conta = await this.contaRepository.findOne({
      where:{
        id
      }
    });

    if(!conta){
      throw new NotFoundException('Conta não encontrada');
    }

    const contaDto = new ListContaDto(conta.email);
    contaDto.id = conta.id;
    
    return contaDto;
  }

  update(id: number, updateContaDto: UpdateContaDto) {
    return `This action updates a #${id} conta`;
  }

  async remove(id: number) {
    const contaDeletada = await this.contaRepository.delete(id);

    if(!contaDeletada.affected){
      throw new NotFoundException('Conta não encontrada')
    }
    
    const resultado = {
      message: 'Conta removida com sucesso'
    };
    
    return resultado;
  }
}

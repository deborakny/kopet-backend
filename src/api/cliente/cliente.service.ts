import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ClienteEntity } from './entities/cliente.entity';
import { Repository } from 'typeorm';
import { ContaEntity } from 'src/api/conta/entities/conta.entity';
import { PetEntity } from 'src/api/pet/entities/pet.entity';
import { ListClienteDto } from './dto/list-cliente.dto';
import { ListContaDto } from '../conta/dto/list-conta.dto';

@Injectable()
export class ClienteService {

  constructor(
    @InjectRepository(ClienteEntity)
    private clienteRepository: Repository<ClienteEntity>
  ) { }

  async create(createClienteDto: CreateClienteDto) {

    const conta = new ContaEntity({ ...createClienteDto.conta });
    const cliente = new ClienteEntity({
      ...createClienteDto,
      conta
    });

    const dadoSalvo = await this.clienteRepository.save(cliente);

    const resultado = {
      data: dadoSalvo,
      message: 'Dados salvos com sucesso!'

    }
    return resultado;
  }

  async findAll() {
    const clientes = await this.clienteRepository.find({
      relations: {
        conta: true,
        pets: true
      }
    });

    const clientesDto = clientes.map(
      (cliente) => {
        const clienteDto = new ListClienteDto(
          cliente.id,
          cliente.nome,
          cliente.sobrenome,
          cliente.telefone
        );
    
        clienteDto.conta = new ListContaDto(
          cliente.conta.email
        );
    
        clienteDto.pets = [...cliente.pets];

        return clienteDto;
      }
    );

    //const resultado = {
    //  ...clientesDto,
    //  message: "Lista de Clientes"
    //};

    return clientesDto;
  }

  async findOne(id: number) {
    const cliente = await this.clienteRepository.findOne({
      where: {
        id
      },
      relations: {
        conta: true
      }
    });

    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado')
    }

    const clienteDto = new ListClienteDto(
      cliente.id,
      cliente.nome,
      cliente.sobrenome,
      cliente.telefone
    );

    clienteDto.conta = new ListContaDto(
      cliente.conta.email
    );

    clienteDto.pets = [...cliente.pets];
    

    return clienteDto;
  }

  async update(id: number, updateClienteDto: UpdateClienteDto) {
    if(!id || isNaN(id)){
      throw new NotAcceptableException('Id não informado ou não é number')
    }
    const existe = await this.clienteRepository.findOne({
      where:{
        id
      }
    });
    
    if(!existe){
      throw new NotFoundException('Cliente não encontrado')
    }

    const conta = new ContaEntity({
      id,
      ...updateClienteDto.conta
    });

    const cliente = new ClienteEntity({
      ...updateClienteDto,
      conta
    });

    await this.clienteRepository.update(id, cliente);
  }
}

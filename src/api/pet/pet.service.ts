import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Repository } from 'typeorm';
import { PetEntity } from './entities/pet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ClienteEntity } from 'src/api/cliente/entities/cliente.entity';

@Injectable()
export class PetService {
  constructor(
    @InjectRepository(PetEntity)
    private petRepository: Repository<PetEntity>
  ) { }


  async create(createPetDto: CreatePetDto) {
    const cliente = new ClienteEntity({ ...createPetDto.cliente });
    const pet = new PetEntity({ ...createPetDto, cliente });
    const dadosSalvos = await this.petRepository.save(pet);

    const resultado = {
      data: dadosSalvos || '',
      message: 'Pet salvo com sucesso'
    };

    return resultado;
  }

  async findAll() {
    return await this.petRepository.find();
  }

  async findByClientId(id: number) {
    const pets = await this.petRepository.find({
      where: {
        cliente: {
          id
        }
      }
    })
    return pets;
  }

  async findOne(id: number) {
    const pet = await this.petRepository.findOne({
      where: {
        id
      }
    });

    if(!pet){
      throw new NotFoundException('Pet não encontrado');
    }

    return pet;
  }

  async update(id: number, updatePetDto: UpdatePetDto) {
    if (!id || isNaN(id)) {
      throw new NotAcceptableException('Id não informado ou não é number');
    }

    const atualizouPet = await this.petRepository.update(id, updatePetDto);

    if(!atualizouPet.affected){
      throw new NotFoundException('Pet não atualizado');
    }

    const resultado = {
      message: 'Pet atualizado com sucesso'
    };

    return resultado;
  }

  async remove(id: number) {
    if (!id || isNaN(id)) {
      throw new NotAcceptableException('Id não informado ou não é number');
    }

    const deletouPet = await this.petRepository.delete(id);

    if(!deletouPet.affected){
      throw new NotFoundException('Pet não removido');
    }

    const resultado = {
      message: 'Pet removido com sucesso'
    };

    return resultado;
  }

  // private async clienteExiste(id: number) {
    // const clienteSalvo = this.clienteRepository.find(
      // {
        // where: {id}
      // }
    // )
    
    // if (!clienteSalvo) {      
      // throw new Error('Cliente não encontrado!');
    // }
    //return clienteSalvo !== undefined;
  // }
}

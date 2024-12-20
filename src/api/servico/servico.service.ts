import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ServicoEntity } from './entities/servico.entity';
import { Repository } from 'typeorm';
import { EstabelecimentoEntity } from '../estabelecimento/entities/estabelecimento.entity';

@Injectable()
export class ServicoService {
  constructor(
    @InjectRepository(ServicoEntity)
    private servicoRepository: Repository<ServicoEntity>
  ) { }
  
  async create(createServicoDto: CreateServicoDto) {
    const estabelecimento = new EstabelecimentoEntity({ ...createServicoDto.estabelecimento });
    const servico = new ServicoEntity({ ...createServicoDto, estabelecimento });
    const dadosSalvos = await this.servicoRepository.save(servico);
    
    return {
      data: dadosSalvos,
      message: "Serviço salvo com sucesso!"
    }
  }

  async findAll() {
    const servicos = await this.servicoRepository.find({
      relations: {
        estabelecimento: true,
        // funcionarios: true,
        disponibilidades:true
      }
    });
    return servicos;
  }

  async findByEstabelecimentoId(id: number) {
    const servicos = await this.servicoRepository.find({
      where: {
        estabelecimento: {
          id
        }
      },
      relations: {
        funcionarios: true,
        disponibilidades:true,
      }
    })
    return servicos;
  }

  async findOne(id: number) {
    const servico = await this.servicoRepository.findOne({
      where: {
        id
      }
    });
    return servico;
  }

  async update(id: number, updateServicoDto: UpdateServicoDto) {
    if (!id || isNaN(id)) {
      throw new NotAcceptableException('Id não informado ou não é number');
    }

    const atualizouServico = await this.servicoRepository.update(id, updateServicoDto);

    if(!atualizouServico.affected){
      throw new NotFoundException('Serviço não atualizado');
    }

    const resultado = {
      message: 'Serviço atualizado com sucesso'
    };

    return resultado;
  }

  async remove(id: number) {
    if (!id || isNaN(id)) {
      throw new NotAcceptableException('Id não informado ou não é number');
    }

    const atualizouServico = await this.servicoRepository.delete(id);

    if(!atualizouServico.affected){
      throw new NotFoundException('Serviço não removido');
    }

    const resultado = {
      message: 'Serviço removido com sucesso'
    };

    return resultado;
  }
}

import { FuncionarioEntity } from 'src/api/funcionario/entities/funcionario.entity';
import { Inject, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CreateFuncionarioDto } from './dto/create-funcionario.dto';
import { UpdateFuncionarioDto } from './dto/update-funcionario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstabelecimentoEntity } from '../estabelecimento/entities/estabelecimento.entity';
import { ServicoEntity } from '../servico/entities/servico.entity';

@Injectable()
export class FuncionarioService {
  constructor(
    @InjectRepository(FuncionarioEntity)
    private funcionarioRepository: Repository<FuncionarioEntity>
  ) { }
  
  async create(createFuncionarioDto: CreateFuncionarioDto) {
    const estabelecimento = new EstabelecimentoEntity({ ...createFuncionarioDto.estabelecimento });
    const servicos = createFuncionarioDto.servicos.map(
      (servico) => new ServicoEntity({ ...servico })
    )
    const funcionario = new FuncionarioEntity({ ...createFuncionarioDto, estabelecimento, servicos });
    const dadosSalvos = await this.funcionarioRepository.save(funcionario);

    return {
      data: dadosSalvos,
      message: "Funcionário salvo com sucesso!"
    }
  }

  async findAll() {
    const funcionarios = await this.funcionarioRepository.find({
      relations: {
        servicos: true,
        disponibilidades: true
      }
    });
    return funcionarios;
  }

  async findOne(id: number) {
    const funcionario = await this.funcionarioRepository.findOne({
      where: {
        id
      },
      relations: {
        servicos: true
      }
    })
    return funcionario;
  }

  async findByServicoId(id: number) {
    const funcionarios = await this.funcionarioRepository.find({
      where: {
        servicos: {
          id
        }
      }
    })
    return funcionarios;
    
  }

  async findByEstabelecimentoId(id: number) {
    const funcionarios = await this.funcionarioRepository.find({
      where: {
        estabelecimento: {
          id
        },
      },
      relations:{
        servicos:true
      }
    })
    return funcionarios;
  }

  async update(id: number, updateFuncionarioDto: UpdateFuncionarioDto) {
    if (!id || isNaN(id)) {
      throw new NotAcceptableException('Id não informado ou não é number');
    }

    const atualizouFuncionario = await this.funcionarioRepository.save(
      {
        id,
        nome: updateFuncionarioDto.nome,
        sobrenome: updateFuncionarioDto.sobrenome,
        telefone: updateFuncionarioDto.telefone,
        cpf: updateFuncionarioDto.cpf,
        email: updateFuncionarioDto.email,
        informacoesAdicionais: updateFuncionarioDto.informacoesAdicionais,
        servicos: updateFuncionarioDto.servicos
      }
    );

    if(!atualizouFuncionario){
      throw new NotFoundException('Funcionário não atualizado');
    }

    const resultado = {
      message: 'Funcionário atualizado com sucesso'
    };

    return resultado;
  }

  async remove(id: number) {
    if (!id || isNaN(id)) {
      throw new NotAcceptableException('Id não informado ou não é number');
    }

    const deletouFuncionario = await this.funcionarioRepository.delete(id);

    if(!deletouFuncionario.affected){
      throw new NotFoundException('Funcionário não removido');
    }

    const resultado = {
      message: 'Funcionário removido com sucesso'
    };

    return resultado;
  }
}

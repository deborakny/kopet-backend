import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContaEntity } from 'src/api/conta/entities/conta.entity';
import { ILike, Repository } from 'typeorm';
import { ListContaDto } from '../conta/dto/list-conta.dto';
import { CreateEstabelecimentoDto } from './dto/create-estabelecimento.dto';
import { ListEstabelecimentoDto } from './dto/list-estabelecimento.dto';
import { UpdateEstabelecimentoDto } from './dto/update-estabelecimento.dto';
import { EnderecoEntity } from './entities/endereco.entity';
import { EstabelecimentoEntity } from './entities/estabelecimento.entity';
import { HorarioFuncionamentoEntity } from '../horario-funcionamento/entities/horario-funcionamento.entity';

@Injectable()
export class EstabelecimentoService {
  constructor(
    @InjectRepository(EstabelecimentoEntity)
    private estabelecimentoRepository: Repository<EstabelecimentoEntity>,

    @InjectRepository(HorarioFuncionamentoEntity)
    private horarioFuncionamentoRepository: Repository<HorarioFuncionamentoEntity>,

    @InjectRepository(EnderecoEntity)
    private enderecoRepository: Repository<EnderecoEntity>,
  ) { }

  async create(createEstabelecimentoDto: CreateEstabelecimentoDto) {
    const conta = new ContaEntity({ ...createEstabelecimentoDto.conta });

    const endereco = new EnderecoEntity({ ...createEstabelecimentoDto.endereco })

    let horariosFuncionamento = [];
    if (createEstabelecimentoDto.horariosFuncionamento) {
      horariosFuncionamento = createEstabelecimentoDto.horariosFuncionamento.map(
        (horarioDto) => new HorarioFuncionamentoEntity({ ...horarioDto })
      );
    }

    const estabelecimento = new EstabelecimentoEntity({
      ...createEstabelecimentoDto,
      conta,
      endereco,
      horariosFuncionamento
    });

    estabelecimento.conta.tipoEstabelecimento = true;

    return await this.estabelecimentoRepository.save(estabelecimento);
  }

  async findAll() {
    const estabelecimentos = await this.estabelecimentoRepository.find(
      {
        relations: {
          conta: true,
          endereco: true,
          horariosFuncionamento: true,
          disponibilidades: true
        }
      }
    );

    const estabelecimentosDto = estabelecimentos.map(
      (estabelecimento) => {
        const estabelecimentoDto = new ListEstabelecimentoDto(
          estabelecimento.id,
          estabelecimento.nome,
          estabelecimento.cnpj,
          estabelecimento.telefone
        );

        estabelecimentoDto.conta = new ListContaDto(
          estabelecimento.conta.email
        );

        estabelecimentoDto.endereco = new EnderecoEntity(
          { ...estabelecimento.endereco }
        );

        estabelecimentoDto.disponibilidades = [...estabelecimento.disponibilidades];
        estabelecimentoDto.horariosFuncionamento = [...estabelecimento.horariosFuncionamento];


        return estabelecimentoDto;
      }
    );

    return estabelecimentosDto;
  }

  async findByName(nome: string) {
    const estabelecimentos = await this.estabelecimentoRepository.find(
      {
        where:{
          nome: ILike(`%${nome}%`),
        },
        relations: {
          conta: true,
          endereco: true,
          horariosFuncionamento: true,
          disponibilidades: true,
        }
      }
    );

    const estabelecimentosDto = estabelecimentos.map(
      (estabelecimento) => {
        const estabelecimentoDto = new ListEstabelecimentoDto(
          estabelecimento.id,
          estabelecimento.nome,
          estabelecimento.cnpj,
          estabelecimento.telefone
        );

        estabelecimentoDto.conta = new ListContaDto(
          estabelecimento.conta.email
        );

        estabelecimentoDto.endereco = new EnderecoEntity(
          { ...estabelecimento.endereco }
        );

        estabelecimentoDto.disponibilidades = [...estabelecimento.disponibilidades];
        estabelecimentoDto.horariosFuncionamento = [...estabelecimento.horariosFuncionamento];


        return estabelecimentoDto;
      }
    );

    return estabelecimentosDto;
  }

  async findOne(id: number) {
    const estabelecimento = await this.estabelecimentoRepository.findOne({
      where: {
        id
      },
      relations: {
        conta: true,
        endereco: true,
        horariosFuncionamento: true,
        disponibilidades: true
      },
      order:{
        horariosFuncionamento:{
          dia:'ASC'
        }
      }
    });

    if (!estabelecimento) {
      throw new NotFoundException('Estabelecimento não encontrado')
    }

    const estabelecimentoDto = new ListEstabelecimentoDto(
      estabelecimento.id,
      estabelecimento.nome,
      estabelecimento.cnpj,
      estabelecimento.telefone
    );

    estabelecimentoDto.conta = new ListContaDto(
      estabelecimento.conta.email
    );

    estabelecimentoDto.endereco = new EnderecoEntity(
      { ...estabelecimento.endereco }
    );

    estabelecimentoDto.disponibilidades = [...estabelecimento.disponibilidades];
    estabelecimentoDto.horariosFuncionamento = [...estabelecimento.horariosFuncionamento];


    return estabelecimentoDto;
  }

  async update(id: number, updateEstabelecimentoDto: UpdateEstabelecimentoDto) {
    if (!id || isNaN(id)) {
      throw new NotAcceptableException('Id não informado ou não é number')
    }
    const existe = await this.estabelecimentoRepository.findOne({
      where: {
        id
      }
    });

    if (!existe) {
      throw new NotFoundException('Estabelecimento não encontrado')
    }

    //const endereco = new EnderecoEntity({ ...updateEstabelecimentoDto.endereco })

    //const horariosFuncionamento = updateEstabelecimentoDto.horariosFuncionamento.map(
    //  (horarioDto) => new HorarioFuncionamentoEntity({ ...horarioDto })
    //);

    //const estabelecimento = new EstabelecimentoEntity({
    //  ...updateEstabelecimentoDto,
    //  endereco,
    //  horariosFuncionamento
    //});

    //Atualizar Estabelecimento
    const atualizouEstabelecimento = await this.estabelecimentoRepository.update(id,
      {
        nome: updateEstabelecimentoDto.nome,
        cnpj: updateEstabelecimentoDto.cnpj,
        telefone: updateEstabelecimentoDto.telefone
      }
    );

    if (!atualizouEstabelecimento.affected) {
      throw new NotFoundException('Atualização de estabelecimento não realizada')
    }

    //Atualizar Endereco
    const atualizouEndereco = await this.enderecoRepository.update(id, updateEstabelecimentoDto.endereco);

    if (!atualizouEndereco.affected) {
      throw new NotFoundException('Atualização de estabelecimento não realizada')
    }

    //Atualizar HorariosFuncionamento
    if(updateEstabelecimentoDto.horariosFuncionamento){
      const atualizouHorariosFuncionamento = await Promise.all(updateEstabelecimentoDto.horariosFuncionamento.map(
        async horarioFuncionamento => await this.horarioFuncionamentoRepository.update(horarioFuncionamento.id, horarioFuncionamento)
      ));
  
      if (!atualizouHorariosFuncionamento) {
        throw new NotFoundException('Atualização de estabelecimento não realizada')
      }
    }
  }


}

import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AgendamentoEntity } from './entities/agendamento.entity';
import { Repository } from 'typeorm';
import { NotificacaoService } from '../notificacao/notificacao.service';
import { EstabelecimentoService } from '../estabelecimento/estabelecimento.service';
import { ClienteService } from '../cliente/cliente.service';
import { StatusAgendamentoEnum } from './enum/status-agendamento.enum';
import { ServicoService } from '../servico/servico.service';
import { FuncionarioService } from '../funcionario/funcionario.service';
import * as moment from 'moment';

@Injectable()
export class AgendamentoService {
  constructor(
    @InjectRepository(AgendamentoEntity)
    private agendamentoRepository: Repository<AgendamentoEntity>,
    private readonly notificacaoService: NotificacaoService,
    private readonly estabelecimentoService: EstabelecimentoService,
    private readonly clienteService: ClienteService,
    private readonly servicoService: ServicoService,
    private readonly funcionarioService: FuncionarioService,
  ) {}

  async create(createAgendamentoDto: CreateAgendamentoDto) {
    const agendamento = new AgendamentoEntity({
      hora: moment(createAgendamentoDto.hora, 'HH:mm').format('HH:mm'),
      ...createAgendamentoDto,
    });
    const dadosSalvos = await this.agendamentoRepository.save(agendamento);

    if (!dadosSalvos) {
      throw new NotAcceptableException('Erro ao criar agendamento!');
    }

    // this.enviarSMS(agendamento);
    this.enviarEmail(agendamento);

    return {
      data: dadosSalvos,
      message: 'Agendamento criado com sucesso!',
    };
  }

  async findAll() {
    return await this.agendamentoRepository.find();
  }

  async findByClienteId(id: number) {
    return await this.agendamentoRepository.find({
      where: {
        cliente: {
          id,
        },
      },
      relations: {
        estabelecimento: true,
        cliente: true,
        pet: true,
        funcionario: true,
        servico: true,
      },
      order: {
        status: 'ASC',
      },
    });
  }

  async findByPetId(clienteId: number, petId: number) {
    return await this.agendamentoRepository.find({
      where: {
        clienteId,
        petId,
      },
    });
  }

  async findByEstabelecimentoId(id: number) {
    return await this.agendamentoRepository.find({
      where: {
        estabelecimento: {
          id,
        },
      },
      relations: {
        estabelecimento: true,
        cliente: true,
        pet: true,
        funcionario: true,
        servico: true,
      },
    });
  }

  async findByFuncionarioId(estabelecimentoId: number, funcionarioId: number) {
    return await this.agendamentoRepository.find({
      where: {
        estabelecimentoId,
        funcionarioId,
      },
    });
  }

  async findByServicoId(estabelecimentoId: number, servicoId: number) {
    return await this.agendamentoRepository.find({
      where: {
        estabelecimentoId,
        servicoId,
      },
    });
  }

  async findOne(id: number) {
    return await this.agendamentoRepository.findOneBy({ id });
  }

  async update(id: number, updateAgendamentoDto: UpdateAgendamentoDto) {
    if (!id || isNaN(id)) {
      throw new NotAcceptableException('Id não informado ou não é number');
    }

    const atualizouAgendamento = await this.agendamentoRepository.update(
      id,
      updateAgendamentoDto,
    );

    if (!atualizouAgendamento.affected) {
      throw new NotFoundException('Agendamento não atualizado');
    }
    //Enviar notificação
    const agendamento = new AgendamentoEntity({ id, ...updateAgendamentoDto });
    this.enviarEmail(agendamento);
    const resultado = {
      message: 'Agendamento atualizado com sucesso',
    };

    return resultado;
  }

  remove(id: number) {
    return `This action removes a #${id} agendamento`;
  }

  private async enviarSMS(agendamento: AgendamentoEntity) {
    const estabelecimento = await this.estabelecimentoService.findOne(
      agendamento.estabelecimentoId,
    );
    const cliente = await this.clienteService.findOne(agendamento.clienteId);
    const pet = cliente.pets.filter((pet) => pet.id === agendamento.petId)[0]; //retorna o primeiro encontrado (único)
    this.notificacaoService.enviarSMS(
      estabelecimento.telefone,
      `Agendamento criado com cliente ${cliente.nome + ' ' + cliente.sobrenome}:
                                                            \nDia: ${agendamento.dia}
                                                            \nHora:${agendamento.hora}
                                                            \nPet:${pet.nome}
                                                            \nRaça:${pet.raca}
                                                            \nPorte:${pet.porte}
                                                            `,
    );
  }

  private async enviarEmail(agendamento: AgendamentoEntity) {
    if (!agendamento.estabelecimentoId) {
      const temp = await this.findOne(agendamento.id);
      agendamento.clienteId = temp.clienteId;
      agendamento.petId = temp.petId;
      agendamento.estabelecimentoId = temp.estabelecimentoId;
      agendamento.funcionarioId = temp.funcionarioId;
      agendamento.servicoId = temp.servicoId;
      agendamento.dia = moment(temp.dia).format('DD/MM/YYYY');
      agendamento.hora = moment(temp.hora, 'HH:mm').format('HH:mm');
    }
    const estabelecimento = await this.estabelecimentoService.findOne(
      agendamento.estabelecimentoId,
    );
    const servico = await this.servicoService.findOne(agendamento.servicoId);
    const funcionario = await this.funcionarioService.findOne(
      agendamento.funcionarioId,
    );
    const cliente = await this.clienteService.findOne(agendamento.clienteId);
    const pet = cliente.pets.filter((pet) => pet.id === agendamento.petId)[0]; //retorna o primeiro encontrado (único)
    const msg = `\nDia: ${agendamento.dia}
    \nServiço: ${servico.nome}
    \nFuncionário: ${funcionario.nome} ${funcionario.sobrenome}
    \nHora: ${agendamento.hora}
    \nPet: ${pet.nome}
    \nRaça: ${pet.raca}
    \nPorte: ${pet.porte}`;

    if (agendamento.status.includes(StatusAgendamentoEnum.CANCELADO)) {
      console.log('cancela')
      await this.notificacaoService.enviarEmail(
        //[cliente.conta.email, estabelecimento.conta.email],
        [estabelecimento.conta.email],
        `Agendamento cancelado - ${agendamento.id}`,
        `Agendamento cancelado estabelecimento ${estabelecimento.nome} e cliente ${cliente.nome + ' ' + cliente.sobrenome}:
          ${msg}
          `,
      );
      // await this.notificacaoService.enviarEmail(
      //   [cliente.conta.email],
      //   `Agendamento cancelado - ${agendamento.id}`,
      //   `Agendamento cancelado estabelecimento ${estabelecimento.nome}:
      //     ${msg}
      //     `,
      // );
      // await this.notificacaoService.enviarEmail(
      //   [estabelecimento.conta.email],
      //   `Agendamento cancelado - ${agendamento.id}`,
      //   `Agendamento cancelado com cliente ${cliente.nome + ' ' + cliente.sobrenome}:
      //     ${msg}
      //     `,
      // );
      return;
    }
    await this.notificacaoService.enviarEmail(
      //[cliente.conta.email, estabelecimento.conta.email],
      [estabelecimento.conta.email],
      `Agendamento criado com sucesso - ${agendamento.id}`,
      `Agendamento criado com estabelecimento ${estabelecimento.nome} e cliente ${cliente.nome + ' ' + cliente.sobrenome}:
        ${msg}
        `,
    );
    // await this.notificacaoService.enviarEmail(
    //   estabelecimento.conta.email,
    //   `Agendamento criado com sucesso - ${agendamento.id}`,
    //   `Agendamento criado com cliente ${cliente.nome + ' ' + cliente.sobrenome}:
    //     ${msg}
    //     `,
    // );
    // await this.notificacaoService.enviarEmail(
    //   cliente.conta.email,
    //   `Agendamento criado com sucesso - ${agendamento.id}`,
    //   `Agendamento criado com estabelecimento ${estabelecimento.nome}:
    //     ${msg}
    //     `,
    // );
  }
}

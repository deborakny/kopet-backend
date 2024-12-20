import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AgendamentoEntity } from '../agendamento/entities/agendamento.entity';
import { In, Repository } from 'typeorm';
import { DisponibilidadeEntity } from '../disponibilidade/entities/disponibilidade.entity';
import { ServicoEntity } from '../servico/entities/servico.entity';

import * as moment from 'moment';
import {
  ListOpcoesDatasDisponibilidadeDto,
  ListOpcoesDisponibilidadeDto,
} from './dto/list-opcoes-disponibilidade.dto';
import {
  HorarioDisponivel,
  OpcoesDisponibilidade,
} from './entities/opcoes-disponibilidade.model';
import { DataDisponibilidadeEntity } from '../disponibilidade/entities/data-disponibilidade.entity';
import { StatusAgendamentoEnum } from '../agendamento/enum/status-agendamento.enum';

@Injectable()
export class OpcoesDisponibilidadeService {
  //Período de dias para ser calculado e adicionados datas no opcçoes disponibilidade
  periodoDias: number = 30;
  //Enum de status
  statusAgendamentoEnum = StatusAgendamentoEnum;

  constructor(
    @InjectRepository(AgendamentoEntity)
    private agendamentoRepository: Repository<AgendamentoEntity>,

    @InjectRepository(DisponibilidadeEntity)
    private disponibilidadeRepository: Repository<DisponibilidadeEntity>,

    @InjectRepository(ServicoEntity)
    private servicoRepository: Repository<ServicoEntity>,
  ) {}

  async findByServicoIdFuncionarioId(id: number, funcionarioId: number) {
    const servico = await this.servicoRepository.findOne({
      where: {
        id,
        funcionarios: {
          id: funcionarioId,
        },
      },
      relations: {
        funcionarios: true,
      },
    });

    if (!servico) {
      //Checar para ver se serviço existe
      throw new NotFoundException('Serviço não existe');
    }

    //Duração do servico para os cálculos de intervalo de tempo dos expedientes para cada serviço
    const duracao = servico.duracao;

    //Pegar disponibilidades
    const disponibilidades = await this.disponibilidadeRepository.find({
      where: {
        servicoId: id,
        funcionarioId,
      },
      relations: {
        datasDisponibilidade: true,
      },
    });

    if (!disponibilidades) {
      //Checar para ver se serviço existe
      throw new NotFoundException('Serviço não tem disponibilidades');
    }

    //Pegar datas unidimensionais
    const datas = disponibilidades.flatMap(
      //FlatMap ou datas virão num vetor x dimensional paara cada funcionário
      (disponibilidade) => disponibilidade.datasDisponibilidade,
    );

    //Mapear datas com array de horários possíveis
    const datasMapeadas = this.mapearHorariosEmDatas(datas, duracao);

    //Adiciona campo de horarios para as disponibilidades serem melhor manuseadas
    const opcoesDisponibilidadesDto = this.mapearParaListOpcoesDisponibilidade(
      disponibilidades,
      duracao,
    );

    //Transforma as disponibilidades em OpcãoDisponibilidade [], prontas para serem retornadas (se não houverem agendamentos)
    const opcoesDisponiveis = this.transformarParaOpcoesDisponibilidade(
      opcoesDisponibilidadesDto,
    );

    //Ids de funcionários deste seriço para encontrar agendamentos
    const funcionarioIds = servico.funcionarios?.map(
      (funcionario) => funcionario?.id,
    );

    //Pegar Agendamentos
    const agendamentos = await this.agendamentoRepository.find({
      where: {
        funcionario: In(funcionarioIds),
        status: this.statusAgendamentoEnum.AGENDADO,
      },
    });

    //Se não houverem agendamentos - retornar opcoes como estão
    if (agendamentos.length == 0) {
      return opcoesDisponiveis;
    }

    //Filtrar por agendamentos encontrados, retirando os ids dos funcionarios que tenha horários agendendados em dia e data x e retornar
    const opcoesFiltradas = this.filtrarOpcoesDisponiveis(
      opcoesDisponiveis,
      agendamentos,
    );
    return opcoesFiltradas;
  }

  async findByServicoId(id: number) {
    const servico = await this.servicoRepository.findOne({
      where: {
        id,
      },
      relations: {
        funcionarios: true,
      },
    });

    if (!servico) {
      //Checar para ver se serviço existe
      throw new NotFoundException('Serviço não existe');
    }
    const duracao = servico.duracao;

    //Pegar disponibilidades
    const disponibilidades = await this.disponibilidadeRepository.find({
      where: {
        servicoId: id,
      },
      relations: {
        datasDisponibilidade: true,
      },
    });

    if (!disponibilidades) {
      //Checar para ver se serviço existe
      throw new NotFoundException('Serviço não tem disponibilidades');
    }

    //Pegar datas unidimensionais
    const datas = disponibilidades.flatMap(
      //FlatMap ou datas virão num vetor x dimensional paara cada funcionário
      (disponibilidade) => disponibilidade.datasDisponibilidade,
    );

    //Mapear datas com array de horários possíveis
    const datasMapeadas = this.mapearHorariosEmDatas(datas, duracao);

    //Adiciona campo de horarios para as disponibilidades serem melhor manuseadas
    const opcoesDisponibilidadesDto = this.mapearParaListOpcoesDisponibilidade(
      disponibilidades,
      duracao,
    );

    //Transforma as disponibilidades em OpcãoDisponibilidade [], prontas para serem retornadas (se não houverem agendamentos)
    const opcoesDisponiveis = this.transformarParaOpcoesDisponibilidade(
      opcoesDisponibilidadesDto,
    );

    //Ids de funcionários deste seriço para encontrar agendamentos
    const funcionarioIds = servico.funcionarios?.map(
      (funcionario) => funcionario?.id,
    );

    //Pegar Agendamentos
    const agendamentos = await this.agendamentoRepository.find({
      where: {
        funcionario: In(funcionarioIds),
        status: this.statusAgendamentoEnum.AGENDADO,
      },
    });

    //Se não houverem agendamentos - retornar opcoes como estão
    if (agendamentos.length == 0) {
      return opcoesDisponiveis;
    }

    //Filtrar por agendamentos encontrados, retirando os ids dos funcionarios que tenha horários agendendados em dia e data x e retornar
    const opcoesFiltradas = this.filtrarOpcoesDisponiveis(
      opcoesDisponiveis,
      agendamentos,
    );
    return opcoesFiltradas;
  }

  //FUNÇÕES DE AUXÍLIO

  //Adiciona o vetor horarios[] para o campo em dataDisponibilidade,
  //preenchendo o intervalo de horaInicio a horaFim com horas por duração do serviço,
  //deixando de fora o intervalo de pausa
  mapearHorariosEmDatas(datas: DataDisponibilidadeEntity[], duracao: number) {
    return datas.map((data) => {
      //Moment dos horários e pausas para comparação e adição
      const horaInicio = moment(data.horarioInicio, 'hh:mm:ss');
      const horaFim = moment(data.horarioFim, 'hh:mm:ss');
      const pausaInicio = moment(data.pausaInicio, 'hh:mm:ss');
      const pausaFim = moment(data.pausaFim, 'hh:mm:ss');
      let horarios = []; //Armazenar cada hora disponível

      //i = cópia do horário inicial
      //enquanto i for antes do horário final
      //adicionar duraçao a i (no caso, adicionar 40min pra cada iteração)
      //for(let i = inicio, i<fim, i+= duracao)
      for (
        let i = moment(horaInicio);
        i.isBefore(horaFim);
        i.add(duracao, 'minutes')
      ) {
        //Enquanto for antes ou depois do período de pausa
        if (i.isBefore(pausaInicio) || i.isAfter(pausaFim))
          horarios.push(moment(i)); //guardar o horário
      }

      //Novo objeto data, com o atributo de horários
      const dataMapeada = {
        ...data,
        horarios,
      };

      return dataMapeada;
    });
  }

  //Calcular os intervalos
  calcularHorarios(
    horarioInicio: string,
    horarioFim: string,
    pausaInicio: string,
    pausaFim: string,
    duracao: number,
  ): string[] {
    //Armazena horarios gerados pro intervalo
    const horarios: string[] = [];
    //Armazena moment formatado para horas dos horarios de inicio, fim e pausas do expediente
    const inicio = moment(horarioInicio, 'HH:mm');
    const fim = moment(horarioFim, 'HH:mm');
    const inicioPausa = moment(pausaInicio, 'HH:mm');
    const fimPausa = moment(pausaFim, 'HH:mm');

    //contador -> poderia ser feito com laço for
    // let atual = moment(inicio);
    // while (atual.isBefore(fim)) {
    //   if (atual.isBefore(inicioPausa) || atual.isSameOrAfter(fimPausa)) { //se não for durante o expediente. Antes do começoPausa ou igual/depois do fimPausa para não marcar agendamentos durante a pausa
    //     horarios.push(atual.format('HH:mm'));
    //   }
    //   atual.add(duracao, 'minutes'); //contador++
    // }
    // return horarios;
    
    let horariosIniciais = moment(inicio);
    while (horariosIniciais.isBefore(inicioPausa)) {
      horarios.push(horariosIniciais.format('HH:mm'));
      horariosIniciais.add(duracao, 'minutes'); //contador++
    }

    let horariosFinais = moment(fimPausa)
    while (horariosFinais.isBefore(fim)) {
      horarios.push(horariosFinais.format('HH:mm'));
      horariosFinais.add(duracao, 'minutes');
    }

    return horarios;    
  }

  //Mapeia vetor de Disponibilidades para ListOpcoesDisponibilidadeDto -> adiciona o array de horarios, o intervalo.
  mapearParaListOpcoesDisponibilidade(
    disponibilidades: DisponibilidadeEntity[],
    duracao: number,
  ): ListOpcoesDisponibilidadeDto[] {
    return disponibilidades.map((disponibilidade) => {
      //Cria DataDto com horarios
      const datasDisponibilidadeDto = disponibilidade.datasDisponibilidade.map(
        (data) => {
          const horarios: string[] = this.calcularHorarios(
            data.horarioInicio,
            data.horarioFim,
            data.pausaInicio,
            data.pausaFim,
            duracao,
          );
          return new ListOpcoesDatasDisponibilidadeDto(
            data.id,
            data.dia,
            horarios,
          );
        },
      );

      //Cria nova disponibilidadeDto com datasDto(horarios)
      return new ListOpcoesDisponibilidadeDto(
        disponibilidade.id,
        disponibilidade.estabelecimentoId,
        disponibilidade.funcionarioId,
        disponibilidade.servicoId,
        datasDisponibilidadeDto,
      );
    });
  }

  //Transforma disponibilidadeDto para opcçõesDisponibilidade, gerando os dias do mês, cada dia com array de hora
  //e cada hora com array de funcionarios que tem aquela hora
  /*transformarParaOpcoesDisponibilidade(disponibilidades: ListOpcoesDisponibilidadeDto[]) {
    const horariosPorDia: Map<string, HorarioDisponivel[]> = new Map();

    // Criar um array de datas para o período especificado
    const datasPeriodo: string[] = [];
    for (let i = 0; i < this.periodoDias; i++) {
      const data = moment().add(i, 'days').format('YYYY-MM-DD');
      datasPeriodo.push(data);
    }

    // Iterar sobre cada dia do período
    datasPeriodo.forEach(data => {
      // Inicializar o array de horários para o dia
      const horariosDoDia: HorarioDisponivel[] = [];

      // Iterar sobre cada DTO de disponibilidade
      disponibilidades.forEach(disponibilidade => {
        // Verificar se o DTO possui disponibilidade para o dia atual
        const disponibilidadeDia = disponibilidade.datasDisponibilidade.find(dataDisponibilidade => dataDisponibilidade.dia === moment(data).day());

        // Se houver disponibilidade para o dia atual, processar os horários
        if (disponibilidadeDia) {
          disponibilidadeDia.horarios.forEach(hora => {
            // Verificar se o horário já existe no array de horários do dia
            const horarioExistente = horariosDoDia.find(horario => horario.hora === hora);

            if (horarioExistente) {
              // Adicionar funcionário ao horário existente
              if (!horarioExistente.funcionarioIds.includes(disponibilidade.funcionarioId)) {
                horarioExistente.funcionarioIds.push(disponibilidade.funcionarioId);
              }
            } else {
              // Criar um novo HorarioDisponivel para o horário
              const novoHorario: HorarioDisponivel = {
                estabelecimentoId: disponibilidade.estabelecimentoId,
                servicoId: disponibilidade.servicoId,
                funcionarioIds: [disponibilidade.funcionarioId],
                hora
              };
              horariosDoDia.push(novoHorario);
            }
          });
        }
      });

      // Adicionar os horários do dia ao mapa
      horariosPorDia.set(data, horariosDoDia);
    });

    // Converter o mapa para o formato de retorno esperado
    const opcoesDisponibilidade: OpcoesDisponibilidade[] = [];
    horariosPorDia.forEach((horarios, dia) => {
      const opcao: OpcoesDisponibilidade = {
        dataDia: dia,
        horarios
      };
      opcoesDisponibilidade.push(opcao);
    });

    return opcoesDisponibilidade;
  } */
  transformarParaOpcoesDisponibilidade(
    disponibilidades: ListOpcoesDisponibilidadeDto[],
  ) {
    const horariosPorDia: Map<string, HorarioDisponivel[]> = new Map();

    //Lista de dias que há trabalho/disponibilidade
    let diasDisponiveis = [];
    disponibilidades.forEach((disponibilidade) => {
      diasDisponiveis = disponibilidade.datasDisponibilidade.map(
        (dataDisponivel) => dataDisponivel.dia,
      ); //adiciona o dia que existe, ex: de 1 a 5 (seg,ter,quar,qui,sex)
    });
    // Obter a data/hora atual
    const dataAtual = moment();

    // Criar um array de datas para o período especificado
    const datasPeriodo: string[] = [];
    for (let i = 0; i < this.periodoDias; i++) {
      const data = dataAtual.clone().add(i, 'days').format('YYYY-MM-DD'); //Data (i)

      const diaDisponivel = diasDisponiveis.includes(moment(data).day()); //A data(i) tem disponibilidade/o estabelecimento funciona(supostamente é pra coincidir)?

      if (diaDisponivel) {
        //Se for dia disponível
        datasPeriodo.push(data);
      }
    }

    // Iterar sobre cada dia do período
    datasPeriodo.forEach((data) => {
      // Inicializar o array de horários para o dia
      const horariosDoDia: HorarioDisponivel[] = [];

      // Iterar sobre cada DTO de disponibilidade
      disponibilidades.forEach((disponibilidade) => {
        // Verificar se o DTO possui disponibilidade para o dia atual ou futuros
        const disponibilidadeDia = disponibilidade.datasDisponibilidade.find(
          (dataDisponibilidade) =>
            moment(data + ' ' + dataDisponibilidade.horarios[0]).isSameOrAfter(
              dataAtual,
            ),
        );

        // Se houver disponibilidade para o dia atual ou futuros, processar os horários
        if (disponibilidadeDia) {
          disponibilidadeDia.horarios.forEach((hora) => {
            // Verificar se o horário já existe no array de horários do dia
            const horarioExistente = horariosDoDia.find(
              (horario) => horario.hora === hora,
            );

            if (horarioExistente) {
              // Adicionar funcionário ao horário existente
              if (
                !horarioExistente.funcionarioIds.includes(
                  disponibilidade.funcionarioId,
                )
              ) {
                horarioExistente.funcionarioIds.push(
                  disponibilidade.funcionarioId,
                );
              }
            } else {
              // Criar um novo HorarioDisponivel para o horário
              const novoHorario: HorarioDisponivel = {
                estabelecimentoId: disponibilidade.estabelecimentoId,
                servicoId: disponibilidade.servicoId,
                funcionarioIds: [disponibilidade.funcionarioId],
                hora,
              };
              horariosDoDia.push(novoHorario);
            }
          });
        }
      });

      // Adicionar os horários do dia ao mapa
      horariosPorDia.set(data, horariosDoDia);
    });

    // Converter o mapa para o formato de retorno esperado
    const opcoesDisponibilidade: OpcoesDisponibilidade[] = [];
    horariosPorDia.forEach((horarios, dia) => {
      const opcao: OpcoesDisponibilidade = {
        dataDia: dia,
        horarios,
      };
      opcoesDisponibilidade.push(opcao);
    });

    return opcoesDisponibilidade.filter((opcao) => opcao.horarios.length);
  }
  //Filtra as opções conforme os agendamentos existentes para os funcionários do serviço atual
  //retira o id do funcionário para aquela hora de atendimento em que tenha agendamento marcado (data e hora) igual,
  //deixando somente os ids que não tenham agendamento para aquele moment. Se não tiver nenhum, retira a data ou hora
  filtrarOpcoesDisponiveis(
    opcoesDisponiveis: OpcoesDisponibilidade[],
    agendamentos: AgendamentoEntity[],
  ) {
    return opcoesDisponiveis
      .map((opcao) => {
        const opcaoFiltrada: OpcoesDisponibilidade = {
          dataDia: opcao.dataDia,
          horarios: opcao.horarios
            .map((horario) => {
              const agendamentosNoMesmoDiaHora = agendamentos.filter(
                (agendamento) =>
                  moment(agendamento.dia).isSame(
                    moment(opcao.dataDia),
                    'day',
                  ) &&
                  moment(agendamento.hora, 'HH:mm').isSame(
                    moment(horario.hora, 'HH:mm'),
                    'minute',
                  ) &&
                  agendamento.status.includes(StatusAgendamentoEnum.AGENDADO),
              );

              if (agendamentosNoMesmoDiaHora.length > 0) {
                // Se houver agendamentos no mesmo dia e hora e com status AGENDADO, coletar os funcionários a serem removidos
                const funcionariosRemover = new Set<number>();
                agendamentosNoMesmoDiaHora.forEach((agendamento) =>
                  funcionariosRemover.add(agendamento.funcionarioId),
                );

                // Filtrar os funcionários da lista do horário, removendo os que precisam ser removidos
                const funcionariosFiltrados = horario.funcionarioIds.filter(
                  (funcionarioId) => !funcionariosRemover.has(funcionarioId),
                );

                // Se ainda houverem funcionários após a filtragem, retornar o horário atualizado
                if (funcionariosFiltrados.length > 0) {
                  return {
                    estabelecimentoId: horario.estabelecimentoId,
                    servicoId: horario.servicoId,
                    funcionarioIds: funcionariosFiltrados,
                    hora: horario.hora,
                  };
                } else {
                  return null; // Retornar null se não houverem funcionários disponíveis
                }
              } else {
                // Se não houver agendamentos, retornar o horário sem modificação
                return horario;
              }
            })
            .filter(Boolean) as HorarioDisponivel[], // Filtrar horários null removidos
        };

        return opcaoFiltrada;
      })
      .filter((opcao) => opcao.horarios.length > 0); // Filtrar opções sem horários disponíveis
  }
}

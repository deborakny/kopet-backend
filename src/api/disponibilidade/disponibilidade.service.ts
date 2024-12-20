import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CreateDisponibilidadeDto } from './dto/create-disponibilidade.dto';
import { UpdateDisponibilidadeDto } from './dto/update-disponibilidade.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DisponibilidadeEntity } from './entities/disponibilidade.entity';
import { Repository } from 'typeorm';
import { DataDisponibilidadeEntity } from './entities/data-disponibilidade.entity';
import { UpdateCreatingDataDisponibilidadeDto, UpdateDataDisponibilidadeDto } from './dto/update-data-disponibilidade.dto';
import { CreateDataDisponibilidadeDto } from './dto/create-data-disponibilidade.dto';

@Injectable()
export class DisponibilidadeService {
  constructor(
    @InjectRepository(DisponibilidadeEntity)
    private disponibilidadeRepository: Repository<DisponibilidadeEntity>,

    @InjectRepository(DataDisponibilidadeEntity)
    private dataDisponibilidadeRepository: Repository<DataDisponibilidadeEntity>
  ) { }

  async create(createDisponibilidadeDto: CreateDisponibilidadeDto) {

    // Criação de disponibilidade temporária
    const disponibilidadeTemp = this.disponibilidadeRepository.create({
      servicoId: createDisponibilidadeDto.servicoId,
      estabelecimentoId: createDisponibilidadeDto.estabelecimentoId,
      funcionarioId: createDisponibilidadeDto.funcionarioId
    });

    // Criação das datas de disponibilidade associadas
    const datasDisponibilidade = createDisponibilidadeDto.datasDisponibilidade.map(dataDisponibilidadeDto => {
      return this.dataDisponibilidadeRepository.create({
        dia: dataDisponibilidadeDto.dia,
        horarioInicio: dataDisponibilidadeDto.horarioInicio,
        horarioFim: dataDisponibilidadeDto.horarioFim,
        pausaInicio: dataDisponibilidadeDto.pausaInicio,
        pausaFim: dataDisponibilidadeDto.pausaFim,
        disponibilidade: disponibilidadeTemp // Associação da disponibilidade
      });
    });

    try {
      // Salvando disponibilidade temporária para obter ID
      const disponibilidadeSalva = await this.disponibilidadeRepository.save(disponibilidadeTemp);

      // Atribuindo ID da disponibilidade salva às datas de disponibilidade
      datasDisponibilidade.forEach(data => data.disponibilidade = disponibilidadeSalva);

      // Salvando todas as datas de disponibilidade
      const datasDisponibilidadeSalvas = await this.dataDisponibilidadeRepository.save(datasDisponibilidade);

      // Atualizando a entidade disponibilidade com as datas salvas
      disponibilidadeSalva.datasDisponibilidade = datasDisponibilidadeSalvas;
      const disponibilidadeAtualizada = await this.disponibilidadeRepository.save(disponibilidadeSalva);

      // Removendo referência circular antes de retornar a resposta
      const response = {
        ...disponibilidadeAtualizada,
        datasDisponibilidade: datasDisponibilidadeSalvas.map(data => ({
          ...data,
          disponibilidade: undefined // Remove referência circular
        }))
      };

      return {
        data: response,
        message: 'Disponibilidade salva com sucesso'
      };
    } catch (e) {
      throw new NotAcceptableException(e);
    }
  }


  async findAll() {
    return await this.disponibilidadeRepository.find({
      relations: {
        datasDisponibilidade: true
      },
      order:{
        datasDisponibilidade:{
          dia:'ASC'
        }
      }
    });
  }

  async findOne(id: number) {
    const disponibilidade = await this.disponibilidadeRepository.findOne({
      where: {
        id
      },
      relations: {
        datasDisponibilidade: true
      },
      order:{
        datasDisponibilidade:{
          dia:'ASC'
        }
      }
    });
    return disponibilidade;
  }

  async findByFuncionarioId(id: number) {
    const disponibilidades = await this.disponibilidadeRepository.find({
      where: {
        funcionario: {
          id
        }
      },
      relations: {
        datasDisponibilidade: true
      },
      order:{
        datasDisponibilidade:{
          dia:'ASC'
        }
      }
    })
    return disponibilidades
  }

  async findByServicoId(id: number) {
    const disponibilidades = await this.disponibilidadeRepository.find({
      where: {
        servico: {
          id
        }
      },
      relations: {
        datasDisponibilidade: true
      },
      order:{
        datasDisponibilidade:{
          dia:'ASC'
        }
      }
    })
    return disponibilidades
  }

  async findByEstabelecimentoId(id: number) {
    const disponibilidades = await this.disponibilidadeRepository.find({
      where: {
        estabelecimento: {
          id
        }
      },
      relations: {
        datasDisponibilidade: true,
        funcionario:true,
        servico:true
      },
      order:{
        datasDisponibilidade:{
          dia:'ASC'
        }
      }
    })
    return disponibilidades
  }

  async findByServicoIdAndFuncionarioId(servicoId: number, funcionarioId: number) {
    const disponibilidades = await this.disponibilidadeRepository.find({
      where: {
        servicoId,
        funcionarioId
      },
      relations: {
        datasDisponibilidade: true
      },
      order:{
        datasDisponibilidade:{
          dia:'ASC'
        }
      }
    });
    return disponibilidades;
  }

  async update(id: number, updateDisponibilidadeDto: UpdateDisponibilidadeDto) {
    if (!id || isNaN(id)) {
      throw new NotAcceptableException('Id não informado ou não é number')
    }

    const existeDisponibilidade = await this.disponibilidadeRepository.findOne({
      where: {
        id,
        estabelecimentoId: updateDisponibilidadeDto.estabelecimentoId,
      }
    });

    if (!existeDisponibilidade) {
      throw new NotFoundException('Disponibilidade não encontrada!');
    }

    //const atualizouDisponibilidade = await this.disponibilidadeRepository.update(id, 
    //  {
    //    funcionarioId: updateDisponibilidadeDto.funcionarioId,
    //    servicoId: updateDisponibilidadeDto.servicoId,
    // }
    //);

    //if(!atualizouDisponibilidade.affected){
    //  throw new NotAcceptableException('Erro ao atualizar');
    //}

    //const atualizouDatasDisponiveis = await Promise.all(updateDisponibilidadeDto.datasDisponibilidade.map(
    //  async (dataDisponivel) => await this.dataDisponibilidadeRepository.update(dataDisponivel.id, dataDisponivel)
    //));

    //if(!atualizouDatasDisponiveis){
    //  throw new NotAcceptableException('Erro ao atualizar');
    //}
    await Promise.all(updateDisponibilidadeDto.datasDisponibilidade.map( //Para cada horarioFuncionamento, de maneira assíncrona
      async updateDataDisponivelDto => {
        //updateHorarioDto.estabelecimento = new EstabelecimentoEntity({id:estabelecimentoId}); //inicializar estabelecimento do horário funcionamento

        if (updateDataDisponivelDto.id) { //se houver id do horário significa que é uma atualização (provavelmente)
          const dataDisponivel = await this.dataDisponibilidadeRepository.findOne({ //Verifica se há um horário salvo com esse id
            where: {
              id: updateDataDisponivelDto.id,
              disponibilidade:{
                id
              }
            }
          });

          if ((dataDisponivel)) { //se for encontrado um horário com este id pertencendo a este estabelecimento, atualizar
            try {
              return await this.dataDisponibilidadeRepository.update(updateDataDisponivelDto.id, updateDataDisponivelDto);
            } catch (e) {
              throw new NotAcceptableException(e);
            }
          } else {
            this.existeDia(updateDataDisponivelDto, updateDisponibilidadeDto.id);
          }
        } else {
          this.existeDia(updateDataDisponivelDto, updateDisponibilidadeDto.id);
        }
      }
    ));

    const datasDisponiveis = await this.dataDisponibilidadeRepository.find({
      where: {
        disponibilidade: {
          id
        }
      }
    }); //todos horários para este estabelecimento
    console.log('Pego do bueiro: ', datasDisponiveis)
    if (datasDisponiveis.length > 0) { //se houver algo
      Promise.all(datasDisponiveis.map( //para cada horário já salvo
        async dataDisponivel => {
          const existe = updateDisponibilidadeDto.datasDisponibilidade.filter( //ver se existe o horário que salvou agora
            dataDisponivelDto => dataDisponivel.dia === dataDisponivelDto.dia
          );
          console.log('Existe: ', existe)
          if (existe.length === 0) { //Se não houver, significa que não foi enviado para atualizar e, portanto, será removido (estabelecimento não quer mais aquele horárioFuncionamento)
            console.log('Deletar: ' + dataDisponivel.dia + '\n' )
            return this.removeDataDisponivel(dataDisponivel.id)
          }
        }
      ));
    }
  }

  async remove(id: number) {
    if (!id || isNaN(id)) {
      throw new NotAcceptableException('Id não informado ou não é number')
    }

    const disponibilidadeDeletada = await this.disponibilidadeRepository.delete(id);

    if (!disponibilidadeDeletada.affected) {
      throw new NotFoundException('Disponibilidade não removida');
    }

    const resultado = {
      message: 'Disponibilidade removida com sucesso'
    };

    return resultado;
  }

  async removeDataDisponivel(id: number) {
    const dataDisponivelDeletada = await this.dataDisponibilidadeRepository.delete(id);
    if (!dataDisponivelDeletada.affected) {
      throw new NotFoundException('Data Disponível não removida');
    }

    const resultado = {
      message: 'Data Disponível removida com sucesso'
    };

    return resultado;
  }

  //Função auxiliar para verificar se o horario, sem id encontrado ou informado, já tem cadastrado o dia para este estabelecimento
  //se houver, somente atualizar o horarioFuncionamento já existente, com os dados enviados
  //se não houver um dia existente, criar novo horarioFuncionamento
  async existeDia(updateDataDisponibilidadeDto: UpdateDataDisponibilidadeDto, disponibilidadeId) {
    try { //procura no Banco de Dados se há um horario funcionamento com este dia, para este estabelecimento
      const existeDataDisponibilidade = await this.dataDisponibilidadeRepository.findOneBy({ dia: updateDataDisponibilidadeDto.dia, disponibilidade: { id: disponibilidadeId } })
      if (!existeDataDisponibilidade) { //se não existir -> salvar
        const salvarDataDisponibilidade: UpdateCreatingDataDisponibilidadeDto = { //Criar novo objeto só com o necessário para criar o horario (para caso viesse com um id inválido e não ser tentada a atualização pelo TypeORM) 
          dia: updateDataDisponibilidadeDto.dia,
          horarioInicio: updateDataDisponibilidadeDto.horarioInicio,
          horarioFim: updateDataDisponibilidadeDto.horarioFim,
          pausaInicio: updateDataDisponibilidadeDto.pausaInicio,
          pausaFim: updateDataDisponibilidadeDto.pausaFim,
          disponibilidade:{ id: disponibilidadeId}
        }
        return await this.dataDisponibilidadeRepository.save(salvarDataDisponibilidade, {});
      }
      //se o horário funcionamento com este dia FOR encontrado
      const atualizarDataDisponibilidade: UpdateDataDisponibilidadeDto = { //Preparar objeto para update (também sem id, caso o mesmo esteja incorreto)
        dia: updateDataDisponibilidadeDto.dia,
        horarioInicio: updateDataDisponibilidadeDto.horarioInicio,
        horarioFim: updateDataDisponibilidadeDto.horarioFim,
        pausaInicio: updateDataDisponibilidadeDto.pausaInicio,
        pausaFim: updateDataDisponibilidadeDto.pausaFim,
      }
      return await this.dataDisponibilidadeRepository.update(existeDataDisponibilidade.id, atualizarDataDisponibilidade) //utilizar o id encontrado no horário existente
    } catch (e) {
      throw new NotAcceptableException(e);
    }
  }
}

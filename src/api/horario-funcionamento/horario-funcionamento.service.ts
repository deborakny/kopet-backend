import { Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateHorarioFuncionamentoDto } from './dto/create-horario-funcionamento.dto';
import { UpdateHorarioFuncionamentoDto } from './dto/update-horario-funcionamento.dto';
import { HorarioFuncionamentoEntity } from './entities/horario-funcionamento.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstabelecimentoEntity } from '../estabelecimento/entities/estabelecimento.entity';

@Injectable()
export class HorarioFuncionamentoService {

  constructor(
    @InjectRepository(HorarioFuncionamentoEntity)
    private horarioFuncionamentoRepository: Repository<HorarioFuncionamentoEntity>,) { }

  //create(createHorarioFuncionamentoDto: CreateHorarioFuncionamentoDto) {
  //  return 'This action adds a new horarioFuncionamento';
  //}

  findAll() {
    return this.horarioFuncionamentoRepository.find();
  }

  findOne(id: number) {
    return this.horarioFuncionamentoRepository.findOne({
      where: {
        id
      },
      order:{
        dia:'ASC'
      }
    });
  }

  findByEstabelecimento(id: number) {
    return this.horarioFuncionamentoRepository.find({
      where: {
        estabelecimento: {
          id
        },
      },
      order:{
        dia:'ASC'
      }
    });
  }

  update(id: number, updateHorarioFuncionamentoDto: UpdateHorarioFuncionamentoDto) {
    const horarioFuncionamento = this.findOne(id);
    if (horarioFuncionamento) {
      return this.horarioFuncionamentoRepository.update(id, updateHorarioFuncionamentoDto)
    }
    return this.horarioFuncionamentoRepository.save({ id, updateHorarioFuncionamentoDto });
  }


  async updateByEstabelecimento(estabelecimentoId: number, updateHorarioFuncionamentoDto: UpdateHorarioFuncionamentoDto[]) {
    await Promise.all(updateHorarioFuncionamentoDto.map( //Para cada horarioFuncionamento, de maneira assíncrona
      async updateHorarioDto => {
        updateHorarioDto.estabelecimento = new EstabelecimentoEntity({id:estabelecimentoId}); //inicializar estabelecimento do horário funcionamento

        if (updateHorarioDto.id) { //se houver id do horário significa que é uma atualização (provavelmente)
          const horarioFuncionamento = await this.horarioFuncionamentoRepository.findOne({ //Verifica se há um horário salvo com esse id
            where:{
              id:updateHorarioDto.id,
              estabelecimento:{
                id:estabelecimentoId, //respeitando que o horário tem de ser deste estabelecimento específico
              }
            }
          });

          if ((horarioFuncionamento)) { //se for encontrado um horário com este id pertencendo a este estabelecimento, atualizar
            try {
              return await this.horarioFuncionamentoRepository.update(updateHorarioDto.id, updateHorarioDto);
            } catch (e) {
              throw new NotAcceptableException(e);
            }
          } else {
            this.existeDia(updateHorarioDto,estabelecimentoId);
          }
        } else {
          this.existeDia(updateHorarioDto,estabelecimentoId);
        }
      }
    ));

    const horariosFuncionamento = await this.findByEstabelecimento(estabelecimentoId); //todos horários para este estabelecimento

    if (horariosFuncionamento.length > 0) { //se houver algo
      Promise.all(horariosFuncionamento.map( //para cada horário já salvo
        async horarioFuncionamento => {
          const existe = updateHorarioFuncionamentoDto.filter( //ver se existe o horário que salvou agora
            horarioFuncionamentoDto => horarioFuncionamento.dia === horarioFuncionamentoDto.dia
          );
          if (existe.length === 0) { //Se não houver, significa que não foi enviado para atualizar e, portanto, será removido (estabelecimento não quer mais aquele horárioFuncionamento)
            return this.remove(horarioFuncionamento.id)
          }
         }
      ));
    }
  }


  async remove(id: number) {

    const horarioFuncionamentoDeletado = await this.horarioFuncionamentoRepository.delete(id);

    if (!horarioFuncionamentoDeletado.affected) {
      throw new NotFoundException('Horário de Funcionamento não encontrado')
    }

    const resultado = {
      message: 'Horário de Funcionamento removido com sucesso'
    };

    return resultado;
  }

  //Função auxiliar para verificar se o horario, sem id encontrado ou informado, já tem cadastrado o dia para este estabelecimento
  //se houver, somente atualizar o horarioFuncionamento já existente, com os dados enviados
  //se não houver um dia existente, criar novo horarioFuncionamento
  async existeDia(updateHorarioDto:UpdateHorarioFuncionamentoDto, estabelecimentoId){
    try { //procura no Banco de Dados se há um horario funcionamento com este dia, para este estabelecimento
      const existeHorarioFuncionamento = await this.horarioFuncionamentoRepository.findOneBy({dia: updateHorarioDto.dia, estabelecimento:{id: estabelecimentoId}}) 
      if(!existeHorarioFuncionamento){ //se não existir -> salvar
        const salvarHorario:CreateHorarioFuncionamentoDto = { //Criar novo objeto só com o necessário para criar o horario (para caso viesse com um id inválido e não ser tentada a atualização pelo TypeORM) 
          dia: updateHorarioDto.dia,
          horaInicial: updateHorarioDto.horaInicial,
          horaFinal: updateHorarioDto.horaFinal,
          estabelecimento:{id: estabelecimentoId}
          }
        return await this.horarioFuncionamentoRepository.save(salvarHorario); 
      }
      //se o horário funcionamento com este dia FOR encontrado
      const atualizarHorario:UpdateHorarioFuncionamentoDto = { //Preparar objeto para update (também sem id, caso o mesmo esteja incorreto)
        dia: updateHorarioDto.dia,
        horaInicial: updateHorarioDto.horaInicial,
        horaFinal: updateHorarioDto.horaFinal
        }
      return await this.horarioFuncionamentoRepository.update(existeHorarioFuncionamento.id, atualizarHorario) //utilizar o id encontrado no horário existente
    } catch (e) {
      throw new NotAcceptableException(e);
    }
  }  
}
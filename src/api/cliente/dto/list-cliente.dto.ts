import { PartialType } from "@nestjs/mapped-types";
import { CreateClienteDto } from "./create-cliente.dto";
import { IsNotEmpty } from "class-validator";
import { ListContaDto } from "src/api/conta/dto/list-conta.dto";
import { PetEntity } from "src/api/pet/entities/pet.entity";

export class ListClienteDto {
    constructor(
        readonly id: number,
        readonly nome: string,
        readonly sobrenome: string,
        readonly telefone: string,
    ) { }
    conta: ListContaDto;
    pets: PetEntity[];

}
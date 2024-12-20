import { PartialType } from '@nestjs/mapped-types';
import { CreateEnderecoDto } from "./create-endereco.dto";
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateEnderecoDto extends PartialType(CreateEnderecoDto){
}
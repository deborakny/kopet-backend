import { IsNotEmpty, IsString } from "class-validator";

export class GetEstabelecimentoNomeDto {
    @IsString()
    @IsNotEmpty()
    nome: string;
}
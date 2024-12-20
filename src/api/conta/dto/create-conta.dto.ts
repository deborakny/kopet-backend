import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, MinLength } from 'class-validator';

export class CreateContaDto {
  @ApiProperty(
    {
      example: 'teste@gmail.com'
    }
  )
  @IsEmail()
  email: string;

  @ApiProperty(
    {
      example: '@bc123'
    }
  )
  @MinLength(6)
  senha: string;

  @ApiProperty(
    {
      example: false
    }
  )
  @IsOptional()
  @IsBoolean()
  tipoEstabelecimento: boolean = false;
}

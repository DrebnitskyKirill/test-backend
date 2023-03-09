import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  readonly id: string;

  @IsNotEmpty()
  readonly password: string;
}

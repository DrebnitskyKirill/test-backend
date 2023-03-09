import { IsNotEmpty } from 'class-validator';

export class TodoDto {
  @IsNotEmpty()
  _id: string;

  @IsNotEmpty()
  owner: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}

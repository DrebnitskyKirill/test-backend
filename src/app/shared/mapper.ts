import { UserDto } from '../users/dto/user.dto';
import { UserModel } from '../models/user.model';

export const toUserDto = (data: UserModel): UserDto => {
  const { id, token } = data;

  const userDto: UserDto = {
    id,
    token,
  };

  return userDto;
};

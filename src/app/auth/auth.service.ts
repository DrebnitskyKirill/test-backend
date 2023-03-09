import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginStatus } from '../interfaces/interfaces';
import { LoginUserDto } from '../users/dto/user-login.dto';
import { JwtPayload } from '../interfaces/interfaces';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/user.create.dto';
import { UserDto } from '../users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(userDto: CreateUserDto): Promise<{ id: string; token: string }> {
    const user = await this.usersService.create(userDto); 
    const token = this._createToken(user);
    return { id: user.id, ...token };
  }

  async signIn(loginUserDto: LoginUserDto): Promise<LoginStatus> {
    const user = await this.usersService.findByLogin(loginUserDto); // Ищем пользователя по соответствию
    const token = this._createToken(user);
    return {
      ...token,
    };
  }

  async validateUser(payload: JwtPayload): Promise<UserDto> {
    const user = await this.usersService.findByPayload(payload);
    if (!user) {
      throw new HttpException('Bad id or password', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  async _createToken({ id }: UserDto): Promise<any> {
    const user: JwtPayload = { id };
    const accessToken = this.jwtService.sign(user);

    return {
      accessToken,
    };
  }
}

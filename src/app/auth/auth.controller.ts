import {
  Controller,
  Body,
  Post,
  HttpException,
  HttpStatus,
  Get,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginStatus, RegistrationStatus } from '../interfaces/interfaces';
import { LoginUserDto } from '../users/dto/user-login.dto';
import { JwtPayload } from '../interfaces/interfaces';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from '../users/dto/user.create.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('signup')
  public async signUp(
    @Body() createUserDto: CreateUserDto,
  ): Promise<RegistrationStatus> {
    const user = await this.authService.signUp(createUserDto);
    if (!user) {
      throw new HttpException(
        'Bad id or password',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const token = await this.authService._createToken(user);
    return { id: user.id, token: token.token };
  }

  @UsePipes(new ValidationPipe())
  @Post('signin')
  public async signIn(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<LoginStatus> {
    return await this.authService.signIn(loginUserDto);
  }

  @Get('user')
  @UseGuards(AuthGuard())
  public async getUser(@Req() req: any): Promise<JwtPayload> {
    const userId = req.user;
    if (!userId) {
      throw new HttpException('Bad token', HttpStatus.FORBIDDEN);
    }
    return { id: userId.toHexString() };
  }
}

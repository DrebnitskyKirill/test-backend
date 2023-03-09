import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/user.create.dto';
import { LoginUserDto } from './dto/user-login.dto';
import { toUserDto } from '../shared/mapper';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel } from '../models/user.model';
import { Model } from 'mongoose';
import { genSalt, hash, compare } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserModel>,
  ) {}

  async findOne(options?: object): Promise<UserDto> {
    const user = await this.userModel.findOne(options).exec();
    return toUserDto(user);
  }

  async findByLogin({ id, password }: LoginUserDto): Promise<UserDto> {
    const user = await this.userModel.findOne({ id }).exec();

    if (!user) {
      throw new HttpException('Bad token', HttpStatus.NOT_FOUND);
    }

    const areEqual = await compare(password, user.password);
    if (!areEqual) {
      throw new HttpException('"Bad id or password"', HttpStatus.UNAUTHORIZED);
    }

    return toUserDto(user);
  }

  async findByPayload({ id }: any): Promise<UserDto> {
    return await this.findOne({ id });
  }

  async create(userDto: CreateUserDto): Promise<UserDto> {
    const { password } = userDto;

    const userInDb = await this.userModel.findOne({ password }).exec();
    if (userInDb) {
      throw new HttpException('Bad id or password', HttpStatus.BAD_REQUEST);
    }

    const salt = await genSalt(10);
    const hashPassword = await hash(password, salt);

    const user: UserModel = await new this.userModel({
      password: hashPassword,
    });

    await user.save();

    return toUserDto(user);
  }
  async setTodoToCurrentUser(_id, todoId) {
    await this.userModel.updateOne({ _id }, { $push: { todos: todoId } });
  }

  async deleteToCurrentUser(_id, todoId) {
    await this.userModel.updateOne({ _id }, { $pull: { todos: todoId } });
  }
}

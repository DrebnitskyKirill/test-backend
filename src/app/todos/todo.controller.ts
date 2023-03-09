import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TodosService } from './todo.service';
import { AuthGuard } from '@nestjs/passport';
import { TodoDto } from './dto/todo.dto';
import { UsersService } from '../users/users.service';

@Controller('todos')
export class TodoController {
  constructor(
    private readonly todosService: TodosService,
    private readonly usersService: UsersService,
  ) {}
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Req() req, @Body() todosDto: TodoDto) {
    return await this.todosService.create(req.user._id, todosDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAll(@Req() req) {
    return await this.todosService.getAll(req.user.todos);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async get(@Req() req, @Param('id') id) {
    return await this.todosService.get(req.user.todos, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  async delete(@Req() req, @Body() body) {
    return await this.todosService.delete(req.user, body.id);
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'))
  @Put()
  async updateTodo(@Req() req, @Body() todosDto: TodoDto) {
    return await this.todosService.updateTodo(req.user, todosDto);
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TodoDto } from './dto/todo.dto';
import { TodoModel } from '../models/todo.model';
import { UsersService } from '../users/users.service';

@Injectable()
export class TodosService {
  constructor(
    @InjectModel(TodoModel.name)
    private readonly todoModel: Model<TodoModel>,
    private readonly userService: UsersService,
  ) {}

  async create(userId, todoDto: TodoDto) {
    const todo = await this.todoModel.create(todoDto);
    await this.userService.setTodoToCurrentUser(userId, todo._id);
    return todo;
  }

  async getAll(todosId) {
    return await this.todoModel.find().where('_id').in(todosId).exec();
  }

  async get(todos, id: string) {
    if (this.todoExistence(todos, id)) {
      return await this.todoModel.findOne({ _id: id }).exec();
    }
  }

  async delete(user, id) {
    if (this.todoExistence(user.todos, id)) {
      await this.userService.deleteToCurrentUser(user._id, id);
      return await this.todoModel.deleteOne({ _id: id }).exec();
    }

    throw new HttpException('Is not an owner', HttpStatus.NOT_FOUND);
  }

  async updateTodo(user, body) {
    if (this.todoExistence(user.todos, body._id)) {
      return await this.todoModel.updateOne(body).exec();
    }
    throw new HttpException('todo not found', HttpStatus.NOT_FOUND);
  }

  private todoExistence(userTodos, todoId) {
    return userTodos.find((id) => todoId === id.toString());
  }
}


import { Module } from '@nestjs/common';
import { TodosService } from './todo.service';
import { TodoController } from './todo.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoModel, TodoSchema } from '../models/todo.model';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      {
        name: TodoModel.name,
        schema: TodoSchema,
      },
    ]),
  ],
  providers: [TodosService],
  controllers: [TodoController],
})
export class TasksModule {}

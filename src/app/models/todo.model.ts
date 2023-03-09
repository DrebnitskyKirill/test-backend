import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ITodo } from '../interfaces/interfaces';

@Schema({ collection: 'todos' })
export class TodoModel extends Document implements ITodo {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  owner: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  title: string;
}

export const TodoSchema = SchemaFactory.createForClass(TodoModel);

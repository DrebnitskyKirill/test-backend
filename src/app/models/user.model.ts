import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IUser } from '../interfaces/interfaces';

@Schema({ collection: 'users' })
export class UserModel extends Document implements IUser {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  password: string;
}
export const UserSchema = SchemaFactory.createForClass(UserModel);

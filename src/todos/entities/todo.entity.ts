import { BaseEntity } from './../../entities/base-entities.js';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, model, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Todo extends BaseEntity {
  @Prop({ required: true, maxlength: 20 })
  name: string;

  @Prop({ required: true, maxlength: 100 })
  description: string;

  @Prop({ required: true })
  completed: boolean;
}

export type TodoDocument = Todo & Document;

export const TodoSchema = SchemaFactory.createForClass(Todo);

export const TodoMongooseSchema = new MongooseSchema<Todo>(
  {
    name: { type: 'String', required: true },
    description: { type: 'String', required: true },
    completed: { type: 'Boolean', required: true },
  },
  { timestamps: true },
);

export const TodoMongooseModel = model<Todo>('Todo', TodoSchema, 'todos');

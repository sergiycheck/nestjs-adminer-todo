import { Todo } from './entities/todo.entity.js';
import { Injectable } from '@nestjs/common';
import { Document } from 'mongoose';
import { ResponseTodo } from './dto/responses.dto.js';

@Injectable()
export class TodosMapService {
  public mapResponse(todo: Document<Todo>): ResponseTodo {
    const { _id, ...data } = todo;

    return {
      id: _id,
      ...data,
    } as unknown as ResponseTodo;
  }
}

import { TodosMapService } from './todos-map.service.js';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { CreateTodoDto } from './dto/create-todo.dto.js';
import { UpdateTodoDto } from './dto/update-todo.dto.js';
import { TodoDocument, Todo } from './entities/todo.entity.js';
import { FindAllDto } from './dto/findAll.dto.js';
import { RemoveResponse } from './dto/responses.dto.js';

@Injectable()
export class TodosService {
  constructor(
    @InjectModel('Todo') public model: Model<TodoDocument>,
    private readonly todosMapService: TodosMapService,
  ) {}

  async create(createTodoDto: CreateTodoDto) {
    const todo = new this.model({
      ...createTodoDto,
    });
    const newTodo = await todo.save();
    const obj = newTodo.toObject() as Document<Todo>;
    return this.todosMapService.mapResponse(obj);
  }

  async findAll(dto: FindAllDto) {
    const skip = (dto.page - 1) * dto.limit;
    const arrQuery = await this.model.find({}).skip(skip).limit(dto.limit);
    return arrQuery.map((o) => this.todosMapService.mapResponse(o.toObject()));
  }

  async findOne(id: string) {
    const todo = (await this.model.findById(id).lean()) as Document<Todo>;
    return this.todosMapService.mapResponse(todo);
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    const exists = await this.model.exists({ _id: id });
    if (!exists) throw new NotFoundException(`todo with id ${id} doesn't exist `);

    const { id: idDto, ...updateData } = updateTodoDto;
    const updateTodo = await this.model
      .findOneAndUpdate(
        { _id: idDto },
        { ...updateData },
        { runValidators: true, new: true },
      )
      .lean();

    return this.todosMapService.mapResponse(updateTodo);
  }

  async remove(id: string): Promise<RemoveResponse> {
    return this.model.deleteOne({ _id: id }) as any;
  }
}

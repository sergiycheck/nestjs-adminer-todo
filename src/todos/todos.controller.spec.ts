import { UpdateTodoDto } from './dto/update-todo.dto.js';
import { RemoveResponse, ResponseTodo } from './dto/responses.dto.js';
import { TodosMapService } from './todos-map.service.js';
import { Test, TestingModule } from '@nestjs/testing';
import { TodosController } from './todos.controller.js';
import { TodosService } from './todos.service.js';
import { getModelToken } from '@nestjs/mongoose';
import { TodoDocument } from './entities/todo.entity.js';
import { Model } from 'mongoose';
import {
  createTodoJsonFirst,
  createTodoJsonSecond,
  removeResponse,
} from './todos.controller.test-data.js';

describe('TodosController', () => {
  let todosController: TodosController;
  let todosService: TodosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [
        TodosService,
        TodosMapService,
        {
          provide: getModelToken('Todo'),
          useValue: Model<TodoDocument>,
        },
      ],
    }).compile();

    todosController = module.get<TodosController>(TodosController);
    todosService = module.get<TodosService>(TodosService);
  });

  it('should be defined', () => {
    expect(todosController).toBeDefined();
    expect(todosService).toBeDefined();
  });

  it('creates todo', async () => {
    const result = JSON.parse(createTodoJsonFirst);
    const dto = {
      name: result.name,
      description: result.description,
      completed: result.description,
    };

    jest.spyOn(todosService, 'create').mockImplementation(() => result);

    expect(await todosController.create(dto)).toEqual(result);
  });

  it('finds all todos', async () => {
    const arr = [createTodoJsonFirst, createTodoJsonSecond].map((item) =>
      JSON.parse(item),
    );
    jest.spyOn(todosService, 'findAll').mockImplementation(async () => arr);

    expect(await todosController.findAll(1, 20)).toEqual(arr);
  });

  it('finds one todo', async () => {
    const res = JSON.parse(createTodoJsonFirst) as ResponseTodo;

    jest.spyOn(todosService, 'findOne').mockImplementation(async () => res);

    expect(await todosController.findOne(`${res.id}`)).toEqual(res);
  });

  it('updates one todo', async () => {
    const firstObj = JSON.parse(createTodoJsonFirst) as ResponseTodo;
    const expected: ResponseTodo = {
      ...firstObj,
      completed: true,
    };

    const updateTodo: UpdateTodoDto = {
      id: firstObj.id,
      completed: true,
    };

    jest.spyOn(todosService, 'update').mockImplementation(async () => expected);

    expect(await todosController.update(updateTodo.id, updateTodo)).toEqual(expected);
  });

  it('deletes one todo', async () => {
    const deleteMe = JSON.parse(createTodoJsonFirst) as ResponseTodo;
    const removeResponseObj = JSON.parse(removeResponse) as RemoveResponse;

    jest.spyOn(todosService, 'remove').mockImplementation(async () => removeResponseObj);

    expect(await todosController.remove(deleteMe.id)).toEqual(removeResponseObj);
  });
});

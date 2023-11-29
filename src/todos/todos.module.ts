import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { TodosService } from './todos.service.js';
import { TodosController } from './todos.controller.js';
import { Todo, TodoSchema } from './entities/todo.entity.js';
import { TodosMapService } from './todos-map.service.js';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Todo.name,
        useFactory: () => {
          const schema = TodoSchema;
          return schema;
        },
      },
    ]),
  ],
  controllers: [TodosController],
  providers: [TodosService, TodosMapService],
})
export class TodosModule {}

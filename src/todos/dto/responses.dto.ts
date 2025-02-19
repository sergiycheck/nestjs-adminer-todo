import { Todo } from '../entities/todo.entity.js';

export type ResponseTodo = Omit<Todo, '_id'> & {
  id: string;

  createdAt: string;
  updatedAt: string;
};

export type RemoveResponse = {
  acknowledged: boolean;
  deletedCount: number;
};

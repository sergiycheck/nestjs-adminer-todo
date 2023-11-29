import { FindAllDto } from '../todos/dto/findAll.dto.js';
import { CustomParseObjectIdPipe } from './../pipes/custom-parse-objectid.pipe.js';
import { NotEmptyPipe } from './../pipes/not-empty.pipe.js';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { TodosService } from './todos.service.js';
import { CreateTodoDto } from './dto/create-todo.dto.js';
import { UpdateTodoDto } from './dto/update-todo.dto.js';
import { ApiTags } from '@nestjs/swagger';
import { validate } from 'class-validator';

@ApiTags('TodosController')
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todosService.create(createTodoDto);
  }

  @Get()
  async findAll(@Query('page') page: number, @Query('limit') limit: number) {
    const dto = new FindAllDto({ page, limit });
    const errs = await validate(dto);
    if (errs.length)
      throw new BadRequestException(errs.map((err) => ({ contraint: err.constraints })));
    return this.todosService.findAll(dto);
  }

  @Get(':id')
  findOne(
    @Param('id', new NotEmptyPipe('id'), new CustomParseObjectIdPipe()) id: string,
  ) {
    return this.todosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new NotEmptyPipe('id'), new CustomParseObjectIdPipe()) id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todosService.update(id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id', new NotEmptyPipe('id'), new CustomParseObjectIdPipe()) id: string) {
    return this.todosService.remove(id);
  }
}

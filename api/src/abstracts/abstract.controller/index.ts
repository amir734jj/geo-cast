import {
  BadRequestException,
  Body,
  Delete,
  Get,
  NotFoundException,
  Param, Patch,
  Post,
  Put
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse
} from '@nestjs/swagger';
import type BasicCrud from '../../interfaces/crud.interface';

export abstract class AbstractController<T> {
  abstract service: BasicCrud<T>

  @Get(':id')
  @ApiOkResponse({
    description: 'Successfully returned a matching record'
  })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  async get (@Param('id') id: number): Promise<T> {
    const result = await this.service.get(id);

    if (result == null) {
      throw new NotFoundException();
    }

    return result;
  }

  @Get()
  @ApiOkResponse({
    description: 'Successfully returned all matching record'
  })
  async getAll (): Promise<T[]> {
    return await this.service.all();
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Successfully deleted a matching record'
  })
  async delete (@Param('id') id: number): Promise<T> {
    const result = await this.service.delete(id);

    if (result == null) {
      throw new BadRequestException(`Delete with id ${id} failed`);
    }

    return result;
  }

  @Post()
  @ApiCreatedResponse({ description: 'Successfully saved a new record' })
  async save (@Body() question: T): Promise<T> {
    const result = await this.service.save(question);

    if (!result) {
      throw new BadRequestException('Save failed');
    }

    return result;
  }

  @Put(':id')
  @ApiOkResponse({
    description: 'Successfully updated matching record'
  })
  async update (@Param('id') id: number, @Body() question: T): Promise<T> {
    const result = await this.service.update(id, question);

    if (result == null) {
      throw new BadRequestException(`Update with id ${id} failed`);
    }

    return result;
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'Successfully patched matching record'
  })
  async patch (@Param('id') id: number, @Body() question: T): Promise<T> {
    const result = await this.service.patch(id, question);

    if (result == null) {
      throw new BadRequestException(`Update with id ${id} failed`);
    }

    return result;
  }
}

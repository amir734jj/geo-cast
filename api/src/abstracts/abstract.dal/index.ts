import {
  type FindOneOptions,
  type FindOptionsOrder,
  type FindOptionsWhere,
  type Repository,
} from 'typeorm';
import type IBasicCrud from '../../interfaces/crud.interface';
import { type EntityType } from '@geo-cast/lib/dto/account';
import { type QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class AbstractDal<T extends EntityType>
  implements IBasicCrud<T>
{
  abstract repository: Repository<T>;

  abstract resolver(partial: Partial<T>): T;

  includes: string[] = [];

  public async all(
    count: number = 10,
    page: number = 1,
    order: FindOptionsOrder<T> = {}
  ): Promise<T[]> {
    return await this.repository.find({
      relations: this.includes,
      cache: true,
      take: count,
      skip: (page - 1) * count,
      order,
    });
  }

  public async count(props: Partial<T>): Promise<number> {
    return await this.repository.count({
      where: props,
    } as FindOneOptions<T>);
  }

  public async get(id: number): Promise<T | null> {
    return await this.repository.findOne({
      where: { id },
      relations: this.includes,
    } as FindOneOptions<T>);
  }

  public async find(props: Partial<T>): Promise<T | null> {
    return await this.repository.findOne({
      where: props,
      relations: this.includes,
    } as FindOneOptions<T>);
  }

  public async findMany(props: Partial<T>): Promise<T[]> {
    return await this.repository.find({
      where: props,
      relations: this.includes,
    } as FindOneOptions<T>);
  }

  public async save(partial: Partial<T>): Promise<T> {
    const data = await this.repository.save(this.resolver(partial));
    if (data && data.id) {
      return await this.get(data.id) as T;
    } else {
      throw new Error('Failed to save entity');
    }
  }

  public async update(id: number, partial: Partial<T>): Promise<T | null> {
    await this.repository.update(
      id,
      this.resolver(partial) as QueryDeepPartialEntity<T>
    );
    return await this.get(id);
  }

  public async delete(id: number): Promise<T | null> {
    const user = await this.get(id);
    await this.repository.delete(id);
    return user;
  }

  async patch(id: number, partial: Partial<T>): Promise<T | null> {
    await this.repository.update(id, {
      ...partial,
    } as QueryDeepPartialEntity<T>);
    return await this.get(id);
  }
}

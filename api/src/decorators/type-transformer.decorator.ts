import { plainToClass } from 'class-transformer';
import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { ClassType } from 'class-transformer/ClassTransformer';

export class TypeTransformer<T> implements PipeTransform {
  private readonly ty: ClassType<T>;

  constructor(ty: ClassType<T>) {
    this.ty = ty;
  }

  transform(value: any, a: ArgumentMetadata) {
    return plainToClass(this.ty, value, { enableImplicitConversion: true });
  }
}
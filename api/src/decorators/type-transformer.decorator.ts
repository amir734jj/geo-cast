import { plainToClass } from 'class-transformer'
import { type PipeTransform, type ArgumentMetadata } from '@nestjs/common'
import { type ClassType } from 'class-transformer/ClassTransformer'

export class TypeTransformer<T> implements PipeTransform {
  private readonly ty: ClassType<T>

  constructor (ty: ClassType<T>) {
    this.ty = ty
  }

  transform (value: any, a: ArgumentMetadata) {
    return plainToClass(this.ty, value, { enableImplicitConversion: true })
  }
}

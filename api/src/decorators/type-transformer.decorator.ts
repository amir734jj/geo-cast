import { plainToInstance } from 'class-transformer'
import { type PipeTransform, type ArgumentMetadata } from '@nestjs/common'
import { type ClassConstructor } from 'class-transformer'

export class TypeTransformer<T> implements PipeTransform {
  private readonly ty: ClassConstructor<T>

  constructor (ty: ClassConstructor<T>) {
    this.ty = ty
  }

  transform (value: any, _metadata: ArgumentMetadata) {
    return plainToInstance(this.ty, value, { enableImplicitConversion: true })
  }
}

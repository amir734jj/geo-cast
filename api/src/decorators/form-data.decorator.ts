import { BadRequestException } from '@nestjs/common'
import { validateSync } from 'class-validator'
import _ from 'lodash'

export const FormDataBody: (_: any) => ParameterDecorator = (ty: any) => (target: any, propertyKey: string, parameterIndex: number) => {
  FormDataValidator.registerFormDataBody(target, propertyKey, parameterIndex, ty)
}

export const FormDataDtoValidator: () => MethodDecorator = () => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value
  descriptor.value = function (...args: any[]) {
    FormDataValidator.performValidation(target, propertyKey, args)
    return originalMethod.apply(this, args)
  }
}

class FormDataValidator {
  private static readonly formDataBodyValidatorMap = new Map<any, Map<string, number[]>>()

  static registerFormDataBody (target: any, methodName: string, paramIndex: number, ty: any): void {
    let paramMap = this.formDataBodyValidatorMap.get(target)
    if (!paramMap) {
      paramMap = new Map()
      this.formDataBodyValidatorMap.set(target, paramMap)
    }
    let methodFormalInfos = paramMap.get(methodName)
    if (!methodFormalInfos) {
      methodFormalInfos = []
      paramMap.set(methodName, methodFormalInfos)
    }
    methodFormalInfos.push(paramIndex)
  }

  static performValidation (target: any, methodName: string, paramValues: any[]) {
    const paramMap = this.formDataBodyValidatorMap.get(target)
    if (!paramMap) {
      return true
    }
    const methodFormalInfos = paramMap.get(methodName)
    if (!methodFormalInfos) {
      return true
    }
    for (const [index, paramValue] of paramValues.entries()) {
      const formalInfo = _.find(methodFormalInfos, x => x === index)

      if (formalInfo) {
        const validationResult = validateSync(paramValue)

        if (validationResult.length > 0) {
          throw new BadRequestException(validationResult.map(x => x.toString()))
        }
      }
    }
  }
}

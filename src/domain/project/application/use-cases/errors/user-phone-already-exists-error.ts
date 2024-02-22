import { UseCaseError } from '@/core/errors/use-case-error'

export class UserPhoneAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Celular do usuário "${identifier}" já cadastrado.`)
  }
}

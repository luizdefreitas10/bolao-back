import { UseCaseError } from '@/core/errors/use-case-error'

export class CodeNotRegistredError extends Error implements UseCaseError {
  constructor() {
    super(`Verification code not registered`)
  }
}

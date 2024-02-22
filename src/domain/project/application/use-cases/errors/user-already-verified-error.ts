import { UseCaseError } from '@/core/errors/use-case-error'

export class UserAlreadyVerifiedError extends Error implements UseCaseError {
  constructor() {
    super(`User is already verified, please log in.`)
  }
}

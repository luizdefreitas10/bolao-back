import { UseCaseError } from '@/core/errors/use-case-error'

export class CodeExpiredError extends Error implements UseCaseError {
  constructor() {
    super(`Verification code expired.`)
  }
}

import { UseCaseError } from '@/core/errors/use-case-error'

export class TeamNotFoundError extends Error implements UseCaseError {
  constructor() {
    super(`Team not found.`)
  }
}

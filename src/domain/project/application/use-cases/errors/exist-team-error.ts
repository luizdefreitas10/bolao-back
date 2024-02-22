import { UseCaseError } from '@/core/errors/use-case-error'

export class ExistTeamError extends Error implements UseCaseError {
  constructor() {
    super(`Esse time já existe.`)
  }
}

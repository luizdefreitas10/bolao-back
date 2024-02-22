import { UseCaseError } from '@/core/errors/use-case-error'

export class MatchAlreadyExistError extends Error implements UseCaseError {
  constructor() {
    super(`Já existe um jogo com esses times nessa data.`)
  }
}

import { UseCaseError } from '@/core/errors/use-case-error'

export class MatchNotFoundError extends Error implements UseCaseError {
  constructor() {
    super(`Partida não encontrada.`)
  }
}

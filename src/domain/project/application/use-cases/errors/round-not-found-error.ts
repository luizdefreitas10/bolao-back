import { UseCaseError } from '@/core/errors/use-case-error'

export class RoundNotFoundError extends Error implements UseCaseError {
  constructor() {
    super(`Rodada não encontrada.`)
  }
}

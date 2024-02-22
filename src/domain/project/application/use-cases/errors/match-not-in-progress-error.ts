import { UseCaseError } from '@/core/errors/use-case-error'

export class MatchNotInProgressError extends Error implements UseCaseError {
  constructor() {
    super(`Jogo ainda não começou.`)
  }
}

import { UseCaseError } from '@/core/errors/use-case-error'

export class MatchForbiddenRemoveError extends Error implements UseCaseError {
  constructor() {
    super(`Não é possível excluir a partida.`)
  }
}

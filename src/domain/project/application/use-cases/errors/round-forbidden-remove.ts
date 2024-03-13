import { UseCaseError } from '@/core/errors/use-case-error'

export class RoundForbiddenRemoveError extends Error implements UseCaseError {
  constructor() {
    super(`Não é possível excluir a rodada.`)
  }
}

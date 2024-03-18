import { UseCaseError } from '@/core/errors/use-case-error'

export class MatchPastError extends Error implements UseCaseError {
  constructor() {
    super(`Não é possível adicionar partida com datas passadas.`)
  }
}

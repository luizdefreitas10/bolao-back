import { UseCaseError } from '@/core/errors/use-case-error'

export class MatchPastError extends Error implements UseCaseError {
  constructor() {
    super(`Não pode adicionar jogo com datas passadas.`)
  }
}

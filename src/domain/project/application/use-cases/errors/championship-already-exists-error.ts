import { UseCaseError } from '@/core/errors/use-case-error'

export class ChampionshipAlreadyExistsError extends Error implements UseCaseError {
  constructor() {
    super(`Championship already exists.`)
  }
}

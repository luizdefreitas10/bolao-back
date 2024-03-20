import { UseCaseError } from '@/core/errors/use-case-error'

export class ChampionshipDoesNotExistYetError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(`Championship doesnt exist yet.`)
  }
}

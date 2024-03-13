import { UseCaseError } from '@/core/errors/use-case-error'

export class PredictionExistForThisUserAndMatch
  extends Error
  implements UseCaseError
{
  constructor() {
    super(`Já existe um palpite desse usuário pra esse jogo.`)
  }
}

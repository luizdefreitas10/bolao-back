import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ChampionshipRepository } from '../repositories/championship-repository'
import { ChampionshipDoesNotExistYetError } from './errors/championship-doesnt-exist-yet-error'

interface RemoveChampionshipUseCaseRequest {
  championshipName: string
}

type RemoveChampionshipUseCaseResponse = Either<
  ChampionshipDoesNotExistYetError,
  null
>

@Injectable()
export class RemoveChampionshipUseCase {
  constructor(private championshipRepository: ChampionshipRepository) {}

  async execute({
    championshipName,
  }: RemoveChampionshipUseCaseRequest): Promise<RemoveChampionshipUseCaseResponse> {
    const championship =
      await this.championshipRepository.findByName(championshipName)

    if (!championship) {
      return left(new ChampionshipDoesNotExistYetError())
    }

    await this.championshipRepository.removeChampionship(championship)

    return right(null)
  }
}

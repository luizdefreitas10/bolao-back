import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ChampionshipRepository } from '../repositories/championship-repository'
import { ChampionshipWithWaitingRoundsDetails } from '../repositories/types/admin-round-details'

type FetchChampionshipsWithWaitingRoundsUseCaseResponse = Either<
  null,
  {
    championships: ChampionshipWithWaitingRoundsDetails[]
  }
>

@Injectable()
export class FetchChampionshipsWithWaitingRoundsUseCase {
  constructor(private championshipRepository: ChampionshipRepository) {}

  async execute(
    userId: string,
  ): Promise<FetchChampionshipsWithWaitingRoundsUseCaseResponse> {
    const championships =
      await this.championshipRepository.findManyWithWaitingRounds(userId)

    return right({ championships })
  }
}

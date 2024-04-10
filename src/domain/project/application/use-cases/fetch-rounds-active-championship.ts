import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { RoundRepository } from '../repositories/round-repository'
import { Round } from '../../enterprise/entities/round'

interface FetchRoundsActiveChampionshipUseCaseRequest {
  champId: string
  page: number
}

type FetchRoundsActiveChampionshipUseCaseResponse = Either<
  null,
  {
    rounds: Round[]
  }
>

@Injectable()
export class FetchRoundsActiveChampionshipUseCase {
  constructor(private roundRepository: RoundRepository) {}

  async execute({
    champId,
    page,
  }: FetchRoundsActiveChampionshipUseCaseRequest): Promise<FetchRoundsActiveChampionshipUseCaseResponse> {
    const rounds = await this.roundRepository.findByChampionshipId(
      champId,
      {
        page,
      },
      true,
    )

    return right({
      rounds,
    })
  }
}

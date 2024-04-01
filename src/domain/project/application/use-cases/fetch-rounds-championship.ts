import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { RoundRepository } from '../repositories/round-repository'
import { Round } from '../../enterprise/entities/round'

interface FetchRoundsChampionshipUseCaseRequest {
  champId: string
  page: number
}

type FetchRoundsChampionshipUseCaseResponse = Either<
  null,
  {
    rounds: Round[]
  }
>

@Injectable()
export class FetchRoundsChampionshipUseCase {
  constructor(private roundRepository: RoundRepository) {}

  async execute({
    champId,
    page,
  }: FetchRoundsChampionshipUseCaseRequest): Promise<FetchRoundsChampionshipUseCaseResponse> {
    const rounds = await this.roundRepository.findByChampionshipId(champId, {
      page,
    })

    return right({
      rounds,
    })
  }
}

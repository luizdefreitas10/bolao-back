import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { RoundStatus } from '@prisma/client'
import { RoundRepository } from '../repositories/round-repository'
import { Round } from '../../enterprise/entities/round'

interface FetchRoundsByChampionshipAndStatusUseCaseRequest {
  champId: string
  status: RoundStatus
}

type FetchRoundsByChampionshipAndStatusUseCaseResponse = Either<
  null,
  {
    rounds: Round[]
  }
>

@Injectable()
export class FetchRoundsByChampionshipAndStatusUseCase {
  constructor(private roundRepository: RoundRepository) {}

  async execute({
    champId,
    status,
  }: FetchRoundsByChampionshipAndStatusUseCaseRequest): Promise<FetchRoundsByChampionshipAndStatusUseCaseResponse> {
    const rounds = await this.roundRepository.findByChampionshipIdAndStatus(
      champId,
      status,
    )

    return right({ rounds })
  }
}

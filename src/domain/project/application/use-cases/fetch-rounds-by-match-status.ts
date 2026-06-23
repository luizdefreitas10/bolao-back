import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { MatchStatus } from '@prisma/client'
import { RoundRepository } from '../repositories/round-repository'
import { AdminRoundDetails } from '../repositories/types/admin-round-details'

interface FetchRoundsByMatchStatusUseCaseRequest {
  status: MatchStatus
}

type FetchRoundsByMatchStatusUseCaseResponse = Either<
  null,
  {
    rounds: AdminRoundDetails[]
  }
>

@Injectable()
export class FetchRoundsByMatchStatusUseCase {
  constructor(private roundRepository: RoundRepository) {}

  async execute({
    status,
  }: FetchRoundsByMatchStatusUseCaseRequest): Promise<FetchRoundsByMatchStatusUseCaseResponse> {
    const rounds = await this.roundRepository.findByMatchStatus(status)

    return right({ rounds })
  }
}

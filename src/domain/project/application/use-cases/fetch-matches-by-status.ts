import { Either, left, right } from '@/core/either'
import { Match } from '../../enterprise/entities/match'
import { Injectable } from '@nestjs/common'
import { MatchStatus } from '@prisma/client'
import { MatchRepository } from '../repositories/match-repository'

interface FetchMatchesByStatusUseCaseRequest {
  status: MatchStatus
  page: number
}

type FetchMatchesByStatusUseCaseResponse = Either<
  null,
  {
    matches: Match[]
  }
>

@Injectable()
export class FetchMatchesByStatusUseCase {
  constructor(private matchRepository: MatchRepository) {}

  async execute({
    status,
    page,
  }: FetchMatchesByStatusUseCaseRequest): Promise<FetchMatchesByStatusUseCaseResponse> {
    const matches = await this.matchRepository.fetchMatchesByStatus(status, {
      page,
    })

    if (!matches) {
      return left(null)
    }

    return right({
      matches,
    })
  }
}

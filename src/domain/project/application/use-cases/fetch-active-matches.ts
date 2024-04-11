import { Either, left, right } from '@/core/either'
import { Match } from '../../enterprise/entities/match'
import { Injectable } from '@nestjs/common'
import { MatchRepository } from '../repositories/match-repository'

interface FetchActiveMatchesUseCaseRequest {
  page: number
}

type FetchActiveMatchesUseCaseResponse = Either<
  null,
  {
    matches: Match[]
  }
>

@Injectable()
export class FetchActiveMatchesUseCase {
  constructor(private matchRepository: MatchRepository) {}

  async execute({
    page,
  }: FetchActiveMatchesUseCaseRequest): Promise<FetchActiveMatchesUseCaseResponse> {
    const matches = await this.matchRepository.fetchActiveMatches({
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

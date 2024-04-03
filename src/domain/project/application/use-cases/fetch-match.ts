import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { MatchNotFoundError } from './errors/match-not-found-error'
import { MatchRepository } from '../repositories/match-repository'
import { Match } from '../../enterprise/entities/match'

interface FetchMatchUseCaseRequest {
  matchId: string
}

type FetchMatchUseCaseResponse = Either<
  MatchNotFoundError,
  {
    match: Match
  }
>

@Injectable()
export class FetchMatchUseCase {
  constructor(private matchRepository: MatchRepository) {}

  async execute({
    matchId,
  }: FetchMatchUseCaseRequest): Promise<FetchMatchUseCaseResponse> {
    const match = await this.matchRepository.findById(matchId)
    if (!match) {
      return left(new MatchNotFoundError())
    }

    return right({
      match,
    })
  }
}

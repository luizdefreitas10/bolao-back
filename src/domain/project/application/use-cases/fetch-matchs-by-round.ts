import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { MatchRepository } from '../repositories/match-repository'
import { Match } from '../../enterprise/entities/match'
import { RoundNotFoundError } from './errors/round-not-found-error'
import { RoundRepository } from '../repositories/round-repository'

interface FetchMatchByRoundUseCaseRequest {
  roundId: string
  page: number
}

type FetchMatchByRoundUseCaseResponse = Either<
  RoundNotFoundError,
  {
    matchs: Match[]
  }
>

@Injectable()
export class FetchMatchByRoundUseCase {
  constructor(
    private matchRepository: MatchRepository,
    private roundRepository: RoundRepository,
  ) {}

  async execute({
    roundId,
    page,
  }: FetchMatchByRoundUseCaseRequest): Promise<FetchMatchByRoundUseCaseResponse> {
    const round = await this.roundRepository.findById(roundId)
    if (!round) {
      return left(new RoundNotFoundError())
    }
    const matchs = await this.matchRepository.findByRoundId(roundId, { page })

    return right({
      matchs,
    })
  }
}

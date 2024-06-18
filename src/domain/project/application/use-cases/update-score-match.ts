import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { MatchRepository } from '../repositories/match-repository'
import { MatchNotFoundError } from './errors/match-not-found-error'
import { MatchNotInProgressError } from './errors/match-not-in-progress-error'

interface UpdateScoreUseCaseRequest {
  matchId: string
  scoreHome: number
  scoreAway: number
  lastPlayerId: string
}

type UpdateScoreUseCaseResponse = Either<
  MatchNotFoundError | MatchNotInProgressError,
  null
>

@Injectable()
export class UpdateScoreUseCase {
  constructor(private matchRepository: MatchRepository) {}

  async execute({
    matchId,
    scoreHome,
    scoreAway,
    lastPlayerId,
  }: UpdateScoreUseCaseRequest): Promise<UpdateScoreUseCaseResponse> {
    const matchAlreadyExist = await this.matchRepository.findById(matchId)

    if (!matchAlreadyExist) {
      return left(new MatchNotFoundError())
    }
    // if (matchAlreadyExist.status === 'WAITING') {
    //   return left(new MatchNotInProgressError())
    // }

    await this.matchRepository.updatResult(
      matchId,
      scoreHome,
      scoreAway,
      lastPlayerId,
    )

    return right(null)
  }
}

import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { MatchRepository } from '../repositories/match-repository'
import { MatchNotFoundError } from './errors/match-not-found-error'
import { MatchForbiddenRemoveError } from './errors/match-forbidden-error'

interface RemoveMatchUseCaseRequest {
  matchId: string
}

type RemoveMatchUseCaseResponse = Either<
  MatchNotFoundError | MatchForbiddenRemoveError,
  null
>

@Injectable()
export class RemoveMatchUseCase {
  constructor(private matchRepository: MatchRepository) {}

  async execute({
    matchId,
  }: RemoveMatchUseCaseRequest): Promise<RemoveMatchUseCaseResponse> {
    const match = await this.matchRepository.findById(matchId)

    if (!match) {
      return left(new MatchNotFoundError())
    }
    if (match.status !== 'WAITING') {
      return left(new MatchForbiddenRemoveError())
    }

    await this.matchRepository.updateMatchStatus(matchId, 'INACTIVE')

    return right(null)
  }
}

import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { MatchRepository } from '../repositories/match-repository'
import { MatchNotFoundError } from './errors/match-not-found-error'
import { MatchStatus } from '@prisma/client'

interface UpdateMatchStatusUseCaseRequest {
  matchId: string
  status: MatchStatus
}

type UpdateMatchStatusUseCaseResponse = Either<MatchNotFoundError, null>

@Injectable()
export class UpdateMatchStatusUseCase {
  constructor(private matchRepository: MatchRepository) {}

  async execute({
    matchId,
    status,
  }: UpdateMatchStatusUseCaseRequest): Promise<UpdateMatchStatusUseCaseResponse> {
    const matchAlreadyExist = await this.matchRepository.findById(matchId)

    if (!matchAlreadyExist) {
      return left(new MatchNotFoundError())
    }

    await this.matchRepository.updateMatchStatus(matchId, status)

    return right(null)
  }
}

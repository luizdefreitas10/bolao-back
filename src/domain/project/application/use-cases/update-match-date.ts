import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { MatchRepository } from '../repositories/match-repository'
import { MatchNotFoundError } from './errors/match-not-found-error'

interface UpdateMatchDateUseCaseRequest {
  matchId: string
  date: Date
}

type UpdateMatchDateUseCaseResponse = Either<MatchNotFoundError, null>

@Injectable()
export class UpdateMatchDateUseCase {
  constructor(private matchRepository: MatchRepository) {}

  async execute({
    matchId,
    date,
  }: UpdateMatchDateUseCaseRequest): Promise<UpdateMatchDateUseCaseResponse> {
    const matchAlreadyExist = await this.matchRepository.findById(matchId)

    if (!matchAlreadyExist) {
      return left(new MatchNotFoundError())
    }

    await this.matchRepository.updateMatchDate(matchId, date)

    return right(null)
  }
}

import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { MatchRepository } from '../repositories/match-repository'
import { Match } from '../../enterprise/entities/match'
import { isPast } from 'date-fns'
import { MatchPastError } from './errors/match-past-error'
import { MatchAlreadyExistError } from './errors/match-already-exists'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface CreateMatchUseCaseRequest {
  teamIdHome: string
  teamIdAway: string
  roundId: string
  date: Date
}

type CreateMatchUseCaseResponse = Either<
  MatchPastError | MatchAlreadyExistError,
  {
    match: Match
  }
>

@Injectable()
export class CreateMatchUseCase {
  constructor(private matchRepository: MatchRepository) {}

  async execute({
    teamIdHome,
    teamIdAway,
    date,
    roundId,
  }: CreateMatchUseCaseRequest): Promise<CreateMatchUseCaseResponse> {
    if (isPast(date)) {
      return left(new MatchPastError())
    }

    const matchAlreadyExist =
      await this.matchRepository.findByTeamHomeAndTeamAwayAndDate(
        teamIdHome,
        teamIdAway,
        date,
      )

    if (matchAlreadyExist) {
      return left(new MatchAlreadyExistError())
    }

    const match = Match.create({
      roundId: new UniqueEntityID(roundId),
      date,
      scoreAway: 0,
      scoreHome: 0,
      teamIdAway: new UniqueEntityID(teamIdAway),
      teamIdHome: new UniqueEntityID(teamIdHome),
    })

    const matchCreated = await this.matchRepository.create(match)

    return right({
      match: matchCreated,
    })
  }
}

import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { MatchRepository } from '../repositories/match-repository'
import { Match } from '../../enterprise/entities/match'
import { isPast } from 'date-fns'
import { MatchPastError } from './errors/match-past-error'
import { MatchAlreadyExistError } from './errors/match-already-exists'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { TeamRepository } from '../repositories/team-repository'
import { RoundRepository } from '../repositories/round-repository'
import { TeamNotFoundError } from './errors/team-not-found'
import { RoundNotFoundError } from './errors/round-not-found-error'

interface CreateMatchUseCaseRequest {
  teamIdHome: string
  teamIdAway: string
  roundId: string
  date: Date
}

type CreateMatchUseCaseResponse = Either<
  | MatchPastError
  | MatchAlreadyExistError
  | RoundNotFoundError
  | TeamNotFoundError,
  {
    match: Match
  }
>

@Injectable()
export class CreateMatchUseCase {
  constructor(
    private matchRepository: MatchRepository,
    private teamRepository: TeamRepository,
    private roundRepository: RoundRepository,
  ) {}

  async execute({
    teamIdHome,
    teamIdAway,
    date,
    roundId,
  }: CreateMatchUseCaseRequest): Promise<CreateMatchUseCaseResponse> {
    if (isPast(date)) {
      return left(new MatchPastError())
    }

    const teamHomeAlreadyExist = await this.teamRepository.findById(teamIdHome)
    const teamAwayAlreadyExist = await this.teamRepository.findById(teamIdAway)
    if (!teamHomeAlreadyExist || !teamAwayAlreadyExist) {
      return left(new TeamNotFoundError())
    }

    const roundAlreadyExist = await this.roundRepository.findById(roundId)
    if (!roundAlreadyExist) {
      return left(new RoundNotFoundError())
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

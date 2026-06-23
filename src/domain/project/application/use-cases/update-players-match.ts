import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { MatchRepository } from '../repositories/match-repository'
import { PlayerRepository } from '../repositories/player-repository'
import { MatchNotFoundError } from './errors/match-not-found-error'

interface UpdatePlayersMatchUseCaseRequest {
  matchId: string
  lastPlayerTeamId: string
  players: string[]
}

type UpdatePlayersMatchUseCaseResponse = Either<
  MatchNotFoundError,
  {
    players: string[]
  }
>

@Injectable()
export class UpdatePlayersMatchUseCase {
  constructor(
    private matchRepository: MatchRepository,
    private playerRepository: PlayerRepository,
  ) {}

  async execute({
    matchId,
    lastPlayerTeamId,
    players,
  }: UpdatePlayersMatchUseCaseRequest): Promise<UpdatePlayersMatchUseCaseResponse> {
    const match = await this.matchRepository.findById(matchId)

    if (!match) {
      return left(new MatchNotFoundError())
    }

    await this.playerRepository.syncPlayersForRoundAndTeam(
      match.roundId.toString(),
      lastPlayerTeamId,
      players,
    )

    return right({ players })
  }
}

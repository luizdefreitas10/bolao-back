import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { PlayerRepository } from '../repositories/player-repository'
import { Player } from '../../enterprise/entities/player'

interface FetchPlayerByRoundUseCaseRequest {
  teamId: string
  roundId: string
}

type FetchPlayerByRoundUseCaseResponse = Either<
  null,
  {
    players: Player[]
  }
>

@Injectable()
export class FetchPlayerByTeamAndRoundUseCase {
  constructor(private playerRepository: PlayerRepository) {}

  async execute({
    teamId,
    roundId,
  }: FetchPlayerByRoundUseCaseRequest): Promise<FetchPlayerByRoundUseCaseResponse> {
    const players = await this.playerRepository.findByTeamAndRound(
      teamId,
      roundId,
    )

    return right({
      players,
    })
  }
}

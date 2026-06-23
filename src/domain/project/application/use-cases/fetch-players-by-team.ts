import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { PlayerRepository } from '../repositories/player-repository'
import { Player } from '../../enterprise/entities/player'

interface FetchPlayersByTeamUseCaseRequest {
  teamId: string
}

type FetchPlayersByTeamUseCaseResponse = Either<
  null,
  {
    players: Player[]
  }
>

@Injectable()
export class FetchPlayersByTeamUseCase {
  constructor(private playerRepository: PlayerRepository) {}

  async execute({
    teamId,
  }: FetchPlayersByTeamUseCaseRequest): Promise<FetchPlayersByTeamUseCaseResponse> {
    const players = await this.playerRepository.findByTeam(teamId)

    return right({ players })
  }
}

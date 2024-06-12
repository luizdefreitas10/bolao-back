import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Player } from '../../enterprise/entities/player'
import { PlayerAlreadyExistsError } from './errors/player-already-exist-error'
import { PlayerRepository } from '../repositories/player-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface CreatePlayerUseCaseRequest {
  name: string
  roundId: string
  teamId: string
}

type CreatePlayerUseCaseResponse = Either<
  PlayerAlreadyExistsError,
  {
    player: Player
  }
>

@Injectable()
export class CreatePlayerUseCase {
  constructor(private playerRepository: PlayerRepository) {}

  async execute({
    name,
    teamId,
    roundId,
  }: CreatePlayerUseCaseRequest): Promise<CreatePlayerUseCaseResponse> {
    const existPlayer = await this.playerRepository.findByTeamAndRound(
      teamId,
      roundId,
    )

    if (existPlayer.length > 0) {
      return left(new PlayerAlreadyExistsError(name))
    }
    const player = Player.create({
      name,
      status: 'ACTIVE',
      teamId: new UniqueEntityID(teamId),
      roundId: new UniqueEntityID(roundId),
    })

    const playerCreated = await this.playerRepository.create(player)
    return right({
      player: playerCreated,
    })
  }
}

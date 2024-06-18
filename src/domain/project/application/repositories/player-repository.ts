import { Player } from '../../enterprise/entities/player'

export abstract class PlayerRepository {
  abstract create(player: Player): Promise<Player>
  abstract findById(id: string): Promise<Player | null>
  abstract update(playerId: string, playerName: string): Promise<Player | null>

  abstract remove(playerId: string): Promise<void>
  abstract findByTeamAndRound(
    teamId: string,
    roundId: string,
  ): Promise<Player[]>

  abstract findByTeamAndRoundAndName(
    teamId: string,
    roundId: string,
    name: string,
  ): Promise<Player[]>
}

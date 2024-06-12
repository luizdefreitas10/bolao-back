import { PlayerRepository } from '@/domain/project/application/repositories/player-repository'
import { Player } from '@/domain/project/enterprise/entities/player'

export class InMemoryPlayerRepository implements PlayerRepository {
  public items: Player[] = []
  async update(playerId: string, playerName: string): Promise<Player | null> {
    const teamIndex = this.items.findIndex(
      (item) => item.id.toString() === playerId,
    )

    if (teamIndex === -1) {
      return null
    }

    this.items[teamIndex].name = playerName

    return this.items[teamIndex]
  }

  async remove(playerId: string): Promise<void> {
    const player = this.items.find((item) => item.id.toString() === playerId)

    if (!player) {
      throw new Error('player not found')
    }

    player.status = 'INACTIVE'
  }

  async findByTeamAndRound(teamId: string, roundId: string): Promise<Player[]> {
    const players = this.items.filter(
      (item) =>
        item.teamId.toString() === teamId &&
        item.roundId.toString() === roundId,
    )

    return players
  }

  async create(player: Player): Promise<Player> {
    this.items.push(player)
    return player
  }

  async findById(id: string): Promise<Player | null> {
    const player = this.items.find((item) => item.id.toString() === id)

    if (!player) {
      return null
    }

    return player
  }
}

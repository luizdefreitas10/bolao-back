import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PredictionLastPlayerRepository } from '@/domain/project/application/repositories/prediction-last-player-repository'
import { PredictionLastPlayer } from '@/domain/project/enterprise/entities/prediction-last-player'

export class InMemoryPredictionLastPlayerRepository
  implements PredictionLastPlayerRepository
{
  public items: PredictionLastPlayer[] = []
  async update(
    id: string,
    playerId: string,
  ): Promise<PredictionLastPlayer | null> {
    const teamIndex = this.items.findIndex((item) => item.id.toString() === id)

    if (teamIndex === -1) {
      return null
    }

    this.items[teamIndex].playerId = new UniqueEntityID(playerId)

    return this.items[teamIndex]
  }

  async remove(id: string): Promise<void> {
    const prediction = this.items.find((item) => item.id.toString() === id)

    if (!prediction) {
      throw new Error('prediction not found')
    }

    prediction.status = 'INACTIVE'
  }

  async findByUser(userId: string): Promise<PredictionLastPlayer[]> {
    const predictions = this.items.filter(
      (item) => item.userId.toString() === userId,
    )

    return predictions
  }

  async findByRoundAndTeamAndUser(
    roundId: string,
    teamId: string,
    userId: string,
  ): Promise<PredictionLastPlayer | null> {
    const prediction = this.items.find(
      (item) =>
        item.userId.toString() === userId &&
        item.roundId.toString() === roundId &&
        item.teamId.toString() === teamId,
    )

    if (!prediction) {
      return null
    }

    return prediction
  }

  async create(
    prediction: PredictionLastPlayer,
  ): Promise<PredictionLastPlayer> {
    this.items.push(prediction)
    return prediction
  }

  async findById(id: string): Promise<PredictionLastPlayer | null> {
    const prediction = this.items.find((item) => item.id.toString() === id)

    if (!prediction) {
      return null
    }

    return prediction
  }
}

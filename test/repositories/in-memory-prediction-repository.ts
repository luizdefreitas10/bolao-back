import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PredictionRepository } from '@/domain/project/application/repositories/prediction-repository'
import { Prediction } from '@/domain/project/enterprise/entities/prediction'
import { $Enums } from '@prisma/client'

export class InMemoryPredictionRepository implements PredictionRepository {
  async updatePlayer(
    predicitonId: string,
    playerId: string,
  ): Promise<Prediction | null> {
    const teamIndex = this.items.findIndex(
      (item) => item.id.toString() === predicitonId,
    )

    if (teamIndex === -1) {
      return null
    }

    this.items[teamIndex].lastPlayerId = new UniqueEntityID(playerId)

    return this.items[teamIndex]
  }

  async updateScore(
    predicitonId: string,
    predictionHome: number,
    predictionAway: number,
  ): Promise<Prediction | null> {
    const teamIndex = this.items.findIndex(
      (item) => item.id.toString() === predicitonId,
    )

    if (teamIndex === -1) {
      return null
    }

    this.items[teamIndex].predictionAway = predictionAway
    this.items[teamIndex].predictionHome = predictionHome

    return this.items[teamIndex]
  }

  public items: Prediction[] = []

  async findByUserAndMatchAndType(
    userId: string,
    matchId: string,
    type: $Enums.PredictionType,
  ): Promise<Prediction | null> {
    const prediction = this.items.find(
      (item) =>
        item.userId.toString() === userId &&
        item.matchId.toString() === matchId &&
        item.predictionType === type,
    )

    if (!prediction) {
      return null
    }

    return prediction
  }

  async create(prediction: Prediction): Promise<Prediction> {
    this.items.push(prediction)
    return prediction
  }

  async findByUser(userId: string): Promise<Prediction[]> {
    const prediction = this.items.filter(
      (item) => item.userId.toString() === userId,
    )

    return prediction
  }

  async findById(id: string): Promise<Prediction | null> {
    const prediction = this.items.find((item) => item.id.toString() === id)

    if (!prediction) {
      return null
    }

    return prediction
  }

  async findByUserAndMatch(
    userId: string,
    matchId: string,
  ): Promise<Prediction | null> {
    const prediction = this.items.find(
      (item) =>
        item.userId.toString() === userId &&
        item.matchId.toString() === matchId,
    )

    if (!prediction) {
      return null
    }

    return prediction
  }
}

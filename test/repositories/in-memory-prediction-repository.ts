import { PredictionRepository } from '@/domain/project/application/repositories/prediction-repository'
import { Prediction } from '@/domain/project/enterprise/entities/prediction'

export class InMemoryPredictionRepository implements PredictionRepository {
  public items: Prediction[] = []

  async create(prediction: Prediction): Promise<Prediction> {
    this.items.push(prediction)
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

import { Prediction as PrismaPrediction, Prisma } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Prediction } from '@/domain/project/enterprise/entities/prediction'

export class PrismaPredictionMapper {
  static toDomain(raw: PrismaPrediction): Prediction {
    return Prediction.create(
      {
        matchId: new UniqueEntityID(raw.matchId),
        predictionAway: raw.predictionAway,
        predictionHome: raw.predictionHome,
        userId: new UniqueEntityID(raw.userId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    prediction: Prediction,
  ): Prisma.PredictionUncheckedCreateInput {
    return {
      id: prediction.id.toString(),
      matchId: prediction.matchId.toString(),
      userId: prediction.userId.toString(),
      predictionAway: prediction.predictionAway,
      predictionHome: prediction.predictionHome,
      createdAt: prediction.createdAt,
      updatedAt: prediction.updatedAt,
    }
  }
}

import {
  Prediction as PrismaPrediction,
  Prisma,
  MatchStatus,
} from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Prediction } from '@/domain/project/enterprise/entities/prediction'
import { TeamPropsMatch } from '@/domain/project/enterprise/entities/round'

type PredictionProps = PrismaPrediction & {
  match: {
    scoreAway: number
    scoreHome: number
    teamHome: TeamPropsMatch
    teamAway: TeamPropsMatch
    date: Date
    status: MatchStatus
  }
}

export class PrismaPredictionMapper {
  static toDomainWithMatch(raw: PredictionProps): Prediction {
    return Prediction.create(
      {
        predictionAway: raw.predictionAway,
        predictionHome: raw.predictionHome,
        match: raw.match,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        userId: new UniqueEntityID(raw.userId),
        matchId: new UniqueEntityID(raw.matchId),
      },
      new UniqueEntityID(raw.id),
    )
  }

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

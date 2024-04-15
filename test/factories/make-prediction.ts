import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { MatchProps } from '@/domain/project/enterprise/entities/match'
import {
  Prediction,
  PredictionProps,
} from '@/domain/project/enterprise/entities/prediction'
import { PrismaPredictionMapper } from '@/infra/database/prisma/mappers/prisma-prediction-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makePrediction(
  override: Partial<MatchProps> = {},
  id?: UniqueEntityID,
) {
  const prediction = Prediction.create(
    {
      matchId: new UniqueEntityID(),
      userId: new UniqueEntityID(),
      predictionHome: 0,
      predictionAway: 0,
      ...override,
    },
    id,
  )

  return prediction
}

@Injectable()
export class PredictionFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaPrediction(
    data: Partial<PredictionProps> = {},
  ): Promise<Prediction> {
    const prediction = makePrediction(data)

    await this.prisma.prediction.create({
      data: PrismaPredictionMapper.toPrisma(prediction),
    })

    return prediction
  }
}

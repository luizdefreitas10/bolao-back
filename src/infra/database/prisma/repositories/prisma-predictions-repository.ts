import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PredictionRepository } from '@/domain/project/application/repositories/prediction-repository'
import { PrismaPredictionMapper } from '../mappers/prisma-prediction-mapper'
import { Prediction } from '@/domain/project/enterprise/entities/prediction'

@Injectable()
export class PrismaPredictionRepository implements PredictionRepository {
  constructor(private prisma: PrismaService) {}
  async findByUserAndMatch(
    userId: string,
    matchId: string,
  ): Promise<Prediction | null> {
    const prediction = await this.prisma.prediction.findFirst({
      where: {
        matchId,
        userId,
      },
    })

    if (!prediction) {
      return null
    }

    return PrismaPredictionMapper.toDomain(prediction)
  }

  async findById(id: string): Promise<Prediction | null> {
    const prediction = await this.prisma.prediction.findUnique({
      where: {
        id,
      },
    })

    if (!prediction) {
      return null
    }

    return PrismaPredictionMapper.toDomain(prediction)
  }

  async create(prediction: Prediction): Promise<Prediction> {
    const data = PrismaPredictionMapper.toPrisma(prediction)

    const newPrediction = await this.prisma.prediction.create({
      data,
    })
    return PrismaPredictionMapper.toDomain(newPrediction)
  }
}

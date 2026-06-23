import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PredictionRepository } from '@/domain/project/application/repositories/prediction-repository'
import { PrismaPredictionMapper } from '../mappers/prisma-prediction-mapper'
import { Prediction } from '@/domain/project/enterprise/entities/prediction'
import { $Enums } from '@prisma/client'

@Injectable()
export class PrismaPredictionRepository implements PredictionRepository {
  constructor(private prisma: PrismaService) {}
  async updatePlayer(id: string, playerId: string): Promise<Prediction | null> {
    const predictionExists = await this.prisma.prediction.findUnique({
      where: {
        id,
      },
    })

    if (!predictionExists) {
      return null
    }

    const newPrediction = await this.prisma.prediction.update({
      where: {
        id,
      },
      data: {
        lastPlayerId: playerId,
        updatedAt: new Date(),
      },
    })

    return PrismaPredictionMapper.toDomain(newPrediction)
  }

  async updateScore(
    id: string,
    predictionHome: number,
    predictionAway: number,
  ): Promise<Prediction | null> {
    const predictionExists = await this.prisma.prediction.findUnique({
      where: {
        id,
      },
    })

    if (!predictionExists) {
      return null
    }

    const newPrediction = await this.prisma.prediction.update({
      where: {
        id,
      },
      data: {
        predictionHome,
        predictionAway,
        updatedAt: new Date(),
      },
    })

    return PrismaPredictionMapper.toDomain(newPrediction)
  }

  async findByUserAndMatchAndType(
    userId: string,
    matchId: string,
    type: $Enums.PredictionType,
  ): Promise<Prediction | null> {
    const prediction = await this.prisma.prediction.findFirst({
      where: {
        matchId,
        userId,
        predictionType: type,
      },
    })

    if (!prediction) {
      return null
    }

    return PrismaPredictionMapper.toDomain(prediction)
  }

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

  async findByUser(id: string): Promise<Prediction[]> {
    const prediction = await this.prisma.prediction.findMany({
      where: {
        userId: id,
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
        matchId: true,
        predictionAway: true,
        predictionHome: true,
        lastPlayerId: true,
        predictionType: true,
        lastPlayer: {
          select: {
            name: true,
            photoUrl: true,
            team: {
              select: {
                name: true,
              },
            },
          },
        },
        match: {
          select: {
            date: true,
            scoreAway: true,
            scoreHome: true,
            status: true,
            roundId: true,
            lastPlayerId: true,
            lastPlayer: {
              select: {
                name: true,
              },
            },
            round: {
              select: {
                name: true,
              },
            },
            teamAway: {
              select: {
                name: true,
                logoUrl: true,
              },
            },
            teamHome: {
              select: {
                name: true,
                logoUrl: true,
              },
            },
          },
        },
      },
    })

    return prediction.map(PrismaPredictionMapper.toDomainWithMatch)
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

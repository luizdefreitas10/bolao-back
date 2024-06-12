import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PredictionLastPlayerRepository } from '@/domain/project/application/repositories/prediction-last-player-repository'
import { PredictionLastPlayer } from '@/domain/project/enterprise/entities/prediction-last-player'
import { PrismaPredictionLastPlayerMapper } from '../mappers/prisma-prediction-last-player-mapper'

@Injectable()
export class PrismaPredictionLastPlayerRepository
  implements PredictionLastPlayerRepository
{
  constructor(private prisma: PrismaService) {}
  async findByRoundAndTeamAndUser(
    roundId: string,
    teamId: string,
    userId: string,
  ): Promise<PredictionLastPlayer | null> {
    const prediction = await this.prisma.predictionLastPlayer.findFirst({
      where: {
        roundId,
        teamId,
        userId,
        status: 'ACTIVE',
      },
    })

    if (!prediction) {
      return null
    }

    return PrismaPredictionLastPlayerMapper.toDomain(prediction)
  }

  async update(
    id: string,
    playerId: string,
  ): Promise<PredictionLastPlayer | null> {
    const predictionExists = await this.prisma.predictionLastPlayer.findUnique({
      where: {
        id,
      },
    })

    if (!predictionExists) {
      return null
    }

    const newPrediction = await this.prisma.predictionLastPlayer.update({
      where: {
        id,
      },
      data: {
        playerId,
        updatedAt: new Date(),
      },
    })

    return PrismaPredictionLastPlayerMapper.toDomain(newPrediction)
  }

  async findByUser(userId: string): Promise<PredictionLastPlayer[]> {
    const predictions = await this.prisma.predictionLastPlayer.findMany({
      where: {
        userId,
        status: 'ACTIVE',
      },
    })

    return predictions.map(PrismaPredictionLastPlayerMapper.toDomain)
  }

  async remove(id: string): Promise<void> {
    await this.prisma.predictionLastPlayer.update({
      where: {
        id,
      },
      data: {
        status: 'INACTIVE',
      },
    })
  }

  async findById(id: string): Promise<PredictionLastPlayer | null> {
    const prediction = await this.prisma.predictionLastPlayer.findUnique({
      where: {
        id,
      },
    })

    if (!prediction) {
      return null
    }

    return PrismaPredictionLastPlayerMapper.toDomain(prediction)
  }

  async create(
    prediction: PredictionLastPlayer,
  ): Promise<PredictionLastPlayer> {
    const data = PrismaPredictionLastPlayerMapper.toPrisma(prediction)

    const newPrediction = await this.prisma.predictionLastPlayer.create({
      data,
    })
    return PrismaPredictionLastPlayerMapper.toDomain(newPrediction)
  }
}
